import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  autoReplyFor,
  buildInitialChatState,
  createSupportChatBundle,
  seedMessagesForThread,
  threadSeeds,
  type ChatMessage,
  type ChatPersistedState,
  type ChatThread,
} from "@/src/data/chat";
import { loadChatState, saveChatState, withStorageTimeout } from "@/src/store/persistence";
import { useShop } from "@/src/store/ShopContext";
import { normalizeOrderStatus, trackingSteps, type Order } from "@/src/types/orders";

function nowLabel() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function orderStatusLabel(order: Order): string {
  const status = normalizeOrderStatus(order.status);
  if (status === "cancelled") return "Cancelado";
  return trackingSteps.find((step) => step.id === status)?.title ?? "En proceso";
}

function resolveSeedMeta(threadId: string) {
  if (threadId === "2") return threadSeeds["2"];
  if (threadId === "3") return threadSeeds["3"];
  return threadSeeds["1"];
}

interface ChatContextValue {
  threads: ChatThread[];
  hydrated: boolean;
  getMessages: (threadId: string) => ChatMessage[];
  getThreadMeta: (threadId: string) => { title: string; subtitle: string };
  isTyping: (threadId: string) => boolean;
  markThreadRead: (threadId: string) => void;
  sendMessage: (threadId: string, text: string) => boolean;
  /** Crea un hilo de soporte nuevo con bienvenida fresca y devuelve su id. */
  startNewSupportChat: () => string;
  /** Borra todo el historial de chats (lista vacía; no re-seed). */
  clearChats: () => void;
  /** Elimina un hilo concreto y sus mensajes. */
  deleteThread: (threadId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { orders } = useShop();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
  const [typingByThread, setTypingByThread] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const replyTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  useEffect(() => {
    let cancelled = false;
    withStorageTimeout(loadChatState(), null)
      .then((saved) => {
        if (cancelled) return;
        const initial = saved ?? buildInitialChatState();
        setThreads(initial.threads);
        setMessagesByThread(initial.messagesByThread);
      })
      .catch(() => {
        if (cancelled) return;
        const initial = buildInitialChatState();
        setThreads(initial.threads);
        setMessagesByThread(initial.messagesByThread);
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: ChatPersistedState = { threads, messagesByThread };
    void saveChatState(state);
  }, [threads, messagesByThread, hydrated]);

  useEffect(() => {
    return () => {
      Object.values(replyTimers.current).forEach(clearTimeout);
    };
  }, []);

  const getMessages = useCallback(
    (threadId: string) => {
      return messagesByThread[threadId] ?? seedMessagesForThread(threadId);
    },
    [messagesByThread],
  );

  const getThreadMeta = useCallback(
    (threadId: string) => {
      const fromList = threads.find((thread) => thread.id === threadId);
      if (fromList) {
        return { title: fromList.title, subtitle: fromList.subtitle };
      }
      const meta = resolveSeedMeta(threadId);
      return { title: meta.title, subtitle: meta.subtitle };
    },
    [threads],
  );

  const isTyping = useCallback((threadId: string) => Boolean(typingByThread[threadId]), [typingByThread]);

  const markThreadRead = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) => (thread.id === threadId ? { ...thread, unread: 0 } : thread)),
    );
  }, []);

  const startNewSupportChat = useCallback(() => {
    const id = `support-${Date.now()}`;
    const { thread, messages } = createSupportChatBundle(id, nowLabel());
    setThreads((prev) => [thread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [id]: messages }));
    return id;
  }, []);

  const clearChats = useCallback(() => {
    Object.values(replyTimers.current).forEach(clearTimeout);
    replyTimers.current = {};
    setThreads([]);
    setMessagesByThread({});
    setTypingByThread({});
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    if (replyTimers.current[threadId]) {
      clearTimeout(replyTimers.current[threadId]);
      delete replyTimers.current[threadId];
    }
    setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
    setMessagesByThread((prev) => {
      const next = { ...prev };
      delete next[threadId];
      return next;
    });
    setTypingByThread((prev) => {
      if (!(threadId in prev)) return prev;
      const next = { ...prev };
      delete next[threadId];
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    (threadId: string, raw: string) => {
      const text = raw.trim();
      if (!text || typingByThread[threadId] || replyTimers.current[threadId]) return false;

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        from: "user",
        text,
        at: nowLabel(),
      };

      setMessagesByThread((prev) => {
        const existing = prev[threadId] ?? seedMessagesForThread(threadId);
        return { ...prev, [threadId]: [...existing, userMessage] };
      });

      setThreads((prev) => {
        const next = prev.map((thread) =>
          thread.id === threadId
            ? { ...thread, preview: text, time: nowLabel(), unread: 0 }
            : thread,
        );
        const idx = next.findIndex((thread) => thread.id === threadId);
        if (idx <= 0) return next;
        const [moved] = next.splice(idx, 1);
        return [moved, ...next];
      });

      setTypingByThread((prev) => ({ ...prev, [threadId]: true }));

      if (replyTimers.current[threadId]) {
        clearTimeout(replyTimers.current[threadId]);
      }

      const latest = ordersRef.current[0];
      const reply = autoReplyFor(text, threadId, {
        latestOrder: latest
          ? { id: latest.id, statusLabel: orderStatusLabel(latest) }
          : null,
      });
      replyTimers.current[threadId] = setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `b-${Date.now()}`,
          from: "bot",
          text: reply,
          at: nowLabel(),
        };

        setMessagesByThread((prev) => {
          const existing = prev[threadId] ?? seedMessagesForThread(threadId);
          return { ...prev, [threadId]: [...existing, botMessage] };
        });

        setThreads((prev) =>
          prev.map((thread) =>
            thread.id === threadId
              ? { ...thread, preview: reply, time: nowLabel(), unread: 0 }
              : thread,
          ),
        );

        setTypingByThread((prev) => ({ ...prev, [threadId]: false }));
        delete replyTimers.current[threadId];
      }, 650);

      return true;
    },
    [typingByThread],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      threads,
      hydrated,
      getMessages,
      getThreadMeta,
      isTyping,
      markThreadRead,
      sendMessage,
      startNewSupportChat,
      clearChats,
      deleteThread,
    }),
    [
      threads,
      hydrated,
      getMessages,
      getThreadMeta,
      isTyping,
      markThreadRead,
      sendMessage,
      startNewSupportChat,
      clearChats,
      deleteThread,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}

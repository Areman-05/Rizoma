import { useMemo } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { Headphones, Leaf, MessageCircle, Package, Sparkles, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { EmptyState, emptyIconTone } from "@/src/components/ui/EmptyState";
import { type ChatThread } from "@/src/data/chat";
import { useChat } from "@/src/store/ChatContext";
import { colors } from "@/src/theme/tokens";

function AvatarIcon({ tone }: { tone: ChatThread["avatarTone"] }) {
  if (tone === "support") return <Headphones size={18} color={colors.brand} />;
  if (tone === "faq") return <Leaf size={18} color={colors.brand} />;
  return <Sparkles size={18} color={colors.brand} />;
}

function ThreadRow({
  thread,
  onOpen,
  onDelete,
}: {
  thread: ChatThread;
  onOpen: (id: string) => void;
  onDelete: (thread: ChatThread) => void;
}) {
  const unread = thread.unread > 0;

  return (
    <View
      className={`flex-row items-center gap-1 rounded-3xl pl-3 pr-1 py-3 ${
        unread ? "bg-rizoma-brandSoft" : "bg-transparent"
      }`}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir chat ${thread.title}${unread ? `, ${thread.unread} sin leer` : ""}`}
        onPress={() => onOpen(thread.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
        className="min-w-0 flex-1 flex-row items-center gap-3"
      >
        <View className="h-12 w-12 items-center justify-center rounded-full border border-rizoma-border bg-white">
          <AvatarIcon tone={thread.avatarTone} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className="flex-1 text-base text-rizoma-black"
              style={{ fontFamily: "Inter_700Bold" }}
              numberOfLines={1}
            >
              {thread.title}
            </Text>
            <Text className="text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_500Medium" }}>
              {thread.time}
            </Text>
          </View>
          <Text className="mt-0.5 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
            {thread.subtitle}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text
              className="flex-1 text-sm text-rizoma-secondaryText"
              style={{ fontFamily: unread ? "Inter_600SemiBold" : "Inter_400Regular" }}
              numberOfLines={1}
            >
              {thread.preview}
            </Text>
            {unread ? (
              <View className="min-w-[20px] items-center justify-center rounded-full bg-rizoma-brand px-1.5 py-0.5">
                <Text className="text-[11px] text-white" style={{ fontFamily: "Inter_700Bold" }}>
                  {thread.unread > 9 ? "9+" : thread.unread}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Eliminar chat ${thread.title}`}
        onPress={() => onDelete(thread)}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="h-11 w-11 items-center justify-center"
      >
        <Trash2 size={16} color={colors.red} />
      </Pressable>
    </View>
  );
}

function SupportCta({ onPress }: { onPress: () => void }) {
  return (
    <View className="items-center rounded-3xl bg-rizoma-brandSoft px-4 py-5">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-white">
        <Headphones size={22} color={colors.brand} />
      </View>
      <Text className="text-center text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        ¿Necesitas ayuda?
      </Text>
      <Text
        className="mt-1 text-center text-sm text-rizoma-secondaryText"
        style={{ fontFamily: "Inter_400Regular" }}
      >
        Abre un chat nuevo con Soporte Rizoma para pedidos, cuidados o devoluciones.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hablar con soporte, chat nuevo"
        onPress={onPress}
        className="mt-4 rounded-full bg-rizoma-brand px-5 py-3"
      >
        <Text className="text-sm text-white" style={{ fontFamily: "Inter_700Bold" }}>
          Hablar con soporte
        </Text>
      </Pressable>
    </View>
  );
}

export default function ChatScreen() {
  const { threads, hydrated, markThreadRead, startNewSupportChat, deleteThread } = useChat();
  const hasThreads = threads.length > 0;
  const totalUnread = useMemo(() => threads.reduce((sum, t) => sum + t.unread, 0), [threads]);

  const openThread = (id: string) => {
    markThreadRead(id);
    router.push(`/chat/${id}`);
  };

  const openNewSupport = () => {
    const id = startNewSupportChat();
    markThreadRead(id);
    router.push(`/chat/${id}`);
  };

  const confirmDeleteThread = (thread: ChatThread) => {
    Alert.alert("¿Eliminar este chat?", `Se borrará «${thread.title}» del historial.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteThread(thread.id) },
    ]);
  };

  if (!hydrated) {
    return (
      <Screen>
        <ScreenHeader title="Chat" showBack={false} />
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  if (!hasThreads) {
    return (
      <Screen>
        <ScreenHeader title="Chat" showBack={false} />
        <EmptyState
          title="Sin conversaciones"
          description="Cuando hables con soporte, tus chats anteriores aparecerán aquí."
          icon={<MessageCircle size={24} color={emptyIconTone} />}
          actionLabel="Hablar con soporte"
          onActionPress={openNewSupport}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Chat" showBack={false} />

      <Text className="mb-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Ayuda, cuidados y conversación con el equipo Rizoma.
      </Text>

      <View className="mt-4">
        <SupportCta onPress={openNewSupport} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver mis pedidos"
        onPress={() => router.push("/orders")}
        className="mb-5 mt-4 flex-row items-center gap-3 rounded-3xl bg-rizoma-gray px-4 py-3.5"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          <Package size={18} color={colors.brand} />
        </View>
        <View className="flex-1">
          <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
            Mis pedidos
          </Text>
          <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            Consulta envíos y seguimiento
          </Text>
        </View>
        <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
          Ver
        </Text>
      </Pressable>

      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
          Chats anteriores
        </Text>
        {totalUnread > 0 ? (
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            {totalUnread} sin leer
          </Text>
        ) : null}
      </View>

      <View className="gap-1">
        {threads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            onOpen={openThread}
            onDelete={confirmDeleteThread}
          />
        ))}
      </View>
    </Screen>
  );
}

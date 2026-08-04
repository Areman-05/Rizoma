import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Package, Send } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { quickSuggestions, type ChatMessage } from "@/src/data/chat";
import { useChat } from "@/src/store/ChatContext";
import { colors } from "@/src/theme/tokens";

const CHIP_COOLDOWN_MS = 1000;

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threadId = id ?? "1";
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { hydrated, getMessages, getThreadMeta, isTyping, markThreadRead, sendMessage } = useChat();

  const meta = getThreadMeta(threadId);
  const messages = getMessages(threadId);
  const typing = isTyping(threadId);

  const [input, setInput] = useState("");
  const [disabledChip, setDisabledChip] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    markThreadRead(threadId);
  }, [hydrated, threadId, markThreadRead]);

  useEffect(() => {
    setInput("");
    setDisabledChip(null);
  }, [threadId]);

  useEffect(() => {
    if (!disabledChip) return;
    const timer = setTimeout(() => setDisabledChip(null), CHIP_COOLDOWN_MS);
    return () => clearTimeout(timer);
  }, [disabledChip]);

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages.length, typing]);

  const send = (raw: string, fromChip?: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    if (fromChip && disabledChip === fromChip) return;

    const ok = sendMessage(threadId, text);
    if (!ok) return;

    setInput("");
    if (fromChip) setDisabledChip(fromChip);
    scrollToEnd();
  };

  const canSend = input.trim().length > 0 && !typing;
  const bottomPad = Math.max(insets.bottom, 10);

  if (!hydrated) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1">
          <ScreenHeader title={meta.title} showBell={false} />
          <Text
            className="-mt-2 mb-3 text-center text-xs text-rizoma-secondaryText"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            {meta.subtitle}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir a mis pedidos"
            onPress={() => router.push("/orders")}
            className="mb-3 flex-row items-center gap-2 self-start rounded-full bg-rizoma-brandSoft px-3 py-2"
          >
            <Package size={14} color={colors.brand} />
            <Text className="text-xs text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              Ver mis pedidos
            </Text>
          </Pressable>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 12, gap: 10, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToEnd}
            renderItem={({ item }) => {
              const isUser = item.from === "user";
              return (
                <View
                  className={`max-w-[82%] px-4 py-3 ${
                    isUser
                      ? "self-end rounded-3xl rounded-br-lg bg-rizoma-brand"
                      : "self-start rounded-3xl rounded-bl-lg bg-rizoma-gray"
                  }`}
                  accessibilityRole="text"
                  accessibilityLabel={`${isUser ? "Tú" : "Soporte"}: ${item.text}`}
                >
                  <Text
                    className={isUser ? "text-[15px] text-white" : "text-[15px] text-rizoma-black"}
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    {item.text}
                  </Text>
                  <Text
                    className={`mt-1.5 text-[10px] ${isUser ? "text-right text-white/75" : "text-rizoma-grayText"}`}
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    {item.at}
                  </Text>
                </View>
              );
            }}
            ListFooterComponent={
              typing ? (
                <View className="self-start rounded-3xl rounded-bl-lg bg-rizoma-gray px-4 py-3">
                  <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
                    Escribiendo…
                  </Text>
                </View>
              ) : null
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2 max-h-11"
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {quickSuggestions.map((label) => {
              const chipDisabled = typing || disabledChip === label;
              return (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={`Sugerencia: ${label}`}
                  accessibilityState={{ disabled: chipDisabled }}
                  disabled={chipDisabled}
                  onPress={() => send(label, label)}
                  className={`rounded-full border border-rizoma-border px-3.5 py-2 ${
                    chipDisabled ? "bg-rizoma-gray opacity-60" : "bg-white"
                  }`}
                >
                  <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View
            className="flex-row items-center gap-2 border-t border-rizoma-border pt-3"
            style={{ paddingBottom: bottomPad }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Escribe un mensaje…"
              placeholderTextColor={colors.grayText}
              accessibilityLabel="Mensaje de chat"
              returnKeyType="send"
              onSubmitEditing={() => send(input)}
              className="flex-1 rounded-full border border-rizoma-border bg-rizoma-gray px-4 py-3 text-rizoma-black"
              style={{ fontFamily: "Inter_400Regular", fontSize: 15 }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              onPress={() => send(input)}
              className={`h-12 w-12 items-center justify-center rounded-full ${
                canSend ? "bg-rizoma-brand" : "bg-rizoma-gray"
              }`}
            >
              <Send size={18} color={canSend ? "#FFFFFF" : colors.grayText} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

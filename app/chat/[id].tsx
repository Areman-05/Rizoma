import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { colors } from "@/src/theme/tokens";

const threadMeta: Record<string, { title: string; seed: string[] }> = {
  "1": {
    title: "Soporte Rizoma",
    seed: ["Hola, ¿en qué podemos ayudarte hoy?", "Puedes preguntar por envíos, riegos o pet-friendly."],
  },
  "2": {
    title: "FAQ rápida",
    seed: ["Envío gratis desde 40 EUR.", "Las fichas muestran luz, riego y seguridad para mascotas."],
  },
  "3": {
    title: "Feedback",
    seed: ["Cuenta qué te ha parecido el catálogo Rizoma.", "Tu feedback nos ayuda a pulir la experiencia."],
  },
};

type Message = { id: string; from: "bot" | "user"; text: string; at: string };

function nowLabel() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meta = threadMeta[id ?? "1"] ?? threadMeta["1"];
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() =>
    meta.seed.map((text, index) => ({ id: `seed-${index}`, from: "bot", text, at: "Ahora" })),
  );

  const reply = useMemo(
    () => "Gracias por tu mensaje. Un especialista Rizoma te respondería aquí en la versión completa.",
    [],
  );

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: "user", text, at: nowLabel() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, from: "bot", text: reply, at: nowLabel() }]);
      setTyping(false);
    }, 700);
  };

  return (
    <Screen>
      <ScreenHeader title={meta.title} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 12, gap: 10 }}
        ListEmptyComponent={
          <View className="mt-8 items-center px-4">
            <Text className="text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Empieza la conversación
            </Text>
            <Text className="mt-2 text-center text-sm text-rizoma-secondaryText">
              Pregunta por envíos, riegos o disponibilidad.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            className={`max-w-[85%] rounded-3xl px-4 py-3 ${item.from === "user" ? "self-end bg-rizoma-brand" : "self-start bg-rizoma-gray"}`}
          >
            <Text
              className={item.from === "user" ? "text-white" : "text-rizoma-black"}
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {item.text}
            </Text>
            <Text
              className={`mt-1 text-[10px] ${item.from === "user" ? "text-white/80" : "text-rizoma-grayText"}`}
            >
              {item.at}
            </Text>
          </View>
        )}
        ListFooterComponent={
          typing ? (
            <View className="self-start rounded-3xl bg-rizoma-gray px-4 py-3">
              <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
                Escribiendo…
              </Text>
            </View>
          ) : null
        }
      />
      <View className="flex-row items-center gap-2 border-t border-rizoma-border pt-3">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={colors.grayText}
          className="flex-1 rounded-full border border-rizoma-border bg-white px-4 py-3"
          style={{ fontFamily: "Inter_400Regular" }}
        />
        <Pressable
          accessibilityLabel="Enviar mensaje"
          onPress={send}
          className="rounded-full bg-rizoma-brand px-4 py-3"
        >
          <Text className="text-white" style={{ fontFamily: "Inter_700Bold" }}>
            Enviar
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

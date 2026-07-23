import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { colors } from "@/src/theme/tokens";

const threadMeta: Record<string, { title: string; seed: string[] }> = {
  "1": {
    title: "Soporte Rizoma",
    seed: ["Hola, ¿en que podemos ayudarte hoy?", "Puedes preguntar por envios, riegos o pet-friendly."],
  },
  "2": {
    title: "FAQ rapida",
    seed: ["Envio gratis desde 40 EUR.", "Las fichas muestran luz, riego y seguridad para mascotas."],
  },
  "3": {
    title: "Feedback",
    seed: ["Cuenta que te ha parecido el catalogo Rizoma.", "Tu feedback nos ayuda a pulir la experiencia."],
  },
};

type Message = { id: string; from: "bot" | "user"; text: string };

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meta = threadMeta[id ?? "1"] ?? threadMeta["1"];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() =>
    meta.seed.map((text, index) => ({ id: `seed-${index}`, from: "bot", text })),
  );

  const reply = useMemo(
    () => "Gracias por tu mensaje. Un especialista Rizoma te responderia aqui en la version completa.",
    [],
  );

  return (
    <Screen>
      <ScreenHeader title={meta.title} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View className={`max-w-[85%] rounded-3xl px-4 py-3 ${item.from === "user" ? "self-end bg-rizoma-brand" : "self-start bg-rizoma-gray"}`}>
            <Text
              className={item.from === "user" ? "text-white" : "text-rizoma-black"}
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {item.text}
            </Text>
          </View>
        )}
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
          onPress={() => {
            const text = input.trim();
            if (!text) return;
            setMessages((prev) => [
              ...prev,
              { id: `u-${Date.now()}`, from: "user", text },
              { id: `b-${Date.now()}`, from: "bot", text: reply },
            ]);
            setInput("");
          }}
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

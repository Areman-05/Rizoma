import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { RizomaButton } from "@/src/components/ui/RizomaButton";

const threads = [
  { id: "1", title: "Soporte Rizoma", preview: "¿En qué podemos ayudarte hoy?", time: "Ahora" },
  { id: "2", title: "FAQ rápida", preview: "Envíos, riegos y pet-friendly", time: "Ayer" },
  { id: "3", title: "Feedback", preview: "Cuéntanos tu experiencia", time: "Lun" },
];

export default function ChatScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Chat" showBack={false} />
      <Text className="mb-4 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Ayuda, FAQ y conversación con el equipo Rizoma.
      </Text>

      <View className="gap-3">
        {threads.map((thread) => (
          <Pressable
            key={thread.id}
            accessibilityRole="button"
            accessibilityLabel={`Abrir chat ${thread.title}`}
            onPress={() => router.push(`/chat/${thread.id}`)}
            className="rounded-3xl border border-rizoma-border bg-white p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                {thread.title}
              </Text>
              <Text className="text-xs text-rizoma-grayText">{thread.time}</Text>
            </View>
            <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
              {thread.preview}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-6 rounded-3xl bg-rizoma-brandSoft p-4">
        <Text className="text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
          Hablar con soporte
        </Text>
        <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          Abre un hilo para resolver dudas de envío, cuidado o disponibilidad.
        </Text>
        <View className="mt-3">
          <RizomaButton label="Abrir soporte" onPress={() => router.push("/chat/1")} />
        </View>
      </View>
    </Screen>
  );
}

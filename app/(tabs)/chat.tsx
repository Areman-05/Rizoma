import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";

const threads = [
  { id: "1", title: "Soporte Rizoma", preview: "¿En que podemos ayudarte hoy?", time: "Ahora" },
  { id: "2", title: "FAQ rapida", preview: "Envios, riegos y pet-friendly", time: "Ayer" },
  { id: "3", title: "Feedback", preview: "Cuentanos tu experiencia", time: "Lun" },
];

export default function ChatScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Chat" showBack={false} />
      <Text className="mb-4 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
        Ayuda, FAQ y conversacion con el equipo Rizoma.
      </Text>

      <View className="gap-3">
        {threads.map((thread) => (
          <Pressable
            key={thread.id}
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
          Abre un hilo para resolver dudas de envio, cuidado o disponibilidad.
        </Text>
      </View>
    </Screen>
  );
}

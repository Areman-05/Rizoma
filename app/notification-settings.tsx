import { useCallback, useEffect, useState } from "react";
import { Linking, Pressable, Switch, Text, View } from "react-native";
import { Bell, ExternalLink } from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import {
  DEFAULT_NOTIFICATION_PREFS,
  loadNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";

type PrefKey = keyof NotificationPrefs;

const TOGGLES: { key: PrefKey; title: string; subtitle: string; section: "device" | "types" }[] = [
  {
    key: "pushEnabled",
    title: "Notificaciones del dispositivo",
    subtitle: "Alertas push en el móvil (fuera de la app).",
    section: "device",
  },
  {
    key: "orders",
    title: "Pedidos y envíos",
    subtitle: "Confirmaciones, preparación y seguimiento.",
    section: "types",
  },
  {
    key: "offers",
    title: "Ofertas y promociones",
    subtitle: "Descuentos, Ofertas top y campañas.",
    section: "types",
  },
  {
    key: "catalog",
    title: "Novedades del catálogo",
    subtitle: "Nuevas plantas y colecciones.",
    section: "types",
  },
  {
    key: "chat",
    title: "Mensajes de soporte",
    subtitle: "Respuestas del chat de ayuda.",
    section: "types",
  },
  {
    key: "careReminders",
    title: "Recordatorios de cuidados",
    subtitle: "Riego y cuidados de Mi Jardín.",
    section: "types",
  },
];

function PrefRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View className="flex-row items-center border-b border-rizoma-border px-4 py-3.5 last:border-b-0">
      <View className="mr-3 flex-1">
        <Text
          className={`text-base ${disabled ? "text-rizoma-grayText" : "text-rizoma-black"}`}
          style={{ fontFamily: "Inter_500Medium" }}
        >
          {title}
        </Text>
        <Text className="mt-0.5 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.gray, true: colors.brandSoft }}
        thumbColor={value ? colors.brand : "#f4f4f5"}
        accessibilityLabel={title}
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadNotificationPrefs().then((p) => {
      setPrefs(p);
      setHydrated(true);
    });
  }, []);

  const update = useCallback(async (key: PrefKey, value: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      void saveNotificationPrefs(next);
      return next;
    });
  }, []);

  const openSystemSettings = () => {
    void Linking.openSettings();
  };

  const deviceToggles = TOGGLES.filter((t) => t.section === "device");
  const typeToggles = TOGGLES.filter((t) => t.section === "types");
  const typesDisabled = !prefs.pushEnabled;

  return (
    <Screen scroll>
      <ScreenHeader title="Notificaciones" />

      <View className="mb-4 flex-row items-start gap-3 rounded-3xl bg-rizoma-brandSoft px-4 py-4">
        <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-full bg-white">
          <Bell size={20} color={colors.brand} />
        </View>
        <View className="flex-1">
          <Text className="text-base text-rizoma-black" style={{ fontFamily: "Inter_600SemiBold" }}>
            Configura tus alertas
          </Text>
          <Text className="mt-1 text-sm leading-5 text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
            Elige qué quieres recibir en el móvil y dentro de Rizoma. La campanita sigue mostrando el historial.
          </Text>
        </View>
      </View>

      <Text className="mb-2 px-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_600SemiBold" }}>
        Dispositivo
      </Text>
      <View className="mb-3 overflow-hidden rounded-3xl border border-rizoma-border bg-white">
        {deviceToggles.map((item) => (
          <PrefRow
            key={item.key}
            title={item.title}
            subtitle={item.subtitle}
            value={hydrated ? prefs[item.key] : false}
            onValueChange={(v) => {
              void update(item.key, v);
              if (v) openSystemSettings();
            }}
          />
        ))}
      </View>

      <Pressable
        onPress={openSystemSettings}
        accessibilityRole="button"
        accessibilityLabel="Abrir ajustes del sistema"
        className="mb-6 flex-row items-center justify-between rounded-2xl border border-rizoma-border bg-white px-4 py-3.5"
      >
        <Text className="flex-1 text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
          Abrir ajustes de notificaciones del móvil
        </Text>
        <ExternalLink size={18} color={colors.brand} />
      </Pressable>

      <Text className="mb-2 px-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_600SemiBold" }}>
        Tipos de aviso
      </Text>
      <View className="mb-4 overflow-hidden rounded-3xl border border-rizoma-border bg-white opacity-100">
        {typeToggles.map((item) => (
          <PrefRow
            key={item.key}
            title={item.title}
            subtitle={item.subtitle}
            value={hydrated ? prefs[item.key] : false}
            disabled={typesDisabled}
            onValueChange={(v) => void update(item.key, v)}
          />
        ))}
      </View>

      {typesDisabled ? (
        <Text className="px-1 text-center text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
          Activa las notificaciones del dispositivo para configurar cada tipo.
        </Text>
      ) : (
        <Text className="px-1 text-center text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
          Preferencias guardadas en este dispositivo (demo Rizoma).
        </Text>
      )}
    </Screen>
  );
}

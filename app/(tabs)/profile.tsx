import { Link, router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Camera,
  ChevronRight,
  Heart,
  HelpCircle,
  ImagePlus,
  LogOut,
  MapPin,
  Package,
  Pencil,
  ScanLine,
  Sprout,
  User,
  X,
} from "lucide-react-native";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CircularIconButton, iconTone } from "@/src/components/ui/CircularIconButton";
import { RizomaButton } from "@/src/components/ui/RizomaButton";
import { useShop } from "@/src/store/ShopContext";
import { useGarden } from "@/src/store/GardenContext";
import {
  DEFAULT_PROFILE_AVATAR_URI,
  loadProfileAvatar,
  loadProfileName,
  saveProfileAvatar,
  saveProfileName,
} from "@/src/store/persistence";
import { colors } from "@/src/theme/tokens";

/** Ubicación mock alineada con el header de Inicio (no hay clave en persistence). */
const PROFILE_LOCATION = "Barcelona, España";

const PRESET_AVATARS: { id: string; uri: string; label: string }[] = [
  {
    id: "monstera",
    label: "Monstera",
    uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Monstera&backgroundColor=e8f8f0",
  },
  {
    id: "ficus",
    label: "Ficus",
    uri: "https://api.dicebear.com/7.x/lorelei/png?seed=Ficus&backgroundColor=c8e6c9",
  },
  {
    id: "suculenta",
    label: "Suculenta",
    uri: "https://api.dicebear.com/7.x/fun-emoji/png?seed=Suculenta&backgroundColor=fff8e1",
  },
  {
    id: "helecho",
    label: "Helecho",
    uri: "https://api.dicebear.com/7.x/bottts/png?seed=Helecho&backgroundColor=01b763",
  },
  {
    id: "orquidea",
    label: "Orquídea",
    uri: "https://api.dicebear.com/7.x/notionists/png?seed=Orquidea&backgroundColor=a5d6a7",
  },
  {
    id: "pothos",
    label: "Pothos",
    uri: "https://api.dicebear.com/7.x/adventurer/png?seed=Pothos&backgroundColor=e8f8f0",
  },
  {
    id: "calathea",
    label: "Calathea",
    uri: "https://api.dicebear.com/7.x/big-ears/png?seed=Calathea&backgroundColor=c8e6c9",
  },
  {
    id: "aloe",
    label: "Aloe",
    uri: "https://api.dicebear.com/7.x/croodles/png?seed=Aloe&backgroundColor=fff3e0",
  },
  {
    id: "hoja",
    label: "Hoja",
    uri: "https://api.dicebear.com/7.x/icons/png?seed=Hoja&icon=leaf&backgroundColor=01b763",
  },
  {
    id: "rizoma",
    label: "Rizoma",
    uri: "https://api.dicebear.com/7.x/shapes/png?seed=Rizoma&backgroundColor=2e7d32",
  },
];

const PRESET_GAP = 12;
const PRESET_COLS = 5;

type ProfileRow = {
  href?: Href;
  label: string;
  icon: typeof User;
  onPress?: () => void;
  danger?: boolean;
};

function SettingsRow({ item, isLast }: { item: ProfileRow; isLast: boolean }) {
  const Icon = item.icon;
  const iconColor = item.danger ? colors.red : colors.brand;
  const labelColor = item.danger ? "text-rizoma-red" : "text-rizoma-black";

  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${isLast ? "" : "border-b border-rizoma-border"}`}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-rizoma-brandSoft">
        <Icon size={18} color={iconColor} />
      </View>
      <Text className={`ml-3 flex-1 text-base ${labelColor}`} style={{ fontFamily: "Inter_500Medium" }}>
        {item.label}
      </Text>
      {!item.danger ? <ChevronRight size={18} color={colors.grayText} /> : null}
    </View>
  );

  if (item.href) {
    return (
      <Link href={item.href} asChild>
        <Pressable accessibilityRole="button" accessibilityLabel={item.label}>
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable onPress={item.onPress} accessibilityRole="button" accessibilityLabel={item.label}>
      {content}
    </Pressable>
  );
}

function SettingsGroup({ rows }: { rows: ProfileRow[] }) {
  return (
    <View className="mb-5 overflow-hidden rounded-3xl border border-rizoma-border bg-white">
      {rows.map((item, index) => (
        <SettingsRow key={item.label} item={item} isLast={index === rows.length - 1} />
      ))}
    </View>
  );
}

function StatChip({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      className="flex-1 items-center rounded-2xl bg-rizoma-brandSoft px-2 py-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Text className="text-lg text-rizoma-brand" style={{ fontFamily: "Inter_700Bold" }}>
        {value}
      </Text>
      <Text className="mt-0.5 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
        {label}
      </Text>
    </Pressable>
  );
}

function AvatarPickerSheet({
  visible,
  currentUri,
  onClose,
  onSelect,
}: {
  visible: boolean;
  currentUri: string;
  onClose: () => void;
  onSelect: (uri: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const sheetPad = 20;
  const cellSize = (screenWidth - sheetPad * 2 - PRESET_GAP * (PRESET_COLS - 1)) / PRESET_COLS;

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Activa el acceso a la galería para elegir una foto de perfil.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]?.uri) return;
    onSelect(result.assets[0].uri);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Cerrar selector de avatar" />
        <View
          className="rounded-t-3xl bg-white px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Elige tu avatar
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              className="h-9 w-9 items-center justify-center rounded-full bg-rizoma-gray"
              hitSlop={8}
            >
              <X size={18} color={colors.black} />
            </Pressable>
          </View>

          <Text
            className="mb-3 text-sm text-rizoma-secondaryText"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Avatares predeterminados
          </Text>

          <View className="mb-5 flex-row flex-wrap" style={{ gap: PRESET_GAP }}>
            {PRESET_AVATARS.map((preset) => {
              const selected = currentUri === preset.uri;
              return (
                <Pressable
                  key={preset.id}
                  onPress={() => onSelect(preset.uri)}
                  accessibilityRole="button"
                  accessibilityLabel={`Avatar predeterminado ${preset.label}`}
                  accessibilityState={{ selected }}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: cellSize / 2,
                    borderWidth: selected ? 3 : 2,
                    borderColor: selected ? colors.brand : colors.border,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: preset.uri }}
                    style={{ width: "100%", height: "100%" }}
                    accessibilityIgnoresInvertColors
                  />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={pickFromGallery}
            accessibilityRole="button"
            accessibilityLabel="Subir de la galería"
            className="mb-2 flex-row items-center justify-center gap-2 rounded-2xl border border-rizoma-brand bg-rizoma-brandSoft px-4 py-3.5"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <ImagePlus size={20} color={colors.brand} />
            <Text className="text-base text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
              Subir de la galería
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { cartCount, wishlist, orders } = useShop();
  const { garden } = useGarden();
  const [name, setName] = useState("Amante de plantas");
  const [avatarUri, setAvatarUri] = useState(DEFAULT_PROFILE_AVATAR_URI);
  const [editing, setEditing] = useState(false);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);

  useEffect(() => {
    loadProfileName().then(setName);
    loadProfileAvatar().then(setAvatarUri);
  }, []);

  const commitName = async () => {
    const next = name.trim() || "Amante de plantas";
    setName(next);
    setEditing(false);
    await saveProfileName(next);
  };

  const commitAvatar = async (uri: string) => {
    setAvatarUri(uri);
    setAvatarSheetOpen(false);
    await saveProfileAvatar(uri);
  };

  const accountRows: ProfileRow[] = [
    {
      label: "Editar nombre",
      icon: Pencil,
      onPress: () => setEditing(true),
    },
    { href: "/notifications", label: "Notificaciones", icon: Bell },
    { href: "/login", label: "Cuenta / Login", icon: User },
  ];

  const collectionRows: ProfileRow[] = [
    { href: "/orders", label: "Mis pedidos", icon: Package },
    { href: "/(tabs)/wishlist", label: "Favoritos", icon: Heart },
    { href: "/garden", label: "Mi Jardín", icon: Sprout },
  ];

  const exploreRows: ProfileRow[] = [
    { href: "/match", label: "Plant Match", icon: ScanLine },
    { href: "/scan", label: "Escanear planta", icon: ScanLine },
    { href: "/onboarding", label: "Guía de bienvenida", icon: HelpCircle },
  ];

  const sessionRows: ProfileRow[] = [
    {
      label: "Cerrar sesión",
      icon: LogOut,
      danger: true,
      onPress: () => {
        Alert.alert("Cerrar sesión", "Esto es una demo: no hay sesión real que cerrar.", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ir a login",
            style: "destructive",
            onPress: () => router.push("/login"),
          },
        ]);
      },
    },
  ];

  return (
    <Screen scroll>
      <ScreenHeader title="Perfil" showBack={false} showNotificationBadge />

      <View className="mb-6 items-center rounded-3xl bg-rizoma-brandSoft px-4 py-6">
        <View className="relative">
          <Image
            source={{ uri: avatarUri }}
            className="h-24 w-24 rounded-full border-2 border-white"
            accessibilityLabel="Avatar de perfil"
          />
          <Pressable
            onPress={() => setAvatarSheetOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Cambiar foto de perfil"
            className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-rizoma-brand"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            hitSlop={6}
          >
            <Camera size={16} color={colors.white} />
          </Pressable>
        </View>

        <View className="mt-4 w-full items-center">
          {editing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={commitName}
              onSubmitEditing={commitName}
              autoFocus
              returnKeyType="done"
              className="w-full rounded-2xl border border-rizoma-border bg-white px-4 py-3 text-center text-rizoma-black"
              style={{ fontFamily: "Inter_700Bold", fontSize: 22 }}
              accessibilityLabel="Nombre de perfil"
            />
          ) : (
            <Pressable
              onPress={() => setEditing(true)}
              accessibilityRole="button"
              accessibilityLabel="Editar nombre"
              className="items-center"
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
                  {name}
                </Text>
                <CircularIconButton accessibilityLabel="Editar nombre" size={32} onPress={() => setEditing(true)}>
                  <Pencil size={14} color={iconTone.dark} />
                </CircularIconButton>
              </View>
            </Pressable>
          )}

          {PROFILE_LOCATION ? (
            <View className="mt-2 flex-row items-center gap-1">
              <MapPin size={14} color={colors.grayText} />
              <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                {PROFILE_LOCATION}
              </Text>
            </View>
          ) : null}
        </View>

        {wishlist.length === 0 && garden.length === 0 && orders.length === 0 ? (
          <View className="mt-5 w-full">
            <Text
              className="mb-3 text-center text-sm text-rizoma-secondaryText"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Empieza a guardar plantas o haz tu primer pedido.
            </Text>
            <RizomaButton label="Explorar catálogo" onPress={() => router.push("/(tabs)")} />
          </View>
        ) : null}
      </View>

      <View className="mb-6 flex-row gap-2">
        <StatChip label="Pedidos" value={orders.length} onPress={() => router.push("/orders")} />
        <StatChip label="Favoritos" value={wishlist.length} onPress={() => router.push("/(tabs)/wishlist")} />
        <StatChip label="Jardín" value={garden.length} onPress={() => router.push("/garden")} />
      </View>

      {cartCount > 0 ? (
        <Pressable
          onPress={() => router.push("/(tabs)/cart")}
          className="mb-5 flex-row items-center justify-between rounded-2xl border border-rizoma-border bg-white px-4 py-3"
          accessibilityRole="button"
          accessibilityLabel="Ir al carrito"
        >
          <Text className="text-sm text-rizoma-black" style={{ fontFamily: "Inter_500Medium" }}>
            Tienes {cartCount} artículo{cartCount === 1 ? "" : "s"} en el carrito
          </Text>
          <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
            Ver
          </Text>
        </Pressable>
      ) : null}

      <SectionHeader title="Cuenta" subtitle="Nombre, alertas y acceso" />
      <SettingsGroup rows={accountRows} />

      <SectionHeader title="Pedidos y colección" subtitle="Atajos a tu actividad" />
      <SettingsGroup rows={collectionRows} />

      <SectionHeader title="Descubrir" />
      <SettingsGroup rows={exploreRows} />

      <SectionHeader title="Sesión" />
      <SettingsGroup rows={sessionRows} />

      <Text className="mt-1 px-1 text-center text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
        Privacidad y términos · Rizoma demo
      </Text>

      <AvatarPickerSheet
        visible={avatarSheetOpen}
        currentUri={avatarUri}
        onClose={() => setAvatarSheetOpen(false)}
        onSelect={commitAvatar}
      />
    </Screen>
  );
}

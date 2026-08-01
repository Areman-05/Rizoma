import { Link, router, type Href } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
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
import { ProfileAvatar } from "@/src/components/profile/ProfileAvatar";
import {
  AVATAR_PRESETS,
  isAvatarPresetId,
  normalizeAvatarValue,
} from "@/src/components/profile/avatarPresets";
import { Screen } from "@/src/components/ui/Screen";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
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

const SCREEN_FADE_MS = 380;
const SHEET_SLIDE_MS = 320;
const SHEET_BACKDROP_MS = 240;

/** Ubicación mock alineada con el header de Inicio (no hay clave en persistence). */
const PROFILE_LOCATION = "Barcelona, España";

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

function EditProfileSheet({
  visible,
  initialName,
  initialAvatar,
  onClose,
  onSave,
}: {
  visible: boolean;
  initialName: string;
  initialAvatar: string;
  onClose: () => void;
  onSave: (name: string, avatar: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const sheetPad = 20;
  const cellSize = (screenWidth - sheetPad * 2 - PRESET_GAP * (PRESET_COLS - 1)) / PRESET_COLS;

  const [draftName, setDraftName] = useState(initialName);
  const [draftAvatar, setDraftAvatar] = useState(initialAvatar);
  const [modalMounted, setModalMounted] = useState(visible);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (!visible) return;
    setDraftName(initialName);
    setDraftAvatar(initialAvatar);
  }, [visible, initialName, initialAvatar]);

  useEffect(() => {
    if (visible) {
      setModalMounted(true);
      backdropOpacity.setValue(0);
      sheetTranslate.setValue(screenHeight * 0.35);
      const frame = requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: SHEET_BACKDROP_MS,
            useNativeDriver: true,
          }),
          Animated.timing(sheetTranslate, {
            toValue: 0,
            duration: SHEET_SLIDE_MS,
            useNativeDriver: true,
          }),
        ]).start();
      });
      return () => cancelAnimationFrame(frame);
    }

    if (!modalMounted) return;

    const anim = Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: SHEET_BACKDROP_MS,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: screenHeight * 0.25,
        duration: SHEET_SLIDE_MS,
        useNativeDriver: true,
      }),
    ]);
    anim.start(({ finished }) => {
      if (finished) setModalMounted(false);
    });
    return () => anim.stop();
    // modalMounted solo se lee al cerrar; no debe re-disparar la entrada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, backdropOpacity, sheetTranslate, screenHeight]);

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
    setDraftAvatar(result.assets[0].uri);
  };

  const handleSave = () => {
    const nextName = draftName.trim() || "Amante de plantas";
    onSave(nextName, normalizeAvatarValue(draftAvatar));
  };

  return (
    <Modal visible={modalMounted} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.4)", opacity: backdropOpacity },
          ]}
        />
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Cerrar editar perfil" />
        <Animated.View
          className="max-h-[88%] rounded-t-3xl bg-white"
          style={{
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            transform: [{ translateY: sheetTranslate }],
          }}
        >
          <View className="items-center pt-3">
            <View className="mb-1 h-1 w-10 rounded-full bg-rizoma-border" />
          </View>
          <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
            <Text className="text-lg text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              Editar perfil
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

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: sheetPad, paddingBottom: 8 }}
          >
            <View className="mb-5 items-center pt-2">
              <ProfileAvatar value={draftAvatar} size={88} borderWidth={2} borderColor={colors.white} />
            </View>

            <Text
              className="mb-2 text-sm text-rizoma-secondaryText"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Nombre
            </Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Tu nombre"
              placeholderTextColor={colors.grayText}
              returnKeyType="done"
              className="mb-5 rounded-2xl border border-rizoma-border bg-rizoma-gray px-4 py-3.5 text-base text-rizoma-black"
              style={{ fontFamily: "Inter_500Medium" }}
              accessibilityLabel="Nombre de perfil"
            />

            <Text
              className="mb-3 text-sm text-rizoma-secondaryText"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Foto de perfil
            </Text>

            <View className="mb-4 flex-row flex-wrap" style={{ gap: PRESET_GAP }}>
              {AVATAR_PRESETS.map((preset) => {
                const selected = draftAvatar === preset.id;
                const ring = selected ? 3 : 2;
                return (
                  <Pressable
                    key={preset.id}
                    onPress={() => setDraftAvatar(preset.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Avatar ${preset.label}`}
                    accessibilityState={{ selected }}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: cellSize / 2,
                      borderWidth: ring,
                      borderColor: selected ? colors.brand : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <ProfileAvatar value={preset.id} size={cellSize - ring * 2} />
                  </Pressable>
                );
              })}
            </View>

            {!isAvatarPresetId(draftAvatar) ? (
              <View className="mb-4 items-center">
                <Text
                  className="mb-2 text-xs text-rizoma-secondaryText"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Foto de la galería seleccionada
                </Text>
                <ProfileAvatar value={draftAvatar} size={56} borderWidth={2} borderColor={colors.brand} />
              </View>
            ) : null}

            <Pressable
              onPress={pickFromGallery}
              accessibilityRole="button"
              accessibilityLabel="Subir de la galería"
              className="mb-5 flex-row items-center justify-center gap-2 rounded-2xl border border-rizoma-brand bg-rizoma-brandSoft px-4 py-3.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <ImagePlus size={20} color={colors.brand} />
              <Text className="text-base text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                Subir de la galería
              </Text>
            </Pressable>

            <View className="mb-2 gap-2">
              <RizomaButton label="Guardar" onPress={handleSave} />
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Cancelar"
                className="items-center rounded-full px-5 py-3.5"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-base text-rizoma-secondaryText" style={{ fontFamily: "Inter_600SemiBold" }}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { cartCount, wishlist, orders } = useShop();
  const { garden } = useGarden();
  const [name, setName] = useState("Amante de plantas");
  const [avatarUri, setAvatarUri] = useState(DEFAULT_PROFILE_AVATAR_URI);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    loadProfileName().then(setName);
    loadProfileAvatar().then(setAvatarUri);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: SCREEN_FADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslate, {
        toValue: 0,
        duration: SCREEN_FADE_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenOpacity, screenTranslate]);

  const commitProfile = async (nextName: string, nextAvatar: string) => {
    setName(nextName);
    setAvatarUri(nextAvatar);
    setEditSheetOpen(false);
    await Promise.all([saveProfileName(nextName), saveProfileAvatar(nextAvatar)]);
  };

  const accountRows: ProfileRow[] = [
    {
      label: "Editar perfil",
      icon: Pencil,
      onPress: () => setEditSheetOpen(true),
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
      <Animated.View
        style={{
          opacity: screenOpacity,
          transform: [{ translateY: screenTranslate }],
        }}
      >
        <ScreenHeader title="Perfil" showBack={false} showNotificationBadge />

        <View className="mb-6 items-center rounded-3xl bg-rizoma-brandSoft px-5 py-7">
          <ProfileAvatar
            value={avatarUri}
            size={96}
            borderWidth={2}
            borderColor={colors.white}
            accessibilityLabel="Avatar de perfil"
          />

          <View className="mt-4 w-full items-center">
            <Text className="text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
              {name}
            </Text>

            {PROFILE_LOCATION ? (
              <View className="mt-2 flex-row items-center gap-1">
                <MapPin size={14} color={colors.grayText} />
                <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  {PROFILE_LOCATION}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={() => setEditSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
              className="mt-4 flex-row items-center gap-1.5 rounded-full bg-white px-4 py-2"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Pencil size={14} color={colors.brand} />
              <Text className="text-sm text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                Editar perfil
              </Text>
            </Pressable>
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

        <View className="mb-6 flex-row gap-2.5">
          <StatChip label="Pedidos" value={orders.length} onPress={() => router.push("/orders")} />
          <StatChip label="Favoritos" value={wishlist.length} onPress={() => router.push("/(tabs)/wishlist")} />
          <StatChip label="Jardín" value={garden.length} onPress={() => router.push("/garden")} />
        </View>

        {cartCount > 0 ? (
          <Pressable
            onPress={() => router.push("/(tabs)/cart")}
            className="mb-5 flex-row items-center justify-between rounded-2xl border border-rizoma-border bg-white px-4 py-3.5"
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

        <SectionHeader title="Cuenta" subtitle="Perfil, alertas y acceso" />
        <SettingsGroup rows={accountRows} />

        <SectionHeader title="Pedidos y colección" subtitle="Atajos a tu actividad" />
        <SettingsGroup rows={collectionRows} />

        <SectionHeader title="Descubrir" />
        <SettingsGroup rows={exploreRows} />

        <SectionHeader title="Sesión" />
        <SettingsGroup rows={sessionRows} />

        <Text className="mt-2 px-1 text-center text-xs text-rizoma-grayText" style={{ fontFamily: "Inter_400Regular" }}>
          Privacidad y términos · Rizoma demo
        </Text>
      </Animated.View>

      <EditProfileSheet
        visible={editSheetOpen}
        initialName={name}
        initialAvatar={avatarUri}
        onClose={() => setEditSheetOpen(false)}
        onSave={commitProfile}
      />
    </Screen>
  );
}

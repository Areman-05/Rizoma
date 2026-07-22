import { Pressable, TextInput, View } from "react-native";
import { ScanLine, Search } from "lucide-react-native";
import { colors } from "@/src/theme/tokens";

interface LeafySearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onScanPress?: () => void;
  onFocusPress?: () => void;
  placeholder?: string;
}

export function LeafySearchBar({
  value,
  onChangeText,
  onScanPress,
  onFocusPress,
  placeholder = "Buscar plantas...",
}: LeafySearchBarProps) {
  return (
    <View className="flex-row items-center rounded-full border border-rizoma-border bg-white px-4 py-3">
      <Search size={18} color={colors.grayText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocusPress}
        placeholder={placeholder}
        placeholderTextColor={colors.grayText}
        className="ml-2 flex-1 text-base text-rizoma-black"
        style={{ fontFamily: "Inter_400Regular" }}
      />
      <Pressable onPress={onScanPress} accessibilityLabel="Escanear planta" hitSlop={8}>
        <ScanLine size={20} color={colors.black} />
      </Pressable>
    </View>
  );
}

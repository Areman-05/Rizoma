import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View className="mb-4 overflow-hidden rounded-3xl bg-white p-4">
      <View className="h-36 w-full rounded-2xl bg-rizoma-canvas" />
      <View className="mt-3 h-4 w-2/3 rounded-full bg-rizoma-canvas" />
      <View className="mt-2 h-3 w-1/2 rounded-full bg-rizoma-canvas" />
      <View className="mt-4 h-3 w-full rounded-full bg-rizoma-canvas" />
    </View>
  );
}

import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F6F4",
        gap: 16,
      }}
    >
      <Text style={{ color: "#1E3B2B", fontSize: 28, fontWeight: "700" }}>Rizoma</Text>
      <Text style={{ color: "#3B5448", fontSize: 16 }}>E-commerce boutique de plantas.</Text>
      <Link href="/explore" style={{ color: "#1E3B2B", fontWeight: "600" }}>
        Explorar catalogo
      </Link>
    </View>
  );
}

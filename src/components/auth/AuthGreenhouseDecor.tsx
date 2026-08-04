import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { colors } from "@/src/theme/tokens";

/**
 * Atmósfera «Invernadero Leafy»: gradiente + blobs orgánicos.
 * Colócalo como hermano ABSOLUTO detrás del ScrollView (no dentro),
 * para que no infle la altura del contenido ni empuje el formulario.
 */
export function AuthGreenhouseDecor() {
  return (
    <View style={styles.root} pointerEvents="none">
      <LinearGradient
        colors={["#E8F8EF", "#F5FCF8", "#FFFFFF"]}
        locations={[0, 0.45, 1]}
        style={styles.wash}
      />
      {/* Arco/blob superior detrás del logo */}
      <View style={styles.arc} />
      <View style={styles.blobLeft} />
      <View style={styles.blobRight} />
      <View style={styles.softGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 0,
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
  },
  arc: {
    position: "absolute",
    top: -100,
    left: "50%",
    width: 360,
    height: 290,
    marginLeft: -180,
    borderRadius: 180,
    backgroundColor: "rgba(1, 183, 99, 0.1)",
  },
  blobLeft: {
    position: "absolute",
    top: 40,
    left: -70,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(1, 183, 99, 0.07)",
  },
  blobRight: {
    position: "absolute",
    top: 100,
    right: -50,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(10, 92, 58, 0.05)",
  },
  softGlow: {
    position: "absolute",
    top: 200,
    left: "15%",
    right: "15%",
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.brandSoft,
    opacity: 0.45,
  },
});

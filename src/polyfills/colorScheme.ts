import { Appearance } from "react-native";

// Rizoma is light-first; lock scheme before NativeWind web runtime initializes.
Appearance.setColorScheme?.("light");

import { Tabs } from "expo-router";
import { Heart, Home, MessageCircle, ShoppingBag, User } from "lucide-react-native";
import { View } from "react-native";
import { colors } from "@/src/theme/tokens";
import { useShop } from "@/src/store/ShopContext";

export default function TabsLayout() {
  const { cartCount } = useShop();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused, size }) => (
            <View className="items-center">
              <Home color={color} size={size} fill={focused ? color : "transparent"} />
              {focused ? <View className="mt-1 h-1 w-1 rounded-full bg-rizoma-brand" /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.brand },
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, focused, size }) => (
            <Heart color={color} size={size} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

import { Tabs } from "expo-router";
import { Heart, Home, MessageCircle, ShoppingBag, User } from "lucide-react-native";
import { View } from "react-native";
import { colors } from "@/src/theme/tokens";
import { useShop } from "@/src/store/ShopContext";

function TabIcon({
  focused,
  color,
  size,
  Icon,
  filled,
}: {
  focused: boolean;
  color: string;
  size: number;
  Icon: typeof Home;
  filled?: boolean;
}) {
  return (
    <View className="items-center">
      <Icon color={color} size={size} fill={filled && focused ? color : "transparent"} />
      {focused ? <View className="mt-1 h-1 w-1 rounded-full bg-rizoma-brand" /> : <View className="mt-1 h-1 w-1" />}
    </View>
  );
}

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
            <TabIcon focused={focused} color={color} size={size} Icon={Home} filled />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.brand },
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon focused={focused} color={color} size={size} Icon={ShoppingBag} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon focused={focused} color={color} size={size} Icon={Heart} filled />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon focused={focused} color={color} size={size} Icon={MessageCircle} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon focused={focused} color={color} size={size} Icon={User} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

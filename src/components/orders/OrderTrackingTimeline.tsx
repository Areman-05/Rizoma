import { View, Text } from "react-native";
import {
  Bike,
  CheckCircle2,
  Leaf,
  type LucideIcon,
  Package,
  Truck,
} from "lucide-react-native";
import {
  normalizeOrderStatus,
  trackingStepIndex,
  trackingSteps,
  type OrderStatus,
} from "@/src/types/orders";
import { colors } from "@/src/theme/tokens";

const stepIcons: Record<(typeof trackingSteps)[number]["id"], LucideIcon> = {
  prepared: Leaf,
  shipped: Package,
  in_transit: Bike,
  delivered: CheckCircle2,
};

interface OrderTrackingTimelineProps {
  status: OrderStatus;
  express?: boolean;
}

export function OrderTrackingTimeline({ status, express = false }: OrderTrackingTimelineProps) {
  const normalized = normalizeOrderStatus(status);
  const stepIndex = trackingStepIndex(status);
  const cancelled = normalized === "cancelled";

  return (
    <View className="rounded-3xl border border-rizoma-border bg-white p-5">
      <Text className="text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_500Medium" }}>
        Seguimiento
      </Text>
      <Text className="mt-1 text-2xl text-rizoma-black" style={{ fontFamily: "Inter_700Bold" }}>
        {cancelled
          ? "Pedido cancelado"
          : trackingSteps[Math.max(0, stepIndex)]?.title ?? "En proceso"}
      </Text>
      {!cancelled ? (
        <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          {trackingSteps[Math.max(0, stepIndex)]?.description}
          {express && stepIndex === 2 ? " Envío express." : ""}
        </Text>
      ) : (
        <Text className="mt-1 text-sm text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
          Este pedido ya no se enviará.
        </Text>
      )}

      {/* Stepper horizontal compacto */}
      <View className="mt-5 flex-row items-center justify-between px-1">
        {trackingSteps.map((step, index) => {
          const Icon = stepIcons[step.id];
          const done = !cancelled && index <= stepIndex;
          const isLast = index === trackingSteps.length - 1;
          return (
            <View key={step.id} className="flex-1 flex-row items-center">
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  done ? "bg-rizoma-brand" : "bg-rizoma-brandSoft"
                }`}
              >
                <Icon size={18} color={done ? colors.white : colors.brand} />
              </View>
              {!isLast ? (
                <View
                  className={`mx-1.5 h-1 flex-1 rounded-full ${
                    !cancelled && index < stepIndex ? "bg-rizoma-brand" : "bg-rizoma-gray"
                  }`}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Timeline vertical */}
      <View className="mt-6 gap-0">
        {trackingSteps.map((step, index) => {
          const Icon = stepIcons[step.id];
          const done = !cancelled && index <= stepIndex;
          const latest = !cancelled && index === stepIndex;
          const isLast = index === trackingSteps.length - 1;
          return (
            <View key={step.id} className="flex-row gap-3">
              <View className="items-center" style={{ width: 28 }}>
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full ${
                    done ? "bg-rizoma-brand" : "border border-rizoma-border bg-white"
                  }`}
                >
                  <Icon size={14} color={done ? colors.white : colors.grayText} />
                </View>
                {!isLast ? (
                  <View
                    className={`my-1 w-0.5 flex-1 min-h-[20px] ${
                      done && index < stepIndex ? "bg-rizoma-brand" : "bg-rizoma-gray"
                    }`}
                  />
                ) : null}
              </View>
              <View className={`flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                <View className="flex-row items-center gap-2">
                  <Text
                    className={done ? "text-rizoma-black" : "text-rizoma-secondaryText"}
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    {step.title}
                  </Text>
                  {latest ? (
                    <View className="rounded-full bg-rizoma-brandSoft px-2 py-0.5">
                      <Text className="text-[10px] text-rizoma-brand" style={{ fontFamily: "Inter_600SemiBold" }}>
                        Actual
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text className="mt-0.5 text-xs text-rizoma-secondaryText" style={{ fontFamily: "Inter_400Regular" }}>
                  {step.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Truck accent for in_transit */}
      {!cancelled && stepIndex === 2 ? (
        <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-rizoma-brandSoft px-3 py-2.5">
          <Truck size={16} color={colors.brand} />
          <Text className="flex-1 text-xs text-rizoma-brand" style={{ fontFamily: "Inter_500Medium" }}>
            En ruta hacia tu dirección{express ? " · express" : ""}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

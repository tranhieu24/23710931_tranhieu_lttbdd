import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabBar, TabItem } from "../components/TabBar";
import { useCart } from "../store/hooks";

const ROUTE_EMOJI: Record<string, string> = {
  Home: "🏠",
  Categories: "🗂️",
  Cart: "🛒",
  Account: "👤",
};

// Nối Tab Bar tự dựng với React Navigation: nhận { state, descriptors, navigation }
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // BT7.3e: gắn badge = totalQuantity (từ useCart) cho route "Cart"
  const { totalQuantity } = useCart();

  // BT7.1a: dựng mảng items: TabItem[] từ state.routes
  const items: TabItem[] = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key].options.title ?? route.name,
    emoji: ROUTE_EMOJI[route.name] ?? "•",
    badge: route.name === "Cart" ? totalQuantity : undefined,
  }));

  // BT7.1a: onPress(key): emit "tabPress" rồi navigation.navigate(route.name) nếu chưa focus
  const onPress = (key: string) => {
    const route = state.routes.find((r) => r.key === key);
    if (!route) return;
    const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    const isFocused = state.routes[state.index].key === key;
    if (!event.defaultPrevented && !isFocused) {
      navigation.navigate(route.name);
    }
  };

  // BT7.1a: return <TabBar items={items} activeKey={state.routes[state.index].key} onPress={onPress} />
  return <TabBar items={items} activeKey={state.routes[state.index].key} onPress={onPress} />;
}

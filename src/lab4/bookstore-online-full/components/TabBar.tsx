// components/TabBar.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type TabKey = "home" | "category" | "cart" | "account";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "category", label: "Danh mục", icon: "📂" },
  { key: "cart", label: "Giỏ hàng", icon: "🛒" },
  { key: "account", label: "Tài khoản", icon: "👤" },
];

export const TAB_BAR_HEIGHT = 64;

export function TabBar({
  active,
  onChange,
  cartCount,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
  cartCount: number;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onChange(tab.key)}
          >
            {/* Wrapper cho icon + badge */}
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              {/* Badge số lượng giỏ hàng — chỉ hiện ở tab cart */}
              {tab.key === "cart" && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  iconWrap: {
    position: "relative",
  },
  icon: {
    fontSize: 20,
    opacity: 0.4,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  labelActive: {
    color: "#4338CA",
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});

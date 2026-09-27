// components/Header.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function Header({
  onPressCart,
  cartCount,
}: {
  onPressCart?: () => void;
  cartCount?: number;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>📚 BookStore</Text>
      <View style={styles.iconGroup}>
        <Text style={styles.icon}>🔍</Text>
        <Pressable onPress={onPressCart} style={styles.cartBtn}>
          <Text style={styles.icon}>🛒</Text>
          {!!cartCount && cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#1E1B4B",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
  },
  cartBtn: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
});

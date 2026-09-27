// components/CartLineItem.tsx
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { CartItem } from "../data";

export function CartLineItem({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.book.cover }} style={styles.thumb} />

      <Text style={styles.title} numberOfLines={2}>
        {item.book.title}
      </Text>

      <View style={styles.meta}>
        {/* Nút điều chỉnh số lượng */}
        <View style={styles.qtyRow}>
          <Pressable style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{item.quantity}</Text>
          <Pressable style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.price}>
          {(item.book.price * item.quantity).toLocaleString()} đ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  thumb: {
    width: 52,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#EEF2F7",
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 18,
  },
  meta: {
    width: 100,
    alignItems: "flex-end",
    gap: 6,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4338CA",
    lineHeight: 16,
  },
  qty: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    minWidth: 16,
    textAlign: "center",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E1B4B",
  },
});

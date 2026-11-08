import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CartItem } from "../types";
import { colors, formatPrice, radius } from "../theme";

interface Props {
  item: CartItem;
  onChangeQty: (bookId: number, quantity: number) => void;
  onRemove: (bookId: number) => void;
}

export function CartItemRow({ item, onChangeQty, onRemove }: Props) {
  const [qty, setQty] = useState(item.quantity);
  const debouncedQty = useDebounce(qty, 300);
  const pending = useRef(false);

  // Đồng bộ và hủy giá trị cục bộ cũ khi store đổi từ nơi khác.
  useEffect(() => {
    pending.current = false;
    setQty(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (pending.current && debouncedQty === qty) {
      pending.current = false;
      if (debouncedQty !== item.quantity) onChangeQty(item.bookId, debouncedQty);
    }
  }, [debouncedQty, qty, item.bookId, item.quantity, onChangeQty]);

  const changeQty = (delta: number) => {
    pending.current = true;
    setQty((current) => Math.max(1, Math.min(current + delta, item.stock)));
  };
  const canDec = qty > 1;
  const canInc = qty < item.stock;
  return (
    <View style={styles.row}>
      <View style={[styles.cover, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <View style={styles.controls}>
          <Pressable style={[styles.step, !canDec && styles.disabled]} disabled={!canDec} onPress={() => changeQty(-1)} accessibilityRole="button" accessibilityLabel="Giảm">
            <Text style={styles.qty}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable style={[styles.step, !canInc && styles.disabled]} disabled={!canInc} onPress={() => changeQty(1)} accessibilityRole="button" accessibilityLabel="Tăng">
            <Text style={styles.qty}>+</Text>
          </Pressable>
          <Text style={styles.stock}>Còn {item.stock}</Text>
        </View>
      </View>

      <Pressable onPress={() => onRemove(item.bookId)} hitSlop={8} accessibilityLabel="Xóa khỏi giỏ">
        <Text style={styles.trash}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: 10, marginHorizontal: 12, marginVertical: 5, gap: 10 },
  cover: { width: 54, height: 72, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 2 },
  title: { fontWeight: "700", color: colors.text },
  price: { color: colors.indigo, fontWeight: "800" },
  controls: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" },
  step: { width: 32, height: 32, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.35 },
  stock: { color: colors.muted, fontSize: 12 },
  qty: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  trash: { fontSize: 22 },
});

// screens/CartScreen.tsx
import React from "react";
import { View, ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { CartLineItem } from "../components/CartLineItem";
import { CartItem } from "../data";
import { TAB_BAR_HEIGHT } from "../components/TabBar";

export function CartScreen({
  items,
  onIncrease,
  onDecrease,
}: {
  items: CartItem[];
  onIncrease: (bookId: number) => void;
  onDecrease: (bookId: number) => void;
}) {
  const total = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // 3 vùng: header (cố định) + danh sách (cuộn) + totalBar (cố định trên TabBar)
    <View style={styles.screen}>
      {/* Vùng 1: Header cố định */}
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>🛒 Giỏ hàng</Text>
        <Text style={styles.headerSub}>
          {totalQty > 0 ? `${totalQty} sản phẩm` : "Chưa có sản phẩm"}
        </Text>
      </View>

      {/* Vùng 2: Danh sách sản phẩm — CUỘN được (flex:1) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>Giỏ hàng trống</Text>
            <Text style={styles.emptyHint}>Thêm sách từ trang Trang chủ</Text>
          </View>
        ) : (
          items.map((item) => (
            <CartLineItem
              key={item.book.id}
              item={item}
              onIncrease={() => onIncrease(item.book.id)}
              onDecrease={() => onDecrease(item.book.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Vùng 3: Thanh tổng tiền + nút Thanh toán — KHÔNG cuộn
          marginBottom = TAB_BAR_HEIGHT để không bị TabBar absolute che */}
      <View style={styles.totalBar}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng ({totalQty} sp)</Text>
          <Text style={styles.totalValue}>{total.toLocaleString()} đ</Text>
        </View>
        <Pressable
          style={[styles.checkoutButton, items.length === 0 && styles.checkoutDisabled]}
          disabled={items.length === 0}
        >
          <Text style={styles.checkoutText}>Thanh toán →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  headerSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 52,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  emptyHint: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: TAB_BAR_HEIGHT,
  },
  totalLabel: {
    fontSize: 12,
    color: "#5B6B7F",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1B4B",
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: "#4338CA",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutDisabled: {
    backgroundColor: "#C7D2FE",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

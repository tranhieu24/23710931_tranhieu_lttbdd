// GIỜ 5 — Bài tập 2: Màn hình Giỏ hàng (Cart Screen)
//
// Đủ 3 VÙNG theo yêu cầu, KHÔNG vùng nào chồng lấp vùng nào:
// ┌──────────────────────────────────────┐
// │  Header "Giỏ hàng" (cố định)        │  <- View bình thường, không cuộn
// ├──────────────────────────────────────┤
// │  Danh sách sản phẩm (CUỘN được)     │  <- ScrollView flex:1
// │  ...                                 │
// │  ...                                 │
// ├──────────────────────────────────────┤
// │  Tổng cộng + Nút Thanh toán          │  <- View cố định (không cuộn)
// ├──────────────────────────────────────┤
// │  Tab Bar (absolute, App.tsx vẽ)      │  <- nằm ngoài màn hình này
// └──────────────────────────────────────┘
//
// Kỹ thuật tránh chồng lấp:
// - TabBar: position:'absolute', height=TAB_BAR_HEIGHT (64)
// - totalBar: marginBottom = TAB_BAR_HEIGHT -> đứng ngay TRÊN TabBar
// - ScrollView: flex:1 -> tự thu gọn vừa khung còn lại (sau header, trước totalBar)
import React from "react";
import { View, ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { CartLineItem } from "../components/CartLineItem";
import { CartItem } from "../data";
import { TAB_BAR_HEIGHT } from "../components/TabBar";

export function CartScreen({ items }: { items: CartItem[] }) {
  const total = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    // flex:1 -> màn hình chiếm toàn bộ khung body (trừ SafeAreaView insets)
    <View style={styles.screen}>
      {/* 1. HEADER — cố định trên cùng, không cuộn */}
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>🛒 Giỏ hàng</Text>
        <Text style={styles.headerSub}>{items.length} sản phẩm</Text>
      </View>

      {/* 2. DANH SÁCH SẢN PHẨM — CUỘN được (flex:1 tự lấp đầy khoảng trống giữa)
          showsVerticalScrollIndicator={false}: ẩn thanh cuộn dọc */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          </View>
        ) : (
          items.map((item) => (
            <CartLineItem key={item.book.id} item={item} />
          ))
        )}
      </ScrollView>

      {/* 3. THANH TỔNG TIỀN + NÚT THANH TOÁN — KHÔNG cuộn
          marginBottom = TAB_BAR_HEIGHT -> luôn đứng ngay TRÊN TabBar (absolute),
          không bị TabBar đè lên dù màn hình nhỏ.
          flexDirection:'row', justifyContent:'space-between' -> tổng tiền trái, nút phải */}
      <View style={styles.totalBar}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{total.toLocaleString()} đ</Text>
        </View>
        <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Thanh toán →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // chiếm toàn bộ View body từ App.tsx
    backgroundColor: "#F8FAFC",
  },

  // --- Vùng 1: Header cố định ---
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

  // --- Vùng 2: Danh sách cuộn ---
  scroll: {
    flex: 1, // quan trọng: tự lấp đầy khoảng trống giữa header và totalBar
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16, // khoảng thở cuối danh sách
  },

  // --- Trạng thái giỏ trống ---
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // --- Vùng 3: Thanh tổng tiền cố định ngay trên TabBar ---
  totalBar: {
    flexDirection: "row", // tổng tiền bên TRÁI, nút thanh toán bên PHẢI
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    // marginBottom chừa đúng bằng chiều cao TabBar -> thanh này không bị TabBar
    // (position absolute ở App.tsx) che khuất, đứng ngay trên TabBar
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
    // Đổ bóng nút
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

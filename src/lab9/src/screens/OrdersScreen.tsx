import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getOrdersByUser } from "../services/orderService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { formatDateTime } from "../utils/format";
import { showMessage } from "../utils/dialog";
import { RootScreenProps } from "../navigation/types";
import { CartItem, Order, OrderStatus } from "../types";
import { colors, formatPrice, radius } from "../theme";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" } as const;
const STATUS_FILTERS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
];

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user, isLoggedIn } = useAuth();
  const { addMany } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null); // đơn đang mở rộng (xem chi tiết ngay tại màn này)
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [reorderingId, setReorderingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  const reorder = async (order: Order) => {
    if (reorderingId !== null) return;
    setReorderingId(order.id);
    try {
      const books = await getBooks();
      const available: CartItem[] = [];
      for (const item of order.items) {
        const book = books.find((b) => b.id === item.bookId);
        if (!book || book.stock <= 0) continue;
        available.push({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock, quantity: item.quantity });
      }
      if (available.length === 0) {
        showMessage("Không thể mua lại", "Các sách trong đơn hiện đã hết hàng hoặc không còn được bán.");
        return;
      }
      addMany(available);
      showMessage("Đã thêm vào giỏ", "Giỏ hàng đã cập nhật theo giá và tồn kho mới nhất. Sách hết hàng sẽ được bỏ qua, số lượng tối đa bằng tồn kho.", () =>
        navigation.popTo("Tabs", { screen: "Cart" }));
    } catch (e) {
      showMessage("Không thể mua lại", getErrorMessage(e));
    } finally {
      setReorderingId(null);
    }
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  const visibleOrders = orders.filter((o) => status === "all" || o.status === status);
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filterContent}>
        {STATUS_FILTERS.map((filter) => (
          <Pressable key={filter.value} accessibilityRole="button" accessibilityState={{ selected: status === filter.value }}
            onPress={() => { setStatus(filter.value); setOpenId(null); }} style={[styles.chip, status === filter.value && styles.chipSelected]}>
            <Text style={[styles.chipText, status === filter.value && styles.chipTextSelected]}>{filter.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={visibleOrders}
        extraData={{ openId, reorderingId }}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={orders.length === 0 ? (
          <EmptyState emoji="🧾" title="Bạn chưa có đơn hàng nào" message="Đặt đơn đầu tiên để theo dõi tại đây."
            actionLabel="Mua sắm ngay" onAction={() => navigation.popTo("Tabs", { screen: "Home" })} />
        ) : (
          <EmptyState emoji="🧾" title="Không có đơn hàng ở trạng thái này" actionLabel="Xem tất cả" onAction={() => setStatus("all")} />
        )}
        renderItem={({ item: o }) => {
          const open = openId === o.id;
          return (
            <View style={styles.card}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Chi tiết đơn #${o.id}`} accessibilityState={{ expanded: open }} onPress={() => setOpenId(open ? null : o.id)} style={styles.head}>
                <View style={styles.headInfo}>
                  <Text style={styles.code}>Đơn #{o.id}</Text>
                  <Text style={styles.date}>{formatDateTime(o.createdAt)}</Text>
                  <Text style={styles.total}>{formatPrice(o.total)}</Text>
                </View>
                <View style={styles.headStatus}>
                  <StatusBadge status={o.status} />
                  <Text style={styles.toggle}>{open ? "Thu gọn ▲" : "Chi tiết ▼"}</Text>
                </View>
              </Pressable>
              {open && (
                <View style={styles.detail}>
                  {o.items.map((it) => (
                    <View key={it.bookId} style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{it.title} × {it.quantity}</Text>
                      <Text style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
                    </View>
                  ))}
                  <View style={styles.addr}>
                    <Text style={styles.addrH}>Giao đến</Text>
                    <Text style={styles.addrT}>{o.address.name} · {o.address.phone}</Text>
                    <Text style={styles.addrT}>{o.address.address}</Text>
                    <Text style={styles.addrT}>Thanh toán: {PAYMENT_LABEL[o.paymentMethod]}</Text>
                  </View>
                  {o.status === "completed" && <PrimaryButton title="Mua lại" variant="outline" loading={reorderingId === o.id} disabled={reorderingId !== null} onPress={() => reorder(o)} />}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filters: { flexGrow: 0, flexShrink: 0 },
  filterContent: { padding: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  chipSelected: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipText: { color: colors.muted, fontWeight: "700", fontSize: 12 },
  chipTextSelected: { color: "#fff" },
  list: { padding: 12, paddingTop: 0, gap: 10, flexGrow: 1 },
  card: { backgroundColor: "#fff", borderRadius: radius.md, overflow: "hidden" },
  head: { flexDirection: "row", padding: 14, gap: 10, alignItems: "center" },
  headInfo: { flex: 1, gap: 4 },
  headStatus: { alignItems: "flex-end", gap: 8 },
  code: { color: colors.navy, fontSize: 16, fontWeight: "800" },
  date: { color: colors.muted, fontSize: 12 },
  total: { color: colors.indigo, fontWeight: "800", fontSize: 16 },
  toggle: { color: colors.indigo, fontWeight: "700", fontSize: 12 },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, padding: 14, gap: 10 },
  itemRow: { flexDirection: "row", gap: 8, justifyContent: "space-between" },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { color: colors.text, fontWeight: "700" },
  addr: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10, gap: 4 },
  addrH: { color: colors.navy, fontWeight: "800" },
  addrT: { color: colors.muted, fontSize: 13 },
});

import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useCart, useWishlist } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book } from "../types";
import { colors, formatPrice, radius } from "../theme";

// gọi getBookById thay cho mảng tĩnh; có loading + lỗi + thử lại
export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(bookId);

  // BT7.5d: tạo state book / loading / error và hàm load() gọi getBookById(bookId)
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookById(bookId);
      setBook(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [bookId]);

  // BT7.5e: Loading và Error states
  if (loading) return <LoadingView />;
  if (error || !book) return <ErrorView message={error ?? "Không tìm thấy sách"} onRetry={load} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.cover, { backgroundColor: book.color }]}>
        <Text style={styles.emoji}>{book.emoji}</Text>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{book.title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={wished ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          accessibilityState={{ selected: wished }}
          onPress={() => toggle(bookId)}
          style={[styles.heartButton, wished && styles.heartButtonActive]}
        >
          <Text style={[styles.heart, wished && styles.heartActive]}>
            {wished ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{formatPrice(book.price)}</Text>
      <Text style={styles.stock}>Còn {book.stock} cuốn</Text>
      <Text style={styles.desc}>{book.description}</Text>
      {/* BT7.3c: nút "Thêm vào giỏ" gọi add() với dữ liệu sách */}
      <Pressable
        style={styles.btn}
        onPress={() => add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock })}
      >
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 8 },
  cover: { height: 220, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 90 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: "800", color: colors.text },
  heartButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  heartButtonActive: { borderColor: colors.heart, backgroundColor: "#FEF2F2" },
  heart: { fontSize: 30, color: colors.muted },
  heartActive: { color: colors.heart },
  author: { color: colors.muted, fontSize: 15 },
  price: { fontSize: 20, fontWeight: "800", color: colors.indigo },
  stock: { color: colors.muted },
  desc: { color: colors.text, lineHeight: 22, marginTop: 4 },
  btn: { backgroundColor: colors.indigo, padding: 14, borderRadius: radius.md, alignItems: "center", marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

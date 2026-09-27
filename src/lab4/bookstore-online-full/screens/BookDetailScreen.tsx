// screens/BookDetailScreen.tsx
import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { Book } from "../data";

export function BookDetailScreen({
  book,
  onBack,
  onAddToCart,
}: {
  book: Book;
  onBack: () => void;
  onAddToCart: () => void;
}) {
  return (
    // Cấu trúc 3 vùng: backButton (cố định trên) + ScrollView (cuộn) + bottomBar (cố định dưới)
    <View style={styles.screen}>
      {/* Thanh trên: Nút quay lại — cố định, không cuộn */}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Quay lại</Text>
      </Pressable>

      {/* Vùng nội dung cuộn: ảnh bìa lớn + thông tin sách + mô tả dài */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        {book.discountPercent ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceOriginal}>
              {Math.round(book.price / (1 - book.discountPercent / 100)).toLocaleString()} đ
            </Text>
            <Text style={styles.priceSale}>{book.price.toLocaleString()} đ</Text>
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>-{book.discountPercent}%</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.price}>{book.price.toLocaleString()} đ</Text>
        )}

        <Text style={styles.descLabel}>Mô tả sách</Text>
        <Text style={styles.description}>{book.description}</Text>
      </ScrollView>

      {/* Thanh dưới cùng: giá + nút Thêm vào giỏ — cố định, không cuộn */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Giá bán</Text>
          <Text style={styles.bottomPrice}>{book.price.toLocaleString()} đ</Text>
        </View>
        <Pressable style={styles.addButton} onPress={onAddToCart}>
          <Text style={styles.addButtonText}>🛒  Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#4338CA",
    fontWeight: "600",
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cover: {
    alignSelf: "center",
    width: "70%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: "#EEF2F7",
    marginBottom: 4,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  author: {
    marginTop: 6,
    fontSize: 14,
    color: "#5B6B7F",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  priceOriginal: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  priceSale: {
    fontSize: 20,
    fontWeight: "800",
    color: "#DC2626",
  },
  discountTag: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountTagText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
  },
  price: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1B4B",
  },
  descLabel: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  bottomLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1B4B",
  },
  addButton: {
    backgroundColor: "#4338CA",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

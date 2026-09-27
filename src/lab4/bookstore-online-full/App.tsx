// App.tsx — Project tổng hợp: bookstore-online-full
// Gộp toàn bộ tính năng từ bookstore-online-gio4 + bookstore-online-gio5:
//   - HomeScreen: Header + CategoryChips + BookGrid + FloatingCartButton (gio4)
//   - BookDetailScreen: ảnh bìa + mô tả cuộn + thanh Thêm vào giỏ cố định (gio4)
//   - TabBar: 4 tab cố định đáy màn hình với badge giỏ hàng real-time (gio5)
//   - CartScreen: danh sách cuộn + tổng tiền cố định + nút tăng/giảm số lượng (gio5)
//   - CategoryScreen: chip lọc danh mục + lưới sách (mở rộng từ gio2)
//   - AccountScreen: thông tin tài khoản (mở rộng)
//
// Luồng điều hướng (bằng useState, không dùng thư viện navigation):
//   HomeScreen / CategoryScreen  ──tap sách──>  BookDetailScreen
//   BookDetailScreen ──Thêm vào giỏ──>  cập nhật cart state, quay lại
//   TabBar ──tap Giỏ hàng / FloatingCartButton──>  CartScreen
//   CartScreen: tăng/giảm số lượng, xoá (giảm về 0) real-time

import React, { useState, useCallback } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { TabBar, TabKey } from "./components/TabBar";
import { HomeScreen } from "./screens/HomeScreen";
import { BookDetailScreen } from "./screens/BookDetailScreen";
import { CartScreen } from "./screens/CartScreen";
import { CategoryScreen } from "./screens/CategoryScreen";
import { AccountScreen } from "./screens/AccountScreen";

import { BOOKS, CartItem } from "./data";

export default function App() {
  // --- State điều hướng ---
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // --- State giỏ hàng (chia sẻ toàn bộ app) ---
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) ?? null;

  // Thêm sách vào giỏ (tăng số lượng nếu đã có)
  const handleAddToCart = useCallback((bookId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === bookId);
      if (existing) {
        return prev.map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const book = BOOKS.find((b) => b.id === bookId);
      if (!book) return prev;
      return [...prev, { book, quantity: 1 }];
    });
  }, []);

  // Tăng số lượng
  const handleIncrease = useCallback((bookId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.book.id === bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Giảm số lượng (về 0 thì xoá khỏi giỏ)
  const handleDecrease = useCallback((bookId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Điều hướng sang CartScreen qua TabBar
  const handlePressCart = useCallback(() => {
    setSelectedBookId(null);
    setActiveTab("cart");
  }, []);

  // Render màn hình hiện tại
  const renderScreen = () => {
    // BookDetailScreen ưu tiên cao nhất (overlay trên tab đang mở)
    if (selectedBook) {
      return (
        <BookDetailScreen
          book={selectedBook}
          onBack={() => setSelectedBookId(null)}
          onAddToCart={() => {
            handleAddToCart(selectedBook.id);
            setSelectedBookId(null); // Quay lại màn trước sau khi thêm
          }}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            cartCount={cartCount}
            onPressBook={setSelectedBookId}
            onPressCart={handlePressCart}
          />
        );
      case "category":
        return <CategoryScreen onPressBook={setSelectedBookId} />;
      case "cart":
        return (
          <CartScreen
            items={cart}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        );
      case "account":
        return <AccountScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Body: flex:1 + position:'relative' -> containing block cho TabBar absolute */}
      <View style={styles.body}>
        {renderScreen()}

        {/* TabBar chỉ hiện khi KHÔNG đang xem chi tiết sách */}
        {!selectedBook && (
          <TabBar
            active={activeTab}
            onChange={setActiveTab}
            cartCount={cartCount}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
  },
});

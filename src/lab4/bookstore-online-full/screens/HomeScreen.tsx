// screens/HomeScreen.tsx
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Header } from "../components/Header";
import { CategoryChips } from "../components/CategoryChips";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { BOOKS } from "../data";
import { TAB_BAR_HEIGHT } from "../components/TabBar";

export function HomeScreen({
  cartCount,
  onPressBook,
  onPressCart,
}: {
  cartCount: number;
  onPressBook: (id: number) => void;
  onPressCart: () => void;
}) {
  return (
    // View ngoài cùng: flex:1 + position:'relative' -> containing block cho FloatingCartButton absolute
    <View style={styles.screen}>
      {/* Header cố định trên cùng, KHÔNG nằm trong ScrollView */}
      <Header onPressCart={onPressCart} cartCount={cartCount} />

      {/* ScrollView chứa nội dung dài (Chips + Grid) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <CategoryChips />

        <Text style={styles.sectionTitle}>Sách nổi bật</Text>
        <BookGrid books={BOOKS} onPressBook={onPressBook} />
      </ScrollView>

      {/* FloatingCartButton: absolute, NGOÀI ScrollView, không cuộn theo nội dung */}
      <FloatingCartButton count={cartCount} onPress={onPressCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    // paddingBottom đủ lớn để Grid không bị FloatingCartButton (80px) + TabBar (64px) che khuất
    paddingBottom: TAB_BAR_HEIGHT + 100,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    marginTop: 4,
  },
});

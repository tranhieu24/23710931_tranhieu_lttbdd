// screens/CategoryScreen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { CATEGORIES, BOOKS } from "../data";
import { BookGrid } from "../components/BookGrid";
import { TAB_BAR_HEIGHT } from "../components/TabBar";

export function CategoryScreen({
  onPressBook,
}: {
  onPressBook: (id: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const filteredBooks = selected
    ? BOOKS.filter((_, i) => CATEGORIES.indexOf(selected) % 2 === i % 2)
    : BOOKS;

  return (
    <View style={styles.screen}>
      {/* Header cố định */}
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>📂 Danh mục</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Chip lọc danh mục */}
        <View style={styles.chips}>
          <Pressable
            style={[styles.chip, !selected && styles.chipActive]}
            onPress={() => setSelected(null)}
          >
            <Text style={[styles.chipText, !selected && styles.chipTextActive]}>
              Tất cả
            </Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.chip, selected === cat && styles.chipActive]}
              onPress={() => setSelected(selected === cat ? null : cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <BookGrid books={filteredBooks} onPressBook={onPressBook} />
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  chipActive: {
    backgroundColor: "#4338CA",
    borderColor: "#4338CA",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
});

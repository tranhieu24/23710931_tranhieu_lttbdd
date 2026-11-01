import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { useDebounce } from "../hooks/useDebounce";
import { filterBooks } from "../utils/filters";
import { PriceRange } from "../utils/filters";
import { TabScreenProps } from "../navigation/types";
import { colors, radius } from "../theme";
import { useCart } from "../store/hooks";
import { Book, Category } from "../types";

type SortOrder = "asc" | "desc" | null;

export function HomeScreen({ navigation, route }: TabScreenProps<"Home">) {
  // BT7.3d: lấy totalQuantity từ useCart() và truyền vào <FloatingCartButton count=... />
  const { totalQuantity } = useCart();

  // BT7.5b: thay dữ liệu giả bằng state thực
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      // gọi SONG SONG cả hai
      const [b, c] = await Promise.all([getBooks(), getCategories()]);
      setBooks(b);
      setCategories(c);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sort, setSort] = useState<SortOrder>(null);

  // BT7.7a: debounce từ khóa tìm kiếm 400ms
  const debouncedKeyword = useDebounce(keyword, 400);

  // BT7.7c: lọc sách kết hợp keyword, category, priceRange
  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
    // C5: Sort a copy to preserve the original book order.
    return sort
      ? [...filtered].sort((a, b) => sort === "asc" ? a.price - b.price : b.price - a.price)
      : filtered;
  }, [books, debouncedKeyword, categoryId, priceRange, sort]);

  // BT7.8b: nhận categoryId từ route.params (Tab Danh mục gửi sang)
  useEffect(() => {
    if (route.params?.categoryId !== undefined) {
      setCategoryId(route.params.categoryId);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId]);

  // BT7.7d & BT7.7e: hàm xóa bộ lọc
  const clearFilters = () => {
    setKeyword("");
    setCategoryId(null);
    setPriceRange(null);
  };

  const hasFilters = debouncedKeyword !== "" || categoryId !== null || priceRange !== null;

  // BT7.5c: hiển thị LoadingView khi loading, ErrorView khi error
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Header title="📚 BookStore" onSearchPress={() => setSearchOpen((v) => !v)} />
      {searchOpen && (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setSearchOpen(false);
            setKeyword("");
          }}
        />
      )}
      <BookGrid
        data={visibleBooks}
        // BT7.2a: điều hướng sang BookDetail
        onPressBook={(b) => navigation.navigate("BookDetail", { bookId: b.id })}
        ListHeaderComponent={
          <View>
            <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
            <PriceFilter value={priceRange} onChange={setPriceRange} />
            <View style={styles.sortRow}>
              {(["asc", "desc"] as const).map((order) => {
                const active = sort === order;
                return (
                  <Pressable
                    key={order}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.sortChip, active && styles.sortChipActive]}
                    onPress={() => setSort((current) => current === order ? null : order)}
                  >
                    <Text style={[styles.sortText, active && styles.sortTextActive]}>
                      {order === "asc" ? "Giá tăng dần" : "Giá giảm dần"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        // BT7.7d: EmptyState khi không có kết quả
        ListEmptyComponent={
          <EmptyState
            emoji="🔎"
            title="Không tìm thấy sách phù hợp"
            message="Thử thay đổi từ khoá hoặc bộ lọc"
            actionLabel={hasFilters ? "Xóa bộ lọc" : undefined}
            onAction={hasFilters ? clearFilters : undefined}
          />
        }
      />
      <FloatingCartButton count={totalQuantity} onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  sortRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  sortChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  sortChipActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  sortText: { color: colors.text, fontWeight: "600" },
  sortTextActive: { color: colors.card },
});

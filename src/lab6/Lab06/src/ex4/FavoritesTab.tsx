import React, { useCallback, useMemo } from "react";
import { FlatList, SafeAreaView, Text, StyleSheet } from "react-native";
import { PHONES } from "../data/phones";
import { ProductRow } from "./ProductRow";
import { TabProps } from "./types";
import { useFavorites } from "./FavoritesContext";
import { colors } from "../theme";

// TODO 8 — lọc PHONES theo favoriteIds, trống -> thông báo, bấm -> mở ProductDetails
export function FavoritesTab({ navigation }: TabProps<"Favorites">) {
  const { favoriteIds } = useFavorites();

  const favored = useMemo(
    () => PHONES.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  const handlePress = useCallback(
    (id: string) => {
      navigation.navigate("ProductDetails", { id });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.root}>
      {favored.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có sản phẩm nào được lưu.</Text>
      ) : (
        <FlatList
          data={favored}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ProductRow phone={item} onPress={handlePress} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  emptyText: { flex: 1, textAlign: "center", textAlignVertical: "center", color: colors.muted },
});

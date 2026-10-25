import React, { useCallback } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { PHONES } from "../data/phones";
import { ProductRow } from "./ProductRow";
import { TabProps } from "./types";

// TODO 3 — FlatList render ProductRow, bấm vào 1 dòng -> điều hướng sang ProductDetails
export function ProductsTab({ navigation }: TabProps<"Products">) {
  const handlePress = useCallback(
    (id: string) => {
      navigation.navigate("ProductDetails", { id });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={PHONES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProductRow phone={item} onPress={handlePress} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
});

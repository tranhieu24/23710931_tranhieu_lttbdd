import React from "react";
import { View, Text, Image, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { PHONES, PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Stars";
import { colors, formatPrice } from "../theme";
import { RootProps } from "./types";
import { useFavorites } from "./FavoritesContext";

// TODO 4-7
export function ProductDetailsScreen({ route }: RootProps<"ProductDetails">) {
  const { id } = route.params;
  const phone = PHONES.find((p) => p.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  // TODO 4 — không tìm thấy sản phẩm -> hiện thông báo
  if (!phone) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.notFound}>Không tìm thấy sản phẩm (id={id})</Text>
      </SafeAreaView>
    );
  }

  const favored = isFavorite(phone.id);

  return (
    <SafeAreaView style={styles.root}>
      {/* TODO 5 — hiển thị ảnh / tên / sao / giá / nhà cung cấp */}
      <Image
        source={PHONE_COLORS[phone.defaultColor].image}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{phone.name}</Text>
      <View style={styles.row}>
        <Stars value={phone.rating} />
        <Text style={styles.review}>(Xem {phone.reviewCount} đánh giá)</Text>
      </View>
      <Text style={styles.price}>{formatPrice(phone.price)}</Text>
      <Text style={styles.supplier}>Cung cấp bởi {phone.supplier}</Text>

      {/* TODO 6/7 — nút bật/tắt yêu thích */}
      <Pressable
        style={[styles.favBtn, favored && styles.favBtnActive]}
        onPress={() => toggleFavorite(phone.id)}
      >
        <Text style={[styles.favBtnText, favored && styles.favBtnTextActive]}>
          {favored ? "♥ Đã lưu" : "♡ Lưu vào yêu thích"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", padding: 16, alignItems: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { color: colors.red, fontSize: 15 },
  image: { width: "70%", height: 180, marginBottom: 16 },
  name: { fontSize: 17, fontWeight: "700", color: colors.text, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  review: { color: colors.muted, fontSize: 13 },
  price: { fontSize: 22, fontWeight: "700", color: colors.red, marginTop: 10 },
  supplier: { fontSize: 13, color: colors.muted, marginTop: 4, marginBottom: 20 },
  favBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  favBtnActive: { backgroundColor: colors.red, borderColor: colors.red },
  favBtnText: { color: colors.text, fontWeight: "700" },
  favBtnTextActive: { color: "#fff" },
});

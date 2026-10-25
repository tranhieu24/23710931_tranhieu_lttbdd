import React from "react";
import { View, Text, Image, SafeAreaView, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SelectPhoneParamList } from "./SelectPhoneApp";
import { PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Stars";
import { Phone } from "../types";
import { colors, formatPrice } from "../theme";

type Props = NativeStackScreenProps<SelectPhoneParamList, "Product"> & {
  phone: Phone;
};

export function ProductScreen({ navigation, route, phone }: Props) {
  // picked: màu người dùng vừa chọn ở màn ChooseColor (nếu có truyền về qua params)
  const picked = route.params?.color;
  // shown: màu thực sự đang hiển thị trên màn hình — ưu tiên "picked",
  // nếu chưa chọn gì thì dùng màu mặc định của sản phẩm
  const shown = picked ?? phone.defaultColor;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.imageWrap}>
        <Image source={PHONE_COLORS[shown].image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{phone.name}</Text>

        <View style={styles.row}>
          <Stars value={phone.rating} />
          <Text style={styles.review}>(Xem {phone.reviewCount} đánh giá)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.price}>{formatPrice(phone.price)}</Text>
          <Text style={styles.oldPrice}>{formatPrice(phone.oldPrice)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.badge}>{phone.badge}</Text>
        </View>

        {/* TODO 1 — nút viền xám, bo góc 6, chữ đổi theo "picked" */}
        <Pressable
          style={styles.chooseBtn}
          onPress={() => navigation.navigate("ChooseColor", { color: picked })}
        >
          <Text style={styles.chooseBtnText}>
            4 MÀU-{picked ? "CHỌN LOẠI" : "CHỌN MÀU"}
          </Text>
          <Text style={styles.chooseBtnArrow}>{">"}</Text>
        </Pressable>
      </View>

      {/* TODO 2 — nút CHỌN MUA, đặt NGOÀI khối info, sát đáy màn hình
          (nhờ root dùng flexDirection: column + imageWrap flex:1,
          info không flex -> info + nút CHỌN MUA tự dồn xuống dưới) */}
      <Pressable style={styles.buyBtn}>
        <Text style={styles.buyBtnText}>CHỌN MUA</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  imageWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "80%", height: "80%" },
  info: { paddingBottom: 12 },
  name: { fontSize: 16, color: colors.text, marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  review: { color: colors.muted, fontSize: 13 },
  price: { color: colors.red, fontSize: 22, fontWeight: "700" },
  oldPrice: { color: colors.muted, fontSize: 14, textDecorationLine: "line-through" },
  badge: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // TODO 1
  chooseBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    position: "relative",
  },
  chooseBtnText: { color: colors.text, fontSize: 14 },
  chooseBtnArrow: { position: "absolute", right: 12, top: 12, color: colors.muted },
  // TODO 2
  buyBtn: {
    backgroundColor: colors.red,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buyBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

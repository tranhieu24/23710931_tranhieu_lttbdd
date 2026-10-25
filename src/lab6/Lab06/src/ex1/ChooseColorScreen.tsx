import React, { useState } from "react";
import { View, Text, Image, SafeAreaView, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SelectPhoneParamList } from "./SelectPhoneApp";
import { PHONE_COLORS, COLOR_ORDER } from "../data/phones";
import { Phone, ColorKey } from "../types";
import { colors, formatPrice } from "../theme";

type Props = NativeStackScreenProps<SelectPhoneParamList, "ChooseColor"> & {
  phone: Phone;
};

export function ChooseColorScreen({ navigation, route, phone }: Props) {
  // picked: màu đang được chọn trên CHÍNH màn hình này (state cục bộ),
  // khởi tạo từ màu đã chọn trước đó (nếu có truyền qua params)
  const [picked, setPicked] = useState<ColorKey | undefined>(route.params?.color);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Image
          source={PHONE_COLORS[picked ?? phone.defaultColor].image}
          style={styles.thumb}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{phone.name.split(" ").slice(0, -1).join(" ")}</Text>
          <Text style={styles.name}>{phone.name.split(" ").slice(-1)}</Text>

          {/* TODO 3 — chỉ hiện khi đã chọn màu (picked khác undefined) */}
          {picked && (
            <>
              <Text style={styles.detailLine}>
                Màu: <Text style={styles.bold}>{PHONE_COLORS[picked].label}</Text>
              </Text>
              <Text style={styles.detailLine}>
                Cung cấp bởi <Text style={styles.bold}>{phone.supplier}</Text>
              </Text>
              <Text style={[styles.detailLine, styles.bold]}>{formatPrice(phone.price)}</Text>
            </>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Chọn màu</Text>
      <View style={styles.colorList}>
        {COLOR_ORDER.map((key) => {
          const active = picked === key;
          return (
            <Pressable
              key={key}
              style={[styles.colorRow, active && styles.colorRowActive]}
              onPress={() => setPicked(key)}
            >
              <View style={[styles.swatch, { backgroundColor: PHONE_COLORS[key].hex }]} />
              <Text style={styles.colorLabel}>{PHONE_COLORS[key].label}</Text>
              {active && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* TODO 4 — nút XONG, nền colors.blue, bo góc 4 */}
      <Pressable
        style={styles.doneBtn}
        onPress={() => navigation.navigate("Product", { color: picked }, { merge: true })}
      >
        <Text style={styles.doneBtnText}>XONG</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16 },
  header: { flexDirection: "row", gap: 12, marginBottom: 20 },
  thumb: { width: 72, height: 72 },
  headerText: { flex: 1, justifyContent: "center" },
  name: { fontSize: 15, color: colors.text },
  detailLine: { fontSize: 13, color: colors.muted, marginTop: 4 },
  bold: { fontWeight: "700", color: colors.text },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8 },
  colorList: { flex: 1 },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    marginBottom: 10,
  },
  colorRowActive: { borderColor: colors.red },
  swatch: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
  colorLabel: { flex: 1, fontSize: 14, color: colors.text },
  check: { color: colors.red, fontWeight: "700" },
  doneBtn: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

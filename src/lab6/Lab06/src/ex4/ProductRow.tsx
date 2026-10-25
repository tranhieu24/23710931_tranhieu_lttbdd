import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Phone } from "../types";
import { PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Stars";
import { colors, formatPrice } from "../theme";

export const ProductRow = React.memo(function ProductRow({
  phone,
  onPress,
}: {
  phone: Phone;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onPress(phone.id)}>
      <Image
        source={PHONE_COLORS[phone.defaultColor].image}
        style={styles.thumb}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {phone.name}
        </Text>
        <Stars value={phone.rating} />
        <Text style={styles.price}>{formatPrice(phone.price)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  thumb: { width: 56, height: 56 },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 14, color: colors.text },
  price: { fontSize: 14, fontWeight: "700", color: colors.red },
});

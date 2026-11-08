import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

interface Props {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
}

export function RatingStars({ value, size = 18, onChange }: Props) {
  const filled = Math.round(value);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const style = { fontSize: size, color: n <= filled ? colors.warning : colors.line };
        return onChange ? (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={4} accessibilityRole="button" accessibilityLabel={n + " sao"} accessibilityState={{ selected: n === value }}>
            <Text style={style}>★</Text>
          </Pressable>
        ) : <Text key={n} accessibilityLabel={n + " sao"} style={style}>★</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row", alignItems: "center", gap: 2 } });

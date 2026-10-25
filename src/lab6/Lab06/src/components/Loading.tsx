import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme";

export function Loading() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.red} />
      <Text style={styles.text}>Đang tải...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  text: { color: colors.muted, fontSize: 14 },
});

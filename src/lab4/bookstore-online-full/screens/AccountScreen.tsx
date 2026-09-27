// screens/AccountScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TAB_BAR_HEIGHT } from "../components/TabBar";

export function AccountScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>👤 Tài khoản</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.name}>Trần Hiếu</Text>
        <Text style={styles.email}>23710931@student.hcmute.edu.vn</Text>
      </View>
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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: TAB_BAR_HEIGHT,
  },
  icon: {
    fontSize: 64,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  email: {
    fontSize: 13,
    color: "#6B7280",
  },
});

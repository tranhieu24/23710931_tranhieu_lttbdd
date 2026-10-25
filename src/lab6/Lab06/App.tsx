import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { SelectPhoneApp } from "./src/ex1/SelectPhoneApp";
import { SelectPhoneApi } from "./src/ex1/SelectPhoneApi";
import { BottomTabApp } from "./src/ex3/BottomTabApp";
import { StackTabApp } from "./src/ex4/StackTabApp";
import { DrawerApp } from "./src/ex5/DrawerApp";
import { PHONES } from "./src/data/phones";
import { colors } from "./src/theme";

type ScreenKey = "menu" | "bai1" | "bai2" | "bai3" | "bai4" | "bai5";

const MENU_ITEMS: { key: ScreenKey; label: string }[] = [
  { key: "bai1", label: "Bài 1 — Select Phone (Stack Navigator)" },
  { key: "bai2", label: "Bài 2 — Select Phone (gắn API)" },
  { key: "bai3", label: "Bài 3 — Bottom Tab Navigation" },
  { key: "bai4", label: "Bài 4 — Stack + Tab + Passing Params" },
  { key: "bai5", label: "Bài 5 — Drawer Navigation" },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("menu");

  if (screen === "menu") {
    return (
      <SafeAreaView style={styles.menuRoot}>
        <StatusBar style="dark" />
        <Text style={styles.menuTitle}>Lab 06 — Navigation</Text>
        <Text style={styles.menuSubtitle}>Chọn bài tập để xem demo</Text>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.key}
              style={styles.menuBtn}
              onPress={() => setScreen(item.key)}
            >
              <Text style={styles.menuBtnText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.wrap}>
      <StatusBar style="dark" />
      <View style={styles.screenArea}>
        {screen === "bai1" && <SelectPhoneApp phone={PHONES[0]} />}
        {screen === "bai2" && <SelectPhoneApi />}
        {screen === "bai3" && <BottomTabApp />}
        {screen === "bai4" && <StackTabApp />}
        {screen === "bai5" && <DrawerApp />}
      </View>

      <Pressable style={styles.backBtn} onPress={() => setScreen("menu")}>
        <Text style={styles.backBtnText}>⬅ Về menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menuRoot: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: (RNStatusBar.currentHeight ?? 0) + 24,
  },
  menuTitle: { fontSize: 22, fontWeight: "700", color: colors.text },
  menuSubtitle: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 24 },
  menuList: { gap: 12 },
  menuBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
  menuBtnText: { fontSize: 15, color: colors.text, fontWeight: "600" },
  wrap: { flex: 1 },
  screenArea: { flex: 1 },
  backBtn: {
    position: "absolute",
    top: (RNStatusBar.currentHeight ?? 0) + 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  backBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});

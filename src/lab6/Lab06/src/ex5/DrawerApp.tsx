import React, { useState } from "react";
import { View, Text, Switch, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

// ----- HomeScreen (đã có sẵn) -----
function HomeScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Trang chủ</Text>
      <Text style={styles.text}>Chào mừng bạn đến với ứng dụng Lab06.</Text>
    </SafeAreaView>
  );
}

// ----- ProfileScreen (đã có sẵn) -----
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Cá nhân</Text>
      <Text style={styles.text}>Trần Hiếu — tranhieu030584@gmail.com</Text>
    </SafeAreaView>
  );
}

// ----- SettingsScreen (TODO 1) -----
function SettingsScreen() {
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Cài đặt</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Nhận thông báo</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Giao diện tối</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>

      <Text style={styles.summary}>
        Thông báo: {notify ? "Bật" : "Tắt"} · Giao diện: {dark ? "Tối" : "Sáng"}
      </Text>
    </SafeAreaView>
  );
}

// ----- Drawer Navigator (TODO 2) -----
export function DrawerApp() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerActiveTintColor: colors.red,
          drawerIcon: ({ color, size, focused }) => {
            const name =
              route.name === "Home"
                ? focused
                  ? "home"
                  : "home-outline"
                : route.name === "Profile"
                ? focused
                  ? "person"
                  : "person-outline"
                : focused
                ? "settings"
                : "settings-outline";
            return <Ionicons name={name as any} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "Cá nhân" }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: "Cài đặt" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12 },
  text: { fontSize: 14, color: colors.muted },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  switchLabel: { fontSize: 15, color: colors.text },
  summary: { marginTop: 16, fontSize: 13, color: colors.muted },
});

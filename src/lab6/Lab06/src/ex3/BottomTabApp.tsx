import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { PHONES } from "../data/phones";
import { colors, formatPrice } from "../theme";

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

// map tên route -> cặp icon [đang chọn, không chọn]
const ICONS: Record<keyof TabParamList, { focused: any; unfocused: any }> = {
  Home: { focused: "home", unfocused: "home-outline" },
  Search: { focused: "search", unfocused: "search-outline" },
  Profile: { focused: "person", unfocused: "person-outline" },
};

const Tab = createBottomTabNavigator<TabParamList>();

// ----- HomeTab (đã có sẵn) -----
function HomeTab() {
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Trang chủ</Text>
      <FlatList
        data={PHONES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ----- SearchTab (TODO 1) -----
function SearchTab() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONES;
    return PHONES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Tìm kiếm</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Nhập tên sản phẩm..."
        style={styles.input}
      />
      {results.length === 0 ? (
        <Text style={styles.emptyText}>Không có kết quả cho "{query}"</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ----- ProfileTab (TODO 2) -----
function ProfileTab() {
  const name = "Trần Hiếu";
  const email = "tranhieu030584@gmail.com";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.root, styles.profileRoot]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{firstLetter}</Text>
      </View>
      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileEmail}>{email}</Text>
    </SafeAreaView>
  );
}

// ----- Bottom Tab Navigator (TODO 3) -----
export function BottomTabApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.red,
          tabBarIcon: ({ focused, color, size }) => {
            const pair = ICONS[route.name as keyof TabParamList];
            const iconName = focused ? pair.focused : pair.unfocused;
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeTab} options={{ title: "Trang chủ" }} />
        <Tab.Screen name="Search" component={SearchTab} options={{ title: "Tìm kiếm" }} />
        <Tab.Screen name="Profile" component={ProfileTab} options={{ title: "Cá nhân" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 12,
  },
  cardName: { fontSize: 14, color: colors.text, marginBottom: 4 },
  cardPrice: { fontSize: 14, fontWeight: "700", color: colors.red },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 14,
  },
  emptyText: { color: colors.muted, textAlign: "center", marginTop: 24 },
  profileRoot: { alignItems: "center", justifyContent: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  profileName: { fontSize: 16, fontWeight: "700", color: colors.text },
  profileEmail: { fontSize: 13, color: colors.muted, marginTop: 4 },
});

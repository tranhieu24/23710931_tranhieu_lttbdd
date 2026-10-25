import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, TabParamList } from "./types";
import { FavoritesProvider } from "./FavoritesContext";
import { ProductsTab } from "./ProductsTab";
import { FavoritesTab } from "./FavoritesTab";
import { ProductDetailsScreen } from "./ProductDetailsScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO 1 — Tab.Navigator lồng bên trong Stack, headerShown: false ở cấp Tab
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.red }}
    >
      <Tab.Screen
        name="Products"
        component={ProductsTab}
        options={{
          title: "Sản phẩm",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "phone-portrait" : "phone-portrait-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesTab}
        options={{
          title: "Yêu thích",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// TODO 2 — FavoritesProvider > NavigationContainer > Stack.Navigator(Home, ProductDetails)
export function StackTabApp() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeTabs} options={{ title: "Cửa hàng" }} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{ title: "Chi tiết sản phẩm" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

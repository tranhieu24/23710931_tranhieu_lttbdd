// GIỜ 5 — Bài tập 1: Thanh Tab Bar dưới cùng (giao diện tĩnh)
// Kỹ thuật:
//   - Container: flexDirection:'row' để 4 mục xếp ngang
//   - Mỗi mục: flex:1 để chia đều 4 phần bằng nhau, flexDirection:'column',
//     alignItems:'center', justifyContent:'center' để icon trên + chữ dưới + căn giữa
//   - Mục đang chọn có màu label + icon nổi bật (indigo #4338CA)
//
// SO SÁNH 2 CÁCH ĐẶT TAB BAR:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ CÁCH 1 — position:'absolute' (đang dùng)                           │
// │   Ưu điểm: TabBar nổi trên mọi màn hình, chỉ cần khai báo 1 lần   │
// │             ở App.tsx — các màn không cần biết TabBar tồn tại.      │
// │   Nhược:   Phải tự chừa paddingBottom / marginBottom ở mỗi màn để  │
// │             nội dung cuối không bị TabBar che khuất.                │
// │   Dùng khi: ứng dụng có nhiều màn dùng chung 1 TabBar cố định.     │
// │                                                                     │
// │ CÁCH 2 — đặt ngoài ScrollView (trong luồng flex thông thường)       │
// │   Ưu điểm: Flexbox tự tính toán khoảng cách — ScrollView tự thu    │
// │             gọn, không cần padding thủ công.                         │
// │   Nhược:   TabBar phải nằm trong từng màn → lặp code nếu nhiều màn. │
// │   Dùng khi: chỉ 1-2 màn dùng TabBar, hoặc mỗi màn cần TabBar riêng.│
// └─────────────────────────────────────────────────────────────────────┘
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type TabKey = "home" | "category" | "cart" | "account";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "category", label: "Danh mục", icon: "📂" },
  { key: "cart", label: "Giỏ hàng", icon: "🛒" },
  { key: "account", label: "Tài khoản", icon: "👤" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    // Container tab bar: flexDirection:'row' -> 4 mục xếp ngang
    // position:'absolute' + bottom:0 -> neo cố định đáy màn hình,
    // nổi trên mọi nội dung phía trên mà không đẩy nội dung lên
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            // flex:1 -> 4 mục chia đều bề rộng, không cần tính width %
            // flexDirection:'column' -> icon trên, label dưới (trục chính dọc)
            // alignItems:'center' -> căn giữa theo trục ngang (dọc với column)
            // justifyContent:'center' -> căn giữa theo trục dọc (chính với column)
            style={styles.tabItem}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Chiều cao TabBar — export để các màn có thể dùng chừa khoảng trống bên dưới
export const TAB_BAR_HEIGHT = 64;

const styles = StyleSheet.create({
  bar: {
    // CÁCH 1: absolute -> tab bar luôn cố định đáy, không ảnh hưởng layout nội dung
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: "row", // 4 mục xếp NGANG cạnh nhau
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    // Đổ bóng nhẹ phía trên tab bar để tạo cảm giác nổi lên
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8, // Android
  },
  tabItem: {
    flex: 1, // mỗi mục chiếm đúng 1/4 bề rộng
    flexDirection: "column", // icon TRÊN, chữ DƯỚI
    alignItems: "center", // căn giữa theo chiều ngang
    justifyContent: "center", // căn giữa theo chiều dọc
    gap: 2,
  },
  icon: {
    fontSize: 20,
    opacity: 0.45,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  labelActive: {
    color: "#4338CA", // màu indigo nổi bật cho mục đang chọn
    fontWeight: "700",
  },
});

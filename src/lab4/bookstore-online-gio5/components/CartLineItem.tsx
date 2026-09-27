// GIỜ 5 — Bài tập 2 (1 dòng sản phẩm trong màn Giỏ hàng)
// Kỹ thuật: row với 3 vùng tỉ lệ khác nhau:
//   - Ảnh: width + height cố định (không co giãn theo flex)
//   - Tên sách: flex:1 -> chiếm hết phần rộng còn lại sau ảnh & trước khối meta
//     -> đảm bảo tên dài không tràn, tên ngắn vẫn đẩy meta sang phải
//   - Số lượng + Giá: width cố định -> luôn giữ đúng bề rộng dù danh sách dài
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CartItem } from "../data";

export function CartLineItem({ item }: { item: CartItem }) {
  return (
    // row: ảnh - tên - số lượng/giá nằm cùng 1 hàng ngang
    // alignItems:'center' -> 3 vùng căn giữa theo chiều dọc
    <View style={styles.row}>
      {/* Ảnh: kích thước cố định, không bị flex kéo dãn */}
      <Image source={{ uri: item.book.cover }} style={styles.thumb} />

      {/* Tên sách: flex:1 -> chiếm hết phần rộng còn lại
          numberOfLines={2} -> tối đa 2 dòng, bổ sung so với 1 dòng ban đầu
          để tên dài không bị cắt mất quá nhiều nội dung */}
      <Text style={styles.title} numberOfLines={2}>
        {item.book.title}
      </Text>

      {/* Khối số lượng + giá: width cố định + alignItems:'flex-end'
          -> luôn căn phải, không co giãn dù tên sách ngắn hay dài */}
      <View style={styles.meta}>
        <Text style={styles.qty}>x{item.quantity}</Text>
        <Text style={styles.price}>
          {(item.book.price * item.quantity).toLocaleString()} đ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", // 3 vùng xếp NGANG cạnh nhau
    alignItems: "center", // căn giữa theo chiều dọc
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  thumb: {
    width: 52,
    height: 72, // ảnh bìa sách, tỉ lệ 3:4 tương tự BookGrid
    borderRadius: 8,
    backgroundColor: "#EEF2F7",
    // KHÔNG set flex -> giữ nguyên kích thước cố định
  },
  title: {
    flex: 1, // ăn hết phần còn lại -> khối meta luôn dính sát mép phải
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 18,
  },
  meta: {
    width: 96, // cố định, không dùng flex -> không bị co lại dù list dài
    alignItems: "flex-end", // số lượng và giá căn phải
    gap: 4,
  },
  qty: {
    fontSize: 11,
    color: "#5B6B7F",
    fontWeight: "500",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E1B4B",
  },
});

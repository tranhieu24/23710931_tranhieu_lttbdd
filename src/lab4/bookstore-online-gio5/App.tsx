// GIỜ 5 — Tổng hợp: Bottom Tab Layout & Hoàn thiện ứng dụng
// Minh hoạ: Bài 1 (TabBar) + Bài 2 (CartScreen, đủ 3 vùng: cuộn / tổng tiền
// cố định / tab bar cố định). 3 tab còn lại (Trang chủ, Danh mục, Tài khoản) chỉ
// để TabBar có đủ 4 mục thật như đề bài — nội dung của chúng thuộc Giờ 2 và Giờ 4,
// nên ở đây dùng placeholder để tránh trùng lặp code với project gio2/gio4.
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabKey } from './components/TabBar';
import { CartScreen } from './screens/CartScreen';
import { CART_ITEMS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('cart');

  return (
    <SafeAreaView style={styles.root}>
      {/* flex:1 + position:'relative' (mặc định) -> là containing block cho
          TabBar (position:'absolute') ở bên dưới — TabBar neo theo View này */}
      <View style={styles.body}>
        {activeTab === 'cart' ? (
          <CartScreen items={CART_ITEMS} />
        ) : (
          <Placeholder tab={activeTab} />
        )}

        {/* TabBar đặt NGOÀI CartScreen, cùng cấp (song song) với màn hình.
            Đây là CÁCH 1 (absolute): TabBar không nằm trong bất kỳ màn nào,
            luôn nổi ở đáy body dù đang ở tab nào. */}
        <TabBar active={activeTab} onChange={setActiveTab} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Placeholder({ tab }: { tab: TabKey }) {
  const info: Record<TabKey, { icon: string; note: string }> = {
    home: {
      icon: '🏠',
      note: 'Nội dung tab "Trang chủ" thuộc Giờ 4\nXem project bookstore-online-gio4.',
    },
    category: {
      icon: '📂',
      note: 'Nội dung tab "Danh mục" thuộc Giờ 2\nXem project bookstore-online-gio2.',
    },
    cart: { icon: '', note: '' },
    account: {
      icon: '👤',
      note: 'Tab "Tài khoản" chưa được mô tả trong tài liệu.\nSẽ xây dựng trong các bài sau.',
    },
  };
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderIcon}>{info[tab].icon}</Text>
      <Text style={styles.placeholderText}>{info[tab].note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1, // containing block cho TabBar absolute
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  placeholderIcon: {
    fontSize: 52,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#5B6B7F',
    fontSize: 14,
    lineHeight: 22,
  },
});

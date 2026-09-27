# HƯỚNG DẪN THỰC HIỆN & BÁO CÁO HOÀN THIỆN LAB 4
## Dự án: Bookstore Online (Giờ 4)

---

## 1. Tổng quan yêu cầu bài tập

* **Bài tập 1: Màn hình Trang chủ (HomeScreen) hoàn chỉnh**
  * Ghép Header (Giờ 1), Category Chips (Giờ 2), Book Grid (Giờ 3) và Floating Cart Button (Giờ 4).
  * **Cấu trúc**: `SafeAreaView (flex:1)` > `Header` (cố định, nằm ngoài ScrollView) > `ScrollView` (flex:1, chứa Chips + Grid) > `Floating Cart Button` (absolute, nằm ngoài ScrollView cùng cấp).
  * `ScrollView` có thuộc tính `showsVerticalScrollIndicator={false}` và `contentContainerStyle` có `paddingBottom` đủ lớn để nút giỏ hàng nổi không che khuất phần tử cuối của danh sách sách.

* **Bài tập 2: Màn hình Chi tiết sách (BookDetailScreen)**
  * **Ảnh bìa lớn**: `alignSelf: 'center'`, kích thước theo %, `aspectRatio` giữ đúng tỉ lệ khung hình.
  * **Nội dung cuộn**: Đặt trong `ScrollView (flex:1)` riêng để phần mô tả dài không đẩy tràn thanh "Thêm vào giỏ" phía dưới.
  * **Thanh dưới cùng (Bottom Bar)**: `flexDirection: 'row'`, `justifyContent: 'space-between'`, nằm cố định ngoài `ScrollView`.

---

## 2. Chi tiết các bước đã thực hiện

### Bước 1: Khảo sát và phân tích cấu trúc thư mục
* Kiểm tra các component đã có:
  * `components/Header.tsx`: Header hiển thị Logo và các icon tìm kiếm, giỏ hàng.
  * `components/CategoryChips.tsx`: Danh mục dạng thẻ chips cuộn/tự xuống hàng với `flexWrap: 'wrap'`.
  * `components/BookGrid.tsx`: Lưới hiển thị danh sách sách kết hợp `DiscountBadge`.
  * `components/FloatingCartButton.tsx`: Nút tròn giỏ hàng nổi với số lượng badge lồng nhau.
  * `components/DiscountBadge.tsx`: Huy hiệu giảm giá và nhãn New.

### Bước 2: Cài đặt Dependencies
Thực thi cài đặt toàn bộ gói thư viện cần thiết theo file `package.json`:
```powershell
cd e:\23710931_tranhieu_lttbdd\src\lab4\bookstore-online-gio4
npm install
```
*Gói cài đặt bao gồm: Expo SDK 54, React Native 0.81.5, React 19, TypeScript.*

### Bước 3: Hoàn thiện mã nguồn theo yêu cầu

#### 3.1. Hoàn thiện `screens/HomeScreen.tsx`
```tsx
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Header } from "../components/Header";
import { CategoryChips } from "../components/CategoryChips";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { BOOKS } from "../data";

export function HomeScreen({
  cartCount,
  onPressBook,
  onPressCart,
}: {
  cartCount: number;
  onPressBook: (id: number) => void;
  onPressCart: () => void;
}) {
  return (
    <View style={styles.screen}>
      {/* 1. Header cố định trên đầu */}
      <Header />

      {/* 2. ScrollView cuộn nội dung */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <CategoryChips />

        <Text style={styles.sectionTitle}>Sách nổi bật</Text>
        <BookGrid books={BOOKS} onPressBook={onPressBook} />
      </ScrollView>

      {/* 3. Floating Cart Button cố định góc dưới bên phải */}
      <FloatingCartButton count={cartCount} onPress={onPressCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140, // Tránh nút nổi và thanh tab che mất sách cuối cùng
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    marginTop: 4,
  },
});
```

#### 3.2. Hoàn thiện `screens/BookDetailScreen.tsx`
```tsx
import React from "react";
import { View, ScrollView, Text, Image, Pressable, StyleSheet } from "react-native";
import { Book } from "../data";

export function BookDetailScreen({
  book,
  onBack,
  onAddToCart,
}: {
  book: Book;
  onBack: () => void;
  onAddToCart: () => void;
}) {
  return (
    <View style={styles.screen}>
      {/* Nút quay lại */}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Quay lại</Text>
      </Pressable>

      {/* Vùng nội dung cuộn được */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: book.cover }}
          style={styles.cover}
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.price}>{book.price.toLocaleString()} đ</Text>
        <Text style={styles.description}>{book.description}</Text>
      </ScrollView>

      {/* Thanh cố định dưới cùng */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomPrice}>{book.price.toLocaleString()} đ</Text>
        <Pressable style={styles.addButton} onPress={onAddToCart}>
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    color: "#4338CA",
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cover: {
    alignSelf: "center",
    width: "70%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: "#EEF2F7",
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  author: {
    marginTop: 4,
    fontSize: 14,
    color: "#5B6B7F",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1B4B",
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  bottomPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E1B4B",
  },
  addButton: {
    backgroundColor: "#4338CA",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
```

#### 3.3. Hoàn thiện luồng điều hướng trong `App.tsx`
* `SafeAreaView (flex: 1)` bọc ngoài cùng màn hình.
* Sử dụng `useState` để chuyển đổi qua lại giữa `HomeScreen` và `BookDetailScreen`.
* Quản lý trạng thái tăng số lượng giỏ hàng `cartCount` khi nhấn "Thêm vào giỏ".

### Bước 4: Kiểm tra và xác thực Type Checking
Chạy kiểm tra tính đúng đắn toàn bộ code TypeScript:
```powershell
npx tsc --noEmit
```
*Kết quả:* Không có bất kỳ lỗi cú pháp hay kiểu dữ liệu nào (Exit Code 0).

---

## 3. Các lệnh để chạy Project

Mở Terminal và thực hiện các lệnh sau:

1. **Di chuyển vào thư mục dự án:**
   ```powershell
   cd e:\23710931_tranhieu_lttbdd\src\lab4\bookstore-online-gio4
   ```

2. **Chạy máy chủ Expo:**
   ```powershell
   npm start
   ```

3. **Tùy chọn nền tảng:**
   * **Chạy trên Web:** `npm run web` (hoặc ấn phím `w` trong console Expo).
   * **Chạy trên Android:** `npm run android` (hoặc ấn phím `a` trong console Expo).
   * **Quét QR qua điện thoại:** Mở ứng dụng **Expo Go** quét mã QR hiện trên Terminal.

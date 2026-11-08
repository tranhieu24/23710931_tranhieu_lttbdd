# BookStore Online — Lab 8

Hoàn thành BT8.1–BT8.8: đăng nhập/đăng ký có lỗi dưới từng ô, giữ phiên và đăng xuất, bảo vệ Checkout, đánh giá sách, giỏ hàng có debounce 300 ms, xác nhận xóa, lưu giỏ và yêu thích bằng AsyncStorage. Nút tim dùng chung Redux ở Home, Chi tiết và danh sách Yêu thích.

Đã làm hai thử thách: sách cùng danh mục ở Chi tiết và mã `SALE10`/`GIAM50K` ở Giỏ hàng. Có nút 👁 hiện/ẩn mật khẩu trong Đăng nhập; câu trả lời bổ sung nằm trong [TraLoi.md](TraLoi.md). Ảnh trong `docs/ui/` là ảnh tham khảo của đề, không phải ảnh chụp kết quả kiểm thử.

## Chạy
```bash
npm ci
npm run api         # terminal 1: json-server http://localhost:3000 (dữ liệu trong db.json)
npx expo start      # terminal 2: quét QR bằng Expo Go; nhấn  w  để mở bản web
npm run typecheck   # tsc --noEmit
npm test            # kiểm thử logic component, hook, store và HTTP API
```

- Tài khoản demo: `demo@bookstore.vn` / `123456`
- Điện thoại thật: máy tính và điện thoại cùng Wi-Fi. Ứng dụng tự lấy IP từ Expo hostUri. Có thể đặt địa chỉ API trong PowerShell:

  ```powershell
  $env:EXPO_PUBLIC_API_URL="http://<IP-máy-tính>:3000"
  npx expo start -c
  ```
- Ghi chú: json-server ghi thẳng vào `db.json` (đánh giá, tài khoản mới…). Muốn trả dữ liệu về ban đầu: giải nén lại file zip hoặc sửa tay `db.json`.
- Bản web: `Alert.alert` không chạy trên web nên project dùng `utils/dialog.ts` (`window.confirm`/`alert` trên web, `Alert` trên điện thoại).

> **Đăng nhập là GIẢ LẬP** (so sánh mật khẩu ở phía client) — chỉ để học. Hệ thống thật phải để **server** xác thực, cấp token và app lưu token bằng SecureStore.

Stack: Expo SDK 57 · React Native 0.86 · TypeScript · React Navigation 7 · Redux Toolkit · Axios · json-server.

## Kiểm tra

- `npm run typecheck`: đạt, TypeScript không báo lỗi.
- `npm test`: 14 kiểm thử đạt. Test dùng React Native host giả và AsyncStorage trong RAM; dịch vụ gọi HTTP thật đến json-server với bản sao dữ liệu trong RAM, không thay đổi `db.json` của bài nộp.
- `npx expo export --platform web`: build thành công.
- Chưa kiểm tra trực quan trên trình duyệt hoặc thiết bị thật. Công cụ điều khiển trình duyệt dừng do không xác định được URL trên Windows, nên còn thiếu ảnh chụp màn đăng nhập theo câu 5; cách chụp được ghi trong `TraLoi.md`.

Các kiểm thử gồm form, lỗi API, đăng ký tự đăng nhập, quay lại Checkout đúng tổng tiền, khôi phục phiên/giỏ/yêu thích, xóa phiên, debounce và tồn kho, xác nhận xóa, mã giảm giá, đánh giá và điểm trung bình, đồng bộ tim, trạng thái rỗng/lỗi/thử lại của Yêu thích.

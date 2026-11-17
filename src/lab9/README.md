# BookStore – Buổi 9

Ứng dụng Expo / React Native với TypeScript, React Navigation, Redux Toolkit, Axios và json-server.

## Chạy ứng dụng

```powershell
cd src/lab9
npm install
npm run api          # Terminal 1, cổng 3000
npm run web          # Terminal 2, hoặc npm start để mở Expo Go
```

Tài khoản demo: `demo@bookstore.vn` / `123456`.

Điện thoại và máy tính cần cùng Wi-Fi. Nếu cần chỉ định địa chỉ API:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://<IP-máy-tính>:3000"
npm run start:clear
```

Đăng nhập được mô phỏng bằng json-server để phục vụ bài học. API ghi trực tiếp các thay đổi vào `db.json`.

## Chức năng đã hoàn thiện

- Thanh toán: kiểm tra họ tên, điện thoại, địa chỉ; chọn COD/chuyển khoản minh hoạ; khoá nút khi chưa hợp lệ hoặc đang gửi. Tạo đơn thành công mới xoá giỏ và về Home; lỗi giữ nguyên dữ liệu để thử lại.
- Đơn hàng: lọc theo người dùng, mới nhất ở trên, badge trạng thái, chi tiết mở ngay trong thẻ, trạng thái rỗng và thử lại khi lỗi.
- Bộ lọc đơn hàng: Tất cả / Chờ xác nhận / Đang giao / Hoàn tất / Đã huỷ.
- Mua lại đơn hoàn tất: cập nhật giá và tồn kho mới nhất, cộng số lượng vào giỏ, bỏ qua sách hết hàng/đã xoá, không vượt tồn kho.
- Hồ sơ: hiển thị tên, email, điện thoại; email bị khoá khi sửa; PATCH tên và điện thoại, cập nhật Redux và dữ liệu lưu bền. Mật khẩu không được đưa vào store.
- Thông báo: mới nhất ở trên, phân biệt đã đọc/chưa đọc, cập nhật lạc quan và hoàn tác khi API lỗi, mở Đơn hàng hoặc Chi tiết sách theo dữ liệu.
- Home: kéo làm mới tải lại sách và danh mục, giữ nguyên danh sách khi đang tải hoặc khi làm mới thất bại.
- Nhận diện: icon, splash và adaptive icon dùng assets có sẵn, nền navy `#0B1F5C`.

## Kiểm tra

```powershell
npm run typecheck
npm test
npx expo export --platform web
```

Bộ kiểm thử dùng API json-server trong bộ nhớ, không ghi dữ liệu thử vào `db.json`. Bao gồm đặt hàng thành công/thất bại, cập nhật hồ sơ, đánh dấu thông báo, bộ lọc đơn, mua lại theo tồn kho và lưu bền giỏ hàng.

Trả lời năm câu hỏi bổ sung: [TraLoi.md](TraLoi.md).

Luồng demo: Đăng nhập → tìm sách → chi tiết/đánh giá → thêm giỏ/yêu thích → thanh toán → đơn hàng → sửa hồ sơ → thông báo. Phần chụp ảnh và demo trực tiếp trên điện thoại cần thực hiện khi mở ứng dụng.

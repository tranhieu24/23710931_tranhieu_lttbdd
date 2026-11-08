# Trả lời câu hỏi bổ sung Lab 8

## 1. Cờ ready

Ở lần render đầu, store khởi tạo với giỏ hàng rỗng trong khi effect đọc AsyncStorage chưa hoàn thành. Nếu effect ghi chạy ngay, mảng rỗng có thể ghi đè giỏ hàng cũ trước khi đọc xong. Sau khi đọc dữ liệu và dispatch hydrateCart/hydrateWishlist, ready mới chuyển thành true; từ lần render đó hook mới được phép lưu thay đổi, kể cả khi người dùng chủ động xóa hết giỏ.

## 2. Token giả

API giả trả mật khẩu dạng rõ về ứng dụng nên người truy cập API có thể đọc được; việc so mật khẩu và tạo token ở client cũng dễ bị sửa hoặc giả mạo. Trong hệ thống thật, server kiểm tra mật khẩu đã băm, cấp token có chữ ký và kiểm tra quyền cho từng yêu cầu. Trên điện thoại, lưu token nhạy cảm bằng Expo SecureStore (Keychain/Keystore) thay cho AsyncStorage; bài lab giữ cơ chế giả lập đúng theo đề.

## 3. Hai effect trong CartItemRow

useState(item.quantity) chỉ dùng giá trị của props ở lần mount đầu tiên. Nếu sản phẩm đã nằm trong giỏ, quay sang Chi tiết bấm Thêm vào giỏ rồi trở lại tab Giỏ hàng, store có số lượng mới nhưng component còn giữ số cũ nếu không có effect đồng bộ (khi dòng giỏ vẫn được giữ mounted). Effect theo item.quantity cập nhật số hiển thị và hủy thay đổi cục bộ cũ, tránh đẩy ngược giá trị debounce cũ lên store.

## 4. Một nguồn state

Nếu mỗi HeartButton giữ useState riêng thì thả tim ở Home chỉ đổi nút tại Home; nút ở Chi tiết và danh sách Yêu thích không biết thay đổi đó. Redux lưu một mảng wishlist.ids dùng chung, mọi nút đọc cùng id và dispatch cùng action toggleWishlist. Store đổi thì các component liên quan render lại, vì vậy trạng thái tim, số lượng sách yêu thích và lưới Yêu thích luôn đồng bộ.

## 5. Hiện và ẩn mật khẩu

LoginScreen có state showPassword, truyền secureTextEntry={!showPassword} cho FormField. Biểu tượng 👁 đặt cạnh ô Mật khẩu qua rightAccessory; bấm đổi showPassword và nhãn trợ năng chuyển giữa Hiện mật khẩu/Ẩn mật khẩu mà không làm mất nội dung ô.

Để chụp ảnh kết quả: mở tab Tài khoản → Đăng nhập, nhập mật khẩu demo `123456`, bấm 👁 để thấy ký tự rồi chụp màn hình. Chưa có ảnh đính kèm vì công cụ điều khiển trình duyệt dừng khi không xác định được URL hiện tại trên Windows.

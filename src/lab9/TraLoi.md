# Trả lời câu hỏi bổ sung – Buổi 9

1. **Giá trị dẫn xuất:** `errors` và `valid` được tính từ dữ liệu form và giỏ hàng nên tính trực tiếp mỗi lần render sẽ luôn khớp với dữ liệu hiện tại. Nếu lưu bằng `useState` riêng, dễ quên cập nhật khi một ô nhập hoặc giỏ hàng thay đổi, khiến thông báo lỗi và trạng thái nút không chính xác.

2. **Thứ tự gọi:** Nếu gọi `clear()` trước `await createOrder(...)`, khi mất mạng, giỏ hàng đã bị xoá dù đơn chưa được tạo. Đặt `clear()` ngay sau `await createOrder(...)` bảo đảm chỉ xoá giỏ khi API trả về thành công; nếu lỗi, giỏ vẫn được giữ để thử lại. Hook lưu bền sẽ tự ghi giỏ rỗng vào AsyncStorage sau khi store được xoá.

3. **PUT hay PATCH:** `PUT /users/1` với `{ name, phone }` thay thế bản ghi, khiến các trường không gửi như `email` và `password` bị mất; json-server giữ lại `id`. Bài này dùng `PATCH` để chỉ cập nhật tên và điện thoại, giữ nguyên các thông tin còn lại.

4. **Cập nhật lạc quan:** Nếu không hoàn lại `read: false` khi API lỗi, giao diện hiển thị đã đọc trong khi server vẫn lưu chưa đọc. Khi tải lại, thông báo sẽ trở về chưa đọc, làm dữ liệu hiển thị không nhất quán. Có thể áp dụng cách này cho thao tác yêu thích khi đồng bộ API vì dễ hoàn tác; thanh toán cần chờ server xác nhận thành công trước khi báo thành công và xoá giỏ.

5. **Code bổ sung:** Đã thêm năm nút Tất cả / Chờ xác nhận / Đang giao / Hoàn tất / Đã huỷ trong `src/screens/OrdersScreen.tsx`. State `status` lưu trạng thái đang chọn và `visibleOrders` là danh sách sau khi lọc:

   ```tsx
   const [status, setStatus] = useState<"all" | OrderStatus>("all");
   const visibleOrders = orders.filter(
     (order) => status === "all" || order.status === status
   );

   // Mỗi nút gọi setStatus với giá trị tương ứng:
   // Tất cả       → "all"
   // Chờ xác nhận → "pending"
   // Đang giao    → "shipping"
   // Hoàn tất     → "completed"
   // Đã huỷ       → "cancelled"
   ```

   Trong `FlatList`, đổi `data={orders}` thành `data={visibleOrders}` và giữ nguyên phần hiển thị từng đơn. Để chụp minh chứng, mở màn Đơn hàng của tôi, chọn một trạng thái rồi chụp danh sách kết quả; khung chèn ảnh nằm ở Hình 5 trong file Word báo cáo.

Đã làm thử thách **Mua lại**: tải sách mới từ API, cập nhật giá và tồn kho, cộng số lượng với giỏ hiện tại và giới hạn theo tồn kho. Sách đã xoá hoặc hết hàng được bỏ qua; lỗi tải dữ liệu giữ nguyên giỏ. Chỉ đơn hoàn tất mới hiện nút này.

Ảnh màn hình và demo trên thiết bị thật cần thực hiện khi chạy ứng dụng.

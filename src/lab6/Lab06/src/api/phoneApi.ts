import { Phone } from "../types";
import { PHONES } from "../data/phones";

// Nếu bạn đã tạo resource trên mockapi.io, dán URL endpoint vào file .env
// theo dạng: EXPO_PUBLIC_API_URL=https://xxxx.mockapi.io/api/v1/phones
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

// Có URL thật -> gọi API; chưa có -> dùng dữ liệu mẫu offline để vẫn chạy được
export const USING_API = API_URL.length > 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPhone(id: string): Promise<Phone> {
  if (USING_API) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Không tải được dữ liệu (mã lỗi ${res.status})`);
    }
    const data = (await res.json()) as Phone;
    return data;
  }

  // Giả lập độ trễ mạng để thấy rõ trạng thái "Đang tải..."
  await sleep(600);
  const found = PHONES.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Không tìm thấy sản phẩm có id=${id}`);
  }
  return found;
}

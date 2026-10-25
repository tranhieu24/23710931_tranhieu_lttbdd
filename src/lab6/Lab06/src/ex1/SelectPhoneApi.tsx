import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { fetchPhone } from "../api/phoneApi";
import { Phone } from "../types";
import { Loading } from "../components/Loading";
import { ErrorBox } from "../components/ErrorBox";
import { SelectPhoneApp } from "./SelectPhoneApp";

// Bài 2: giống hệt Bài 1 nhưng "phone" không được truyền sẵn qua props nữa
// mà phải tự gọi API (hoặc dữ liệu mẫu offline) rồi mới render SelectPhoneApp
export function SelectPhoneApi() {
  const [phone, setPhone] = useState<Phone | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  // TODO 1 — load: reset error về undefined, phone về undefined trước khi gọi API,
  // try/catch quanh fetchPhone("1"); lỗi -> setError(message); thành công -> setPhone(data)
  const load = useCallback(async () => {
    setError(undefined);
    setPhone(undefined);
    try {
      const data = await fetchPhone("1");
      setPhone(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  }, []);

  // TODO 2 — gọi load() một lần khi component mount
  useEffect(() => {
    load();
  }, [load]);

  // TODO 3 — có lỗi -> hiện ErrorBox, bấm "Thử lại" gọi lại load
  if (error) {
    return <ErrorBox message={error} onRetry={load} />;
  }

  // TODO 4 — chưa có phone (đang chờ API) -> hiện Loading
  if (!phone) {
    return <Loading />;
  }

  // TODO 5/6 — có dữ liệu rồi -> render lại đúng app Bài 1, chỉ khác là "phone"
  // giờ đến từ API thay vì được truyền cứng từ bên ngoài
  return (
    <View style={{ flex: 1 }}>
      <SelectPhoneApp phone={phone} />
    </View>
  );
}

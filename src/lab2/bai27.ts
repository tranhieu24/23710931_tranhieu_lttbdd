// 27. Write a function fetchWithRetry(url, retries) that retries up to `retries` times if the API call fails.
async function fetchWithRetry(url: string, retries: number): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Lần thử ${attempt}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(`Lần thử ${attempt} thất bại`);
      if (attempt === retries) {
        throw new Error("Đã hết số lần thử lại, vẫn thất bại");
      }
    }
  }
}

fetchWithRetry("https://jsonplaceholder.typicode.com/todos/1", 3)
  .then((data) => console.log("Thành công:", data))
  .catch((err) => console.log("Lỗi cuối cùng:", err.message));
export {};

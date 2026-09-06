// 24. Write an async function postData() that sends a POST request to a test API.
async function postData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Bài viết mới",
      body: "Nội dung bài viết",
      userId: 1,
    }),
  });
  const data = await response.json();
  console.log("Dữ liệu trả về sau khi POST:", data);
}

postData();
export {};

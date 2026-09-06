// 21. Use fetch to get data from a public API.
async function getTodo() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await response.json();
  console.log("Dữ liệu từ API:", data);
}

getTodo();
export {};

// 30. Use async/await + Promise.allSettled() to handle multiple API calls and display their success/failure status.
async function getTodoById(id: number) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!response.ok) {
    throw new Error(`Không tìm thấy todo id ${id}`);
  }
  return response.json();
}

async function main() {
  const ids = [1, 2, -1]; // id -1 sẽ gây lỗi để minh họa trường hợp thất bại
  const results = await Promise.allSettled(ids.map((id) => getTodoById(id)));

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Todo ${ids[index]}: Thành công`, result.value);
    } else {
      console.log(`Todo ${ids[index]}: Thất bại -`, result.reason.message);
    }
  });
}

main();
export {};

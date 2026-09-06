// 22. Call the API multiple times and log the results.
async function getTodoById(id: number) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  const data = await response.json();
  return data;
}

async function main() {
  for (let id = 1; id <= 3; id++) {
    const todo = await getTodoById(id);
    console.log(`Todo ${id}:`, todo);
  }
}

main();
export {};

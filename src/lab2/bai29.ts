// 29. Write an async function queueProcess() that processes tasks sequentially in a queue.
function processTask(id: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Task ${id} đã xử lý xong`), 800);
  });
}

async function queueProcess() {
  const taskIds = [1, 2, 3, 4, 5];
  const results: string[] = [];

  for (const id of taskIds) {
    console.log(`Đang xử lý task ${id}...`);
    const result = await processTask(id);
    results.push(result);
  }

  console.log("Kết quả xử lý theo hàng đợi (tuần tự):", results);
}

queueProcess();
export {};

// 28. Write an async function batchProcess() that processes 5 async tasks at once (use Promise.all).
function processTask(id: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Task ${id} đã xử lý xong`), 1000);
  });
}

async function batchProcess() {
  const taskIds = [1, 2, 3, 4, 5];
  const results = await Promise.all(taskIds.map((id) => processTask(id)));
  console.log("Kết quả xử lý hàng loạt:", results);
}

batchProcess();
export {};

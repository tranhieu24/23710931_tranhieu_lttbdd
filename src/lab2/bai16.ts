// 16. Call multiple async functions in parallel using Promise.all().
function simulateTask(id: number, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Task ${id} done`), time);
  });
}

async function runParallel() {
  console.log("Bắt đầu chạy song song...");
  const results = await Promise.all([
    simulateTask(1, 1000),
    simulateTask(2, 1000),
    simulateTask(3, 1000),
  ]);
  console.log(results);
  console.log("Hoàn thành tất cả (chạy song song, tổng ~1 giây thay vì 3 giây)");
}

runParallel();
export {};

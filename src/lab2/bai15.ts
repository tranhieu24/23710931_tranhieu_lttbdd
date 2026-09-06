// 15. Call multiple async functions sequentially using await.
function simulateTask(id: number, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Task ${id} done`), time);
  });
}

async function runSequential() {
  console.log("Bắt đầu chạy tuần tự...");
  const result1 = await simulateTask(1, 1000);
  console.log(result1);
  const result2 = await simulateTask(2, 1000);
  console.log(result2);
  const result3 = await simulateTask(3, 1000);
  console.log(result3);
  console.log("Hoàn thành tất cả (chạy tuần tự, tổng ~3 giây)");
}

runSequential();
export {};

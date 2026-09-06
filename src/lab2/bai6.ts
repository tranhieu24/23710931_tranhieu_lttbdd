// 6. Use Promise.all() to run 3 simulated Promises in parallel and print the result.
function simulateTask(id: number, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Task ${id} done`);
    }, time);
  });
}

const task1 = simulateTask(1, 1000);
const task2 = simulateTask(2, 1500);
const task3 = simulateTask(3, 500);

Promise.all([task1, task2, task3]).then((results) => {
  console.log("Tất cả task hoàn thành:", results);
});
export {};

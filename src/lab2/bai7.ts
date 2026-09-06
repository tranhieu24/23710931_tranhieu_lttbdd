// 7. Use Promise.race() to return whichever Promise resolves first.
function simulateTask(id: number, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Task ${id} xong sau ${time}ms`);
    }, time);
  });
}

const task1 = simulateTask(1, 2000);
const task2 = simulateTask(2, 800);
const task3 = simulateTask(3, 1500);

Promise.race([task1, task2, task3]).then((result) => {
  console.log("Task về đích đầu tiên:", result);
});
export {};

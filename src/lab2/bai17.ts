// 17. Use for await...of to iterate over an array of Promises.
function simulateTask(id: number, time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Task ${id} done sau ${time}ms`), time);
  });
}

async function runForAwait() {
  const tasks = [simulateTask(1, 1000), simulateTask(2, 500), simulateTask(3, 1500)];

  for await (const result of tasks) {
    console.log(result);
  }
}

runForAwait();
export {};

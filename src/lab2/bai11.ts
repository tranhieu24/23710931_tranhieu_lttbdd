// 11. Convert Exercise 1 into async/await.
function delay(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Hello Async"), 2000);
  });
}

async function main() {
  const result = await delay();
  console.log(result);
}

main();
export {};

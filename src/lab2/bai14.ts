// 14. Write an async function that takes a number, waits 1 second, and returns the number ×3.
function multiplyByThree(num: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(num * 3), 1000);
  });
}

async function main() {
  const result = await multiplyByThree(5);
  console.log("Kết quả:", result); // 15
}

main();
export {};

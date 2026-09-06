// 8. Create a Promise chain: square the number 2, then double it, then add 5.
function square(n: number): Promise<number> {
  return new Promise((resolve) => resolve(n * n));
}
function double(n: number): Promise<number> {
  return new Promise((resolve) => resolve(n * 2));
}
function addFive(n: number): Promise<number> {
  return new Promise((resolve) => resolve(n + 5));
}

square(2)
  .then((result) => double(result))
  .then((result) => addFive(result))
  .then((finalResult) => console.log("Kết quả cuối cùng:", finalResult));
// 2 -> bình phương = 4 -> nhân đôi = 8 -> cộng 5 = 13
export {};

// 4. Use .then() and .catch() to handle a Promise that returns a random number.
function getRandomNumber(): Promise<number> {
  return new Promise((resolve, reject) => {
    const num = Math.random();
    if (num < 0.5) {
      resolve(num);
    } else {
      reject(new Error("Số quá lớn, coi như lỗi"));
    }
  });
}

getRandomNumber()
  .then((num) => console.log("Số ngẫu nhiên:", num))
  .catch((err) => console.log("Lỗi:", err.message));
export {};

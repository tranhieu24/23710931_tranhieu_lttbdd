// 2. Write a function that returns a Promise resolving with the number 10 after 1 second.
function getNumber(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}

getNumber().then((num) => console.log("Kết quả:", num));
export {};

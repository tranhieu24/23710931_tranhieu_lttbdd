// 1. Create a Promise that returns the string "Hello Async" after 2 seconds.
const promise1 = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello Async");
  }, 2000);
});

promise1.then((result) => console.log(result));
export {};

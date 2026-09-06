// 3. Write a function that rejects a Promise with the error "Something went wrong" after 1 second.
function taskThatFails(): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Something went wrong"));
    }, 1000);
  });
}

taskThatFails().catch((err) => console.log("Lỗi:", err.message));
export {};

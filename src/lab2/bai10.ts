// 10. Use .finally() to log "Done" when a Promise finishes (success or failure).
function taskMayFail(shouldFail: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Task thất bại"));
      } else {
        resolve("Task thành công");
      }
    }, 1000);
  });
}

taskMayFail(true)
  .then((result) => console.log(result))
  .catch((err) => console.log("Lỗi:", err.message))
  .finally(() => console.log("Done"));
export {};

// 13. Handle errors using try/catch with async/await.
function taskThatFails(): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Something went wrong")), 1000);
  });
}

async function runTask() {
  try {
    const result = await taskThatFails();
    console.log(result);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Bắt được lỗi:", error.message);
    }
  }
}

runTask();
export {};

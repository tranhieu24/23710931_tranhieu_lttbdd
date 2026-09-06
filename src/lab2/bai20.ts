// 20. Add a timeout: if the API call takes more than 2 seconds, throw an error.
function fetchDataSlow(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Dữ liệu API"), 3000); // giả lập chậm, mất 3 giây
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout: quá 2 giây chưa có phản hồi")), ms);
  });
  return Promise.race([promise, timeout]);
}

async function main() {
  try {
    const result = await withTimeout(fetchDataSlow(), 2000);
    console.log(result);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Lỗi:", error.message);
    }
  }
}

main();
export {};

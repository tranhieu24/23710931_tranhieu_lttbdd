// 25. Create a function downloadFile that simulates downloading a file in 3 seconds and logs when done.
function downloadFile(fileName: string): Promise<void> {
  return new Promise((resolve) => {
    console.log(`Bắt đầu tải file: ${fileName}...`);
    setTimeout(() => {
      console.log(`Đã tải xong file: ${fileName}`);
      resolve();
    }, 3000);
  });
}

downloadFile("baocao.pdf");
export {};

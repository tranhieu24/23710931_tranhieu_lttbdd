class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    console.log(`[LOG] ${new Date().toLocaleTimeString()}: ${message}`);
  }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log("Ứng dụng khởi động");
logger2.log("Người dùng đăng nhập");

console.log(`logger1 và logger2 là cùng 1 instance: ${logger1 === logger2}`); // true

export {};

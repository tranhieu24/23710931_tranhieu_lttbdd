class MathUtil {
  static add(a: number, b: number): number {
    return a + b;
  }
  static subtract(a: number, b: number): number {
    return a - b;
  }
  static multiply(a: number, b: number): number {
    return a * b;
  }
  static divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Không thể chia cho 0");
    }
    return a / b;
  }
}

console.log(`Cộng: ${MathUtil.add(5, 3)}`);
console.log(`Trừ: ${MathUtil.subtract(5, 3)}`);
console.log(`Nhân: ${MathUtil.multiply(5, 3)}`);
console.log(`Chia: ${MathUtil.divide(6, 3)}`);

export {};

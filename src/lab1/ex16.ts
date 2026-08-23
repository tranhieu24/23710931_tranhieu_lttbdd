class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }
}

const numberBox = new Box<number>(100);
const stringBox = new Box<string>("Xin chào");

console.log(`Box số: ${numberBox.getValue()}`);
console.log(`Box chuỗi: ${stringBox.getValue()}`);

numberBox.setValue(200);
console.log(`Box số sau khi đổi: ${numberBox.getValue()}`);

export {};

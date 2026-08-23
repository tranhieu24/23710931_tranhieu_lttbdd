interface Vehicle {
  brand: string;
  start(): void;
  stop(): void;
}

class Car implements Vehicle {
  brand: string;
  constructor(brand: string) {
    this.brand = brand;
  }
  start(): void {
    console.log(`${this.brand}: Khởi động động cơ ô tô`);
  }
  stop(): void {
    console.log(`${this.brand}: Tắt động cơ ô tô`);
  }
}

class Bike implements Vehicle {
  brand: string;
  constructor(brand: string) {
    this.brand = brand;
  }
  start(): void {
    console.log(`${this.brand}: Bắt đầu đạp xe`);
  }
  stop(): void {
    console.log(`${this.brand}: Dừng xe đạp`);
  }
}

const vehicles: Vehicle[] = [new Car("Toyota"), new Bike("Giant")];
vehicles.forEach((v) => {
  v.start();
  v.stop();
});

export {};

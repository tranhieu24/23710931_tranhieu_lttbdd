class Car {
  brand: string;
  model: string;
  year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  showInfo(): void {
    console.log(`Xe: ${this.brand} ${this.model}, Năm sản xuất: ${this.year}`);
  }
}

const car1 = new Car("Toyota", "Vios", 2023);
car1.showInfo();

export {};

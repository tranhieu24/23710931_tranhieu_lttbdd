abstract class Shape {
  abstract area(): number; 

  describe(): void {
    console.log(`Diện tích: ${this.area().toFixed(2)}`);
  }
}

class Square extends Shape {
  side: number;
  constructor(side: number) {
    super();
    this.side = side;
  }
  area(): number {
    return this.side * this.side;
  }
}

class Circle extends Shape {
  radius: number;
  constructor(radius: number) {
    super();
    this.radius = radius;
  }
  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

const square1 = new Square(4);
const circle1 = new Circle(3);
square1.describe();
circle1.describe();


export {};

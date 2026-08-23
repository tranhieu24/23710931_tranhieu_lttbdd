interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Bird implements Flyable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  fly(): void {
    console.log(`${this.name} đang bay`);
  }
}

class Fish implements Swimmable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  swim(): void {
    console.log(`${this.name} đang bơi`);
  }
}

class Duck implements Flyable, Swimmable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  fly(): void {
    console.log(`${this.name} đang bay`);
  }
  swim(): void {
    console.log(`${this.name} đang bơi`);
  }
}

const bird1 = new Bird("Chim sẻ");
const fish1 = new Fish("Cá vàng");
const duck1 = new Duck("Vịt");
bird1.fly();
fish1.swim();
duck1.fly();
duck1.swim();

export {};

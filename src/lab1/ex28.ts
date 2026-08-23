class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  protected makeSound(): void {
    console.log(`${this.name} tạo âm thanh chung chung`);
  }

  performSound(): void {
    this.makeSound();
  }
}

class Dog extends Animal {
  protected makeSound(): void {
    console.log(`${this.name}: Gâu gâu!`);
  }
}

class Cat extends Animal {
  protected makeSound(): void {
    console.log(`${this.name}: Meo meo!`);
  }
}

const dog1 = new Dog("Milu");
const cat1 = new Cat("Mimi");
dog1.performSound();
cat1.performSound();

export {};

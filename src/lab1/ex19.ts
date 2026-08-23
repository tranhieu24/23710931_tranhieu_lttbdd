class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  makeSound(): void {
    console.log(`${this.name} tạo ra âm thanh nào đó`);
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log(`${this.name} sủa: Gâu gâu!`);
  }
}

class Cat extends Animal {
  makeSound(): void {
    console.log(`${this.name} kêu: Meo meo!`);
  }
}

const animals: Animal[] = [new Dog("Milu"), new Cat("Mimi"), new Animal("Vật lạ")];
animals.forEach((a) => a.makeSound());

export {};

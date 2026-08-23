interface Animal {
  name: string;
  sound(): void;
}

class Dog implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sound(): void {
    console.log(`${this.name} sủa: Gâu gâu!`);
  }
}

const dog1: Animal = new Dog("Milu");
dog1.sound();

export {};

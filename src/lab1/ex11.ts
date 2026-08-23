class Animal {
    name: string;
    constructor(name: string){
        this.name = name;
    }
}

class Dog extends Animal{
    bark(): void {
        console.log(`${this.name} :Gâu gâu!`);
        
    }
}

class Cat extends Animal{
    meow(): void {
        console.log(`${this.name} :Meo meo!`);
        
    }
}
const dog1 = new Dog("Milu");
const cat1 = new Cat("Mimi");
dog1.bark();
cat1.meow();  

export {};
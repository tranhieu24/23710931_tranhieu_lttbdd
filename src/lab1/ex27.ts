class Person {
  constructor(public name: string, public age: number) {}
}

class Teacher extends Person {
  subject: string;

  constructor(name: string, age: number, subject: string) {
    super(name, age);
    this.subject = subject;
  }

  introduce(): void {
    console.log(`Tôi tên là ${this.name}, ${this.age} tuổi, dạy môn ${this.subject}`);
  }
}

const teacher1 = new Teacher("Cô Lan", 35, "Toán");
teacher1.introduce();

export {};

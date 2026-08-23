class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  displayInfo(): void {
    console.log(`Tên: ${this.name}, Tuổi: ${this.age}`);
  }
}

class Student extends Person {
  grade: string;

  constructor(name: string, age: number, grade: string) {
    super(name, age);
    this.grade = grade;
  }

  displayAllInfo(): void {
    console.log(`Tên: ${this.name}, Tuổi: ${this.age}, Lớp: ${this.grade}`);
  }
}

const s1 = new Student("Trần Thị Bình", 18, "12A1");
s1.displayAllInfo();

export {};

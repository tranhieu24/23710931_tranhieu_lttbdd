class Employee {
  name: string;
  salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  displayInfo(): void {
    console.log(`Nhân viên: ${this.name}, Lương: ${this.salary}`);
  }
}

class Manager extends Employee {
  teamSize: number;

  constructor(name: string, salary: number, teamSize: number) {
    super(name, salary);
    this.teamSize = teamSize;
  }

  manageTeam(): void {
    console.log(`${this.name} đang quản lý đội nhóm gồm ${this.teamSize} người`);
  }
}

class Developer extends Employee {
  programmingLanguage: string;

  constructor(name: string, salary: number, programmingLanguage: string) {
    super(name, salary);
    this.programmingLanguage = programmingLanguage;
  }

  writeCode(): void {
    console.log(`${this.name} đang viết code bằng ${this.programmingLanguage}`);
  }
}

const manager1 = new Manager("Nguyễn Văn A", 30000000, 5);
const dev1 = new Developer("Trần Thị B", 20000000, "TypeScript");
manager1.displayInfo();
manager1.manageTeam();
dev1.displayInfo();
dev1.writeCode();

export {};

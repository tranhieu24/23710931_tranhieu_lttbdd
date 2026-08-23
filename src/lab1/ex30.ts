class Student {
  constructor(public name: string, public grade: string) {}
}

class Teacher {
  constructor(public name: string, public subject: string) {}
}

class School {
  students: Student[] = [];
  teachers: Teacher[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
  }

  addTeacher(teacher: Teacher): void {
    this.teachers.push(teacher);
  }

  displayInfo(): void {
    console.log("=== Danh sách học sinh ===");
    this.students.forEach((s) => console.log(`- ${s.name} (Lớp ${s.grade})`));

    console.log("=== Danh sách giáo viên ===");
    this.teachers.forEach((t) => console.log(`- ${t.name} (Môn ${t.subject})`));
  }
}

const school1 = new School();
school1.addStudent(new Student("An", "10A1"));
school1.addStudent(new Student("Bình", "11A2"));
school1.addTeacher(new Teacher("Cô Lan", "Toán"));
school1.displayInfo();

export {};

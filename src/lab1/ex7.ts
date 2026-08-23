class User {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
    if (newName.trim().length === 0) {
      console.log("Tên không được để trống");
      return;
    }
    this._name = newName;
  }
}

const user1 = new User("An");
console.log(`Tên ban đầu: ${user1.name}`);
user1.name = "Bình"; 
console.log(`Tên sau khi đổi: ${user1.name}`);
user1.name = ""; 

export {};

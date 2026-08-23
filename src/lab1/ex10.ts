class Account {
  public username: string;        
  private password: string;        
  readonly accountId: string;      

  constructor(username: string, password: string, accountId: string) {
    this.username = username;
    this.password = password;
    this.accountId = accountId;
  }

  checkPassword(input: string): boolean {
    return this.password === input;
  }
}

const acc1 = new Account("an123", "matkhau123", "ACC001");
console.log(`Username: ${acc1.username}`);      
console.log(`Kiểm tra mật khẩu: ${acc1.checkPassword("matkhau123")}`);

export {};

class BankAccount {
  balance: number;

  constructor(initialBalance: number = 0) {
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      console.log("Số tiền nạp phải lớn hơn 0");
      return;
    }
    this.balance += amount;
    console.log(`Đã nạp ${amount}. Số dư hiện tại: ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount > this.balance) {
      console.log("Số dư không đủ để rút");
      return;
    }
    this.balance -= amount;
    console.log(`Đã rút ${amount}. Số dư hiện tại: ${this.balance}`);
  }
}

const account1 = new BankAccount(1000);
account1.deposit(500);
account1.withdraw(300);
account1.withdraw(5000);

export {};

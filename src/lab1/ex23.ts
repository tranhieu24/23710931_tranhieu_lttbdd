interface Payment {
  pay(amount: number): void;
}

class CashPayment implements Payment {
  pay(amount: number): void {
    console.log(`Thanh toán ${amount} bằng tiền mặt`);
  }
}

class CardPayment implements Payment {
  pay(amount: number): void {
    console.log(`Thanh toán ${amount} bằng thẻ ngân hàng`);
  }
}

const payments: Payment[] = [new CashPayment(), new CardPayment()];
payments.forEach((p) => p.pay(500000));

export {};

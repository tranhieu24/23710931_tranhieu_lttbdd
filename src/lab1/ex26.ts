class Product {
  constructor(public name: string, public price: number) {}
}

class Order {
  products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  calculateTotal(): number {
    return this.products.reduce((sum, p) => sum + p.price, 0);
  }
}

const order1 = new Order();
order1.addProduct(new Product("Áo thun", 150000));
order1.addProduct(new Product("Quần jean", 350000));
order1.addProduct(new Product("Mũ", 80000));

console.log(`Tổng tiền đơn hàng: ${order1.calculateTotal()}đ`);

export {};

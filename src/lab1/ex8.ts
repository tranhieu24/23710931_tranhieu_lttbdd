class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

const products: Product[] = [
  new Product("Bút bi", 5),
  new Product("Bàn phím", 250),
  new Product("Chuột", 150),
  new Product("Tẩy", 3),
  new Product("Laptop", 15000000),
];

const expensiveProducts = products.filter((p) => p.price > 100);
console.log("Sản phẩm giá > 100:");
expensiveProducts.forEach((p) => console.log(`- ${p.name}: ${p.price}`));

export {};

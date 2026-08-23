class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}

interface Product {
  name: string;
  price: number;
}

const productRepo = new Repository<Product>();
productRepo.add({ name: "Bàn phím", price: 250 });
productRepo.add({ name: "Chuột", price: 150 });

console.log("Danh sách sản phẩm trong repository:");
console.log(productRepo.getAll());

export {};

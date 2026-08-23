class Book {
  title: string;
  author: string;
  year: number;

  constructor(title: string, author: string, year: number) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  displayInfo(): void {
    console.log(`Sách: "${this.title}" - Tác giả: ${this.author} (${this.year})`);
  }
}

const book1 = new Book("Dế Mèn Phiêu Lưu Ký", "Tô Hoài", 1941);
book1.displayInfo();

export {};
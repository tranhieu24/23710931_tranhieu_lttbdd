class Book {
  constructor(public title: string, public author: string) {}
}

class User {
  constructor(public name: string) {}
}

class Library {
  books: Book[] = [];
  users: User[] = [];

  addBook(book: Book): void {
    this.books.push(book);
    console.log(`Đã thêm sách: ${book.title}`);
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  listBooks(): void {
    console.log("Danh sách sách trong thư viện:");
    this.books.forEach((b) => console.log(`- ${b.title} (${b.author})`));
  }
}

const library1 = new Library();
library1.addBook(new Book("Truyện Kiều", "Nguyễn Du"));
library1.addBook(new Book("Số Đỏ", "Vũ Trọng Phụng"));
library1.listBooks();

export {};

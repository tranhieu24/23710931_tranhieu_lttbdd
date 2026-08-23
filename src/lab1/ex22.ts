class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const stack1 = new Stack<number>();
stack1.push(10);
stack1.push(20);
stack1.push(30);

console.log(`Phần tử trên cùng (peek): ${stack1.peek()}`); 
console.log(`Pop ra: ${stack1.pop()}`); 
console.log(`Peek sau khi pop: ${stack1.peek()}`); 
console.log(`Stack rỗng chưa? ${stack1.isEmpty()}`); 

export {};

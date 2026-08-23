interface Movable {
  move(): void;
}

class Car implements Movable {
  move(): void {
    console.log("Xe hơi đang chạy trên đường");
  }
}

class Robot implements Movable {
  move(): void {
    console.log("Robot đang di chuyển bằng bánh xích");
  }
}

const movables: Movable[] = [new Car(), new Robot()];
movables.forEach((m) => m.move());

export {};

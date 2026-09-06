// 9. Write a Promise that reads an array after 1 second and filters even numbers.
function readArrayAndFilterEven(): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const evenNumbers = numbers.filter((n) => n % 2 === 0);
      resolve(evenNumbers);
    }, 1000);
  });
}

readArrayAndFilterEven().then((result) => console.log("Số chẵn:", result));
export {};

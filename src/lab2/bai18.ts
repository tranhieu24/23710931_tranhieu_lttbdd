// 18. Write an async function fetchUser(id) that simulates an API call (resolves a user object after 1 second).
interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 1000);
  });
}

async function main() {
  const user = await fetchUser(1);
  console.log("User nhận được:", user);
}

main();
export {};

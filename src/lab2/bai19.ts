// 19. Create an async function fetchUsers(ids: number[]) that calls fetchUser for each ID.
interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 500);
  });
}

async function fetchUsers(ids: number[]): Promise<User[]> {
  const users = await Promise.all(ids.map((id) => fetchUser(id)));
  return users;
}

async function main() {
  const users = await fetchUsers([1, 2, 3]);
  console.log("Danh sách user:", users);
}

main();
export {};

// 23. Write an async function that fetches a list of todos and filters out those that are not completed.
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function getIncompleteTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
  const todos: Todo[] = await response.json();
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  console.log("Todos chưa hoàn thành:", incompleteTodos);
}

getIncompleteTodos();
export {};

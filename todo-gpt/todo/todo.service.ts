import { todos } from './todo.database';
import { Todo } from './todo.types';

export function getTodoByUserId(userId: number) {
  return JSON.stringify(todos.filter(todo => todo.userId === userId));
}

export function addTodoToUser(userId: number, todo: Todo) {
  if (todos.some(t => t.userId === userId && t.title === todo.title)) {
    return 'already_exists';
  }
  todos.push({ ...todo, userId });

  return 'success';
}

export function removeTodoFromUser(userId: number, todoTitle: string) {
  const index = todos.findIndex(todo => todo.userId === userId && todo.title === todoTitle);
  if (index !== -1) {
    todos.splice(index, 1);
  }

  return 'success';
}

export function updateTodoByTitle(userId: number, todoTitle: string, todo: Partial<Todo>) {
  const index = todos.findIndex(todo => todo.userId === userId && todo.title === todoTitle);
  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      ...todo,
    };
  }

  return 'success';
}

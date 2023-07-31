
export interface Todo {
  userId: number;
  title: string;
  description: string | null;
  deadline: string | null;
  isDone: boolean;
}

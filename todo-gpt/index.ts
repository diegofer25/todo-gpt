import { Context, HttpRequest } from "@azure/functions"
import { isChatCompletionMessages } from "./chat-completion.types";
import { getChatCompletion } from "./chat-completion.service";
import { addTodoToUser, getTodoByUserId, removeTodoFromUser, updateTodoByTitle } from "./todo/todo.service";
import { Todo } from "./todo/todo.types";

export default async function todoGpt (context: Context, req: HttpRequest): Promise<void> {
    const messages = req.body.messages;
    const userId = req.body.userId;

    if (!messages || !Array.isArray(messages) || !isChatCompletionMessages(messages) || !userId || typeof userId !== 'number') {
        context.res = {
            status: 400,
            body: 'Bad Request'
        };
        return;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            "Content-Type": "application/json"
        },
        body: await getChatCompletion(messages, {
            get_todo_list: async () => {
                return getTodoByUserId(userId);
            },
            add_todo: async (todo: Todo) => {
                return addTodoToUser(userId, todo);
            },
            remove_todo: async (payload: {task_title: string}) => {
                return removeTodoFromUser(userId, payload.task_title);
            },
            update_task: async ({ task_title, ...newTask }: { task_title: string, new_title?: string, new_description?: string, new_deadline?: string, new_isDone: boolean }) => {
                return updateTodoByTitle(userId, task_title, {
                    title: newTask.new_title,
                    description: newTask.new_description,
                    deadline: newTask.new_deadline,
                    isDone: newTask.new_isDone,
                });
            }
        })
    };
};

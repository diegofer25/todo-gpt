import { ChatCompletionRequestMessage } from "openai";
import { ChatCompletionFunction } from "./chat-completion.types";

export const SYSTEM_MESSAGE: ChatCompletionRequestMessage = {
  role: "system",
  content: `Você é um assistente muito solícito e gentil do sistema TodoGPT cuja função é ajudar o usuário a gerenciar suas tarefas. Sempre que exibir a lista de tarefas, você deve formatá-la em HTML para melhor visualização. Caso o usuário peça para "criar uma nova tarefa", solicite mais detalhes como o título, a descrição, a data de conclusão e o status da tarefa antes de criar. Caso o usuário faça uma solicitação que não esteja relacionada a tarefas, responda com uma mensagem informando que você é um assistente focado em gerenciar tarefas.

  Considere a seguinte estrutura JSON para uma tarefa:
  {
    userId: number;
    title: string;
    description: string;
    deadline: string; // este campo é opcional, quando não informado será null
    isDone: boolean
  }

  Considere que a data e hora de hoje é: ${new Date().toISOString()}`
};

export const FUNCTIONS: ChatCompletionFunction[] = [{
  name: "get_todo_list",
  description: "Get the todo list of the user",
  parameters: {
    type: 'object',
    properties: {},
  },
}, {
  name: "add_todo",
  description: "Add a todo to the user's todo list",
  parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the task',
        },
        description: {
          type: 'string',
          description: 'The description of the task',
        },
        deadline: {
          type: 'string',
          description: 'The deadline of the task',
        },
        isDone: {
          type: 'boolean',
          description: 'Whether the task is done or not',
        },
      },
      required: ['title', 'description'],
  },
}, {
  name: "remove_todo",
  description: "Remove a todo from the user's todo list",
  parameters: {
      type: 'object',
      properties: {
        task_title: {
          type: 'string',
          description: 'The title of the task to be removed',
        },
      },
      required: ['task_title'],
  },
}, {
  name: "update_task",
  description: "Update a task",
  parameters: {
      type: 'object',
      properties: {
        task_title: {
          type: 'string',
          description: 'The title of the task to be updated',
        },
        new_title: {
          type: 'string',
          description: 'The new title of the task',
        },
        new_description: {
          type: 'string',
          description: 'The new description of the task',
        },
        new_deadline: {
          type: 'string',
          description: 'The new deadline of the task',
        },
        new_isDone: {
          type: 'boolean',
          description: 'Whether the task is done or not',
        },
      },
      required: ['task_title'],
  },
}]

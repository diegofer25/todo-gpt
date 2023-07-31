import axios from 'axios';
import { FUNCTIONS, SYSTEM_MESSAGE } from './chat-completion.configs';
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, ChatCompletionResponseMessageRoleEnum, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai';

const azureOpenAiApi = axios.create({
  baseURL: 'https://x2digital.openai.azure.com/openai/deployments/gpt-3-16/chat',
  headers: {
    'Content-Type': 'application/json',
    'api-key': process.env.AZURE_OPENAI_API_KEY_CHAT_GPT_16K
  }
});

interface FunctionHandler {
  (parameters: any): Promise<string>
}

export async function getChatCompletion<T extends Record<string, FunctionHandler>>(
  messages: ChatCompletionRequestMessage[],
  functions?: T,
  options: Omit<CreateChatCompletionRequest, 'messages' | 'model'> = {
    temperature: 0,
    max_tokens: 1024,
    function_call: "auto"
  }
): Promise<ChatCompletionResponseMessage> {
  return azureOpenAiApi.post<CreateChatCompletionResponse>('/completions?api-version=2023-07-01-preview', {
    messages: [
      SYSTEM_MESSAGE,
      ...messages,
    ],
    functions: FUNCTIONS,
    ...options
  }).then(async res => {
    if (res.data.choices[0].finish_reason === 'function_call') {
      const handler = functions[res.data.choices[0].message.function_call.name];

      if (!handler) {
        return {
          role: ChatCompletionResponseMessageRoleEnum.Assistant,
          content: "Ocorreu um erro ao tentar se comunicar com o servidor. Teste novamente mais tarde, caso persista entre em contato com o suporte!"
        }
      }

      return getChatCompletion([...messages, {
        ...res.data.choices[0].message,
        content: res.data.choices[0].message.content ?? ''
      }, {
        role: ChatCompletionResponseMessageRoleEnum.Function,
        name: res.data.choices[0].message.function_call.name,
        content: await handler(JSON.parse(res.data.choices[0].message.function_call.arguments))
      }], functions, options);
    }

    return res.data.choices[0].message;
  })
  .catch(err => {
    if (axios.isAxiosError(err)) {
      if (err.response.data.error?.code === 'content_filter') {
        return {
          role: ChatCompletionResponseMessageRoleEnum.Assistant,
          content: "Sua mensagem violá as regras de uso do sistema. Por favor, reformule sua mensagem."
        }
      }

      console.log('UNMAPPED ERROR', err.response.data.error)
    }

    return {
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: "Ocorreu um erro ao tentar se comunicar com o servidor. Teste novamente mais tarde, caso persista entre em contato com o suporte!"
    };
  });
}

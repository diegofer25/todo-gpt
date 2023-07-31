import { ChatCompletionFunctions, ChatCompletionRequestMessage } from 'openai';

export interface ChatCompletionFunction extends ChatCompletionFunctions {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, FunctionProperty>;
    required?: string[];
  };
}

interface FunctionProperty {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array';
  description: string;
}

export function isChatCompletionMessages (messages: unknown): messages is ChatCompletionRequestMessage[] {
  return Array.isArray(messages) && messages.every(m => typeof m === 'object' && m !== null && 'role' in m && ('content' in m || 'function_call' in m));
}

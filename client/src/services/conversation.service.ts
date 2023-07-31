import axios from 'axios';

export async function sendMessage (messages: ChatMessage[]): Promise<ChatMessage> {
  const response = await axios.post('/api/todo-gpt', { messages, userId: 1 })

  return response.data;
}

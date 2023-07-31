import { ref } from 'vue';
import * as conversationService from '@/services/conversation.service';

const DEFAULT_ASSISTANT_MESSAGE: ChatMessage = {
  content: 'Olá, eu sou o TodoGPT, seu assistente pessoal de gerenciamento de tarefas. Como posso te ajudar?',
  role: 'assistant'
}

export function useConversation () {
  const conversation = ref<ChatMessage[]>([DEFAULT_ASSISTANT_MESSAGE])
  const userMessage = ref('')
  const isThinkings = ref(false)

  return {
    conversation,
    userMessage,
    isThinkings,
    sendTextMessage,
    clearConversation,
  }

  async function sendTextMessage () {
    if (!userMessage.value) return
    conversation.value.push({
      content: userMessage.value,
      role: 'user'
    })
    userMessage.value = '';
    isThinkings.value = true

    try {
      const response = await conversationService.sendMessage(conversation.value.slice(-10))

      conversation.value.push(response)
    } finally {
      isThinkings.value = false
    }
  }

  function clearConversation () {
    conversation.value = [DEFAULT_ASSISTANT_MESSAGE]
  }
}

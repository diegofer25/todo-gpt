<template>
  <div class="todo-gpt">
    <h1 class="todo-gpt__title">
      TODO GPT
    </h1>
    <div class="todo-gpt__chat">
      <div class="todo-gpt__message" v-for="(message, index) in conversation" :key="index" :class="message.role === 'user' && '-is-user'">
        <span v-html="message.content"></span>
      </div>
      <div class="todo-gpt__message" style="padding: 0 20px;" v-if="isThinkings">
        <img style="width: 50px; height: auto;" src="src/assets/typing.gif" />
      </div>
    </div>
    <div class="todo-gpt__options">
      <button :disabled="isThinkings" class="todo-gpt__clear-conversation" @click="clearConversation">Clear Conversation</button>
    </div>
    <form class="todo-gpt__input-container" @submit.prevent="sendTextMessage">
      <input class="todo-gpt__input" type="text" v-model="userMessage" :disabled="isThinkings" />
      <button type="submit" class="todo-gpt__send" :disabled="isThinkings">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useConversation } from '@/composables/use-conversation';

const { conversation, userMessage, isThinkings, clearConversation, sendTextMessage } = useConversation();
</script>


<style scoped lang="scss">
.todo-gpt {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: min-content 81vh min-content min-content;
  min-height: 100vh;

  &__title {
    margin: 0;
    padding: 10px;
    color: #fff;
  }

  &__chat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    padding: 10px 20px;
    flex-grow: 1;
    overflow-y: auto;
    background-color: #515151;
    max-height: 81vh;
    margin: 0 10px;
  }

  &__options {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 25px;
    gap: 10px;
    padding: 10px;
  }

  &__input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    gap: 10px;
    padding: 10px;
  }

  &__input {
    flex-grow: 1;
    height: 50px;
  }

  &__clear-conversation {
    height: 100%;
  }

  &__send {
    width: 150px;
    height: 50px;
  }

  &__message {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    color: #000;
    max-width: 75%;
    align-self: flex-start;

    &::after {
      content: '';
      position: absolute;
      top: 10px;
      left: -10px;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid #fff;
    }

    &.-is-user {
      align-self: flex-end;
      background-color: #000;
      color: #fff;

      &::after {
        left: auto;
        right: -10px;
        border-right: none;
        border-left: 10px solid #000;
      }
    }
  }
}
</style>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  max-height: 100vh;
}

* {
  border-radius: 20px;
}

button {
  border: none;

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
  }
}

:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

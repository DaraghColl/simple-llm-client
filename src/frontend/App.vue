<template>
  <div class="container mx-auto flex h-screen flex-col gap-4 p-4">
    <div id="output" class="h-full grow overflow-scroll">
      <div
        v-if="outputValue === ''"
        class="flex h-full items-center justify-center"
      >
        <LandingImage theme="dark" />
      </div>
      <div v-else>
        <Conversation :response="outputValue" />
      </div>
    </div>
    <SendMessage :loading="loading" :send-message="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SendMessage from './components/SendMessage/SendMessage.vue';
import LandingImage from './components/LandingImage/LandingImage.vue';
import Conversation from './components/Conversation/Conversation.vue';

const outputValue = ref<string>('');
const loading = ref<boolean>(false);

const sendMessage = async (inputText: string) => {
  console.log('🚀 ~ sendMessage ~ inputText:', inputText);

  if (!inputText) return;
  loading.value = true;

  window.electronAPI.onChatStreamChunk((chunk: string) => {
    loading.value = false;
    outputValue.value += chunk;
    console.log('🚀 ~ outputValue:', outputValue);
  });

  window.electronAPI.onChatStreamEnd(() => {
    console.log('Chat stream ended.');
  });

  try {
    await window.electronAPI.startChatStream(inputText);
  } catch (error) {
    console.error('Error starting chat stream:', error);
  }
};
</script>

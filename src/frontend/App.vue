<template>
  <div class="container mx-auto flex h-screen flex-col gap-4 p-4">
    <div class="h-full grow overflow-scroll" id="output">
      <div
        v-if="outputValue === ''"
        class="flex h-full items-center justify-center"
      >
        <LandingImage theme="dark" />
      </div>
    </div>
    <SendMessage :loading="loading" :send-message="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SendMessage from './components/SendMessage/SendMessage.vue';
import LandingImage from './components/LandingImage/LandingImage.vue';

const outputValue = ref<string>('');
const loading = ref<boolean>(false);

const sendMessage = (inputText: string) => {
  console.log('🚀 ~ sendMessage ~ inputText:', inputText);
};
</script>

<template>
  <div
    class="flex items-center rounded-sm border-gray-100 p-2 shadow-md ring shadow-gray-800 ring-gray-800 ring-offset-0"
  >
    <input
      class="w-full text-sm text-gray-800 outline-0 dark:text-gray-200"
      type="text"
      placeholder="ask anything"
      :value="inputText"
      @input="(event) => (inputText = (event.target as HTMLInputElement).value)"
      v-on:keyup.enter="sendMessage(inputText)"
    />

    <button @click="sendMessage(inputText)" class="cursor-pointer">
      <div v-if="loading">
        <LoaderCircle
          class="w-4 animate-spin stroke-gray-800 dark:stroke-gray-200"
        />
      </div>
      <div v-else>
        <SendHorizonal class="w-4 stroke-gray-800 dark:stroke-gray-200" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SendHorizonal, LoaderCircle } from 'lucide-vue-next';

interface Props {
  loading: boolean;
  sendMessage: (inputText: string) => void;
}

const { sendMessage } = defineProps<Props>();
const inputText = ref<string>('');
</script>

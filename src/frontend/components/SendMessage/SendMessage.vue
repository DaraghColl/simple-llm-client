<template>
  <div
    class="flex items-center rounded-sm border-gray-100 p-2 shadow-md ring shadow-gray-800 ring-gray-800 ring-offset-0"
  >
    <input
      class="w-full text-sm text-gray-800 outline-0 dark:text-gray-200"
      type="text"
      placeholder="ask anything"
      :value="inputText"
      @input="(event) => setInputText((event.target as HTMLInputElement).value)"
      @keyup.enter="sendMessage(inputText)"
    />

    <button class="cursor-pointer" @click="sendMessage(inputText)">
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
import { SendHorizonal, LoaderCircle } from 'lucide-vue-next';

interface Props {
  loading: boolean;
  inputText: string;
  sendMessage: (inputText: string) => Promise<void>;
  setInputText: (inputText: string) => void;
}

const { loading, inputText } = defineProps<Props>();
</script>

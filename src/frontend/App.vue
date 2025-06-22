<template>
  <div class="container mx-auto flex h-screen flex-col gap-4 p-4">
    <div id="output" class="relative h-full grow overflow-scroll">
      <div
        v-if="currentConversation.length === 0 && !loading"
        class="flex h-full items-center justify-center"
      >
        <LandingImage theme="dark" />
      </div>
      <div v-else>
        <Conversation :conversation="currentConversation" />
      </div>
    </div>
    <button
      v-if="!isOllamaConnected"
      class="flex cursor-pointer items-center gap-2 rounded-sm border-2 p-1"
      style="width: fit-content"
      @click="setUpOllama"
    >
      <Cable />
      retry connection
    </button>
    <SendMessage
      :loading="loading"
      :input-text="inputText"
      :set-input-text="setInputText"
      :send-message="sendMessage"
    />
  </div>
  <ErrorMessage
    :show-error="showErrorMessage"
    :error-message="errorMessage"
    :close-error-message="closeErrorMessage"
  />
  <Settings />
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import SendMessage from '@components/SendMessage/SendMessage.vue';
import LandingImage from '@components/LandingImage/LandingImage.vue';
import Conversation from '@components/Conversation/Conversation.vue';
import ErrorMessage from '@components/ErrorMessage/ErrorMessage.vue';
import Settings from '@components/Settings/Settings.vue';
import { Cable } from 'lucide-vue-next';
import { getModel, setModel, setModelList } from '@state/model';
import {
  getMessages,
  setMessages,
  updateLastMessageContent,
} from '@state/chat';
import { Message } from 'ollama';

const inputText = ref<string>('');
const loading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const showErrorMessage = ref<boolean>(false);
const isOllamaConnected = ref<boolean>(true);
const currentConversation = getMessages();

const setInputText = (value: string) => {
  inputText.value = value;
};

onMounted(() => {
  setUpOllama();

  window.electronAPI.onChatStreamChunk((chunk: string) => {
    updateLastMessageContent(chunk);
  });

  window.electronAPI.onChatStreamEnd(() => {
    console.log('Chat stream ended.');
    loading.value = false;
    setInputText('');
  });
});

const setUpOllama = async () => {
  const isOllamaRunning = await window.electronAPI.checkIsOllamaRunning();

  if (!isOllamaRunning) {
    openErrorMessage(
      'Ollama is not running. Please start ollama to use this app.'
    );
    isOllamaConnected.value = false;
    return;
  }

  isOllamaConnected.value = true;
  fetchModels();
};

const fetchModels = async () => {
  const models = await window.electronAPI.fetchModels();
  if (models) {
    setModelList(models.models);
    setModel(models.models[0].model);
  }
};

const openErrorMessage = (message: string) => {
  errorMessage.value = message;
  showErrorMessage.value = true;
};

const closeErrorMessage = () => {
  errorMessage.value = null;
  showErrorMessage.value = false;
};

const sendMessage = async (input: string) => {
  if (!input) return;
  loading.value = true;
  inputText.value = '';

  // Add the user message
  const userMessage: Message = {
    role: 'user',
    content: input,
  };
  setMessages(userMessage);

  const assistantPlaceholderMessage: Message = {
    role: 'assistant',
    content: '',
  };

  setMessages(assistantPlaceholderMessage);

  await nextTick();

  const currentConversationParsed = JSON.parse(
    JSON.stringify(currentConversation)
  );

  try {
    await window.electronAPI.startChatStream(
      currentConversationParsed,
      getModel()
    );
  } catch (error) {
    console.error('Error starting chat stream:', error);
    openErrorMessage('Error starting chat stream');
    loading.value = false;
  }
};
</script>

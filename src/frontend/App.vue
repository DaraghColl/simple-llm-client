<template>
  <div class="container mx-auto flex h-screen flex-col gap-4 p-4">
    <div id="output" class="no-scrollbar relative h-full grow overflow-scroll">
      <div
        v-if="currentConversation.length === 0 && !generatingFirstResponse"
        class="flex h-full items-center justify-center"
      >
        <LandingImage theme="dark" />
      </div>
      <div v-else>
        <Conversation
          :conversation="currentConversation"
          :generating-first-response="generatingFirstResponse"
          :generating-complete-response="generatingCompleteResponse"
        />
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
      :generating-complete-response="generatingCompleteResponse"
      :input-text="inputText"
      :set-input-text="setInputText"
      :send-message="sendMessage"
    />
  </div>
  <ErrorMessage />

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
import { useError } from '@composables/useError/useError';
const { setError } = useError();

const inputText = ref<string>('');
const generatingFirstResponse = ref<boolean>(false);
const generatingCompleteResponse = ref<boolean>(false);
const isOllamaConnected = ref<boolean>(true);
const currentConversation = getMessages();

const setInputText = (value: string) => {
  inputText.value = value;
};

onMounted(() => {
  setUpOllama();

  try {
    window.electronAPI.onChatStreamChunk((chunk: string) => {
      console.log('🚀 ~ window.electronAPI.onChatStreamChunk ~ chunk:', chunk);
      if (chunk === 'Error: fetch failed') {
        setError('fetch response failed');
        generatingFirstResponse.value = false;

        return;
      }
      updateLastMessageContent(chunk);
      generatingFirstResponse.value = false;
    });
  } catch {
    setError('Error streaming chat messages');
  }

  try {
    window.electronAPI.onChatStreamEnd(() => {
      console.log('Chat stream ended.');
      generatingCompleteResponse.value = false;
      setInputText('');
    });
  } catch {
    setError('Error with chat');
  }
});

const setUpOllama = async () => {
  const isOllamaRunning = await window.electronAPI.checkIsOllamaRunning();

  if (!isOllamaRunning) {
    setError('Ollama is not running. Please start ollama to use this app.');

    isOllamaConnected.value = false;
    return;
  }

  isOllamaConnected.value = true;
  fetchModels();
};

const fetchModels = async () => {
  try {
    const models = await window.electronAPI.fetchModels();
    if (models) {
      setModelList(models.models);
      setModel(models.models[0].model);
    }
  } catch {
    setError('Error fetching model list');
  }
};

const sendMessage = async (input: string) => {
  if (!input) return;
  generatingFirstResponse.value = true;
  generatingCompleteResponse.value = true;
  inputText.value = '';

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
    setError('Error starting chat');
    generatingFirstResponse.value = false;
    generatingCompleteResponse.value = false;
  }
};
</script>

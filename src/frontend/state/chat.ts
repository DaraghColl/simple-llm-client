import { ref } from 'vue';
import { Message } from 'ollama';

const chatMessages = ref<Message[]>([]);

const getMessages = () => chatMessages.value;

const setMessages = (message: Message) => chatMessages.value.push(message);

// updates the assistant message so acts as streaming to the UI
const updateLastMessageContent = (chunk: string) => {
  if (chatMessages.value.length > 0) {
    const lastMessage = chatMessages.value[chatMessages.value.length - 1];
    if (lastMessage.role === 'assistant') {
      lastMessage.content += chunk;
    }
  }
};

export { getMessages, setMessages, updateLastMessageContent };

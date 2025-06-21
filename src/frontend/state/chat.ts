import { ref } from 'vue';
import { Message } from 'ollama';

const chatMessages = ref<Message[]>([]);

const getMessages = () => chatMessages.value;

const setMessages = (message: Message) => chatMessages.value.push(message);
console.log('🚀 ~ setMessages:', setMessages);

export { getMessages, setMessages };

import { ListResponse, Message } from 'ollama';

export interface IElectronAPI {
  startChatStream: (messages: Message[], model: string) => Promise<string>;
  onChatStreamChunk: (callback: (chunk: string) => void) => void;
  onChatStreamEnd: (callback: () => void) => void;
  appQuit: () => void;
  fetchModels: () => Promise<ListResponse>;
  checkIsOllamaRunning: () => Promise<boolean>;
}

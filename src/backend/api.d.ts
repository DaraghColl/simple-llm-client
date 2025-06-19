import { ListResponse } from 'ollama';

export interface IElectronAPI {
  startChatStream: (prompt: string) => Promise<string>;
  onChatStreamChunk: (callback: (chunk: string) => void) => void;
  onChatStreamEnd: (callback: () => void) => void;
  appQuit: () => void;
  fetchModels: () => Promise<ListResponse>;
}

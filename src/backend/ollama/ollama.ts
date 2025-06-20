import ollama, { ListResponse } from 'ollama';

const checkIsOllamaRunning = async () => {
  try {
    await ollama.list();
    return true;
  } catch (error) {
    return false;
  }
};

const fetchModels = async (): Promise<ListResponse> => {
  try {
    const models = await ollama.list();

    return models;
  } catch (error) {
    console.error('failed to find models', error);
  }
};

export { checkIsOllamaRunning, fetchModels };

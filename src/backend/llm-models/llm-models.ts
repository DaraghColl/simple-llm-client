import ollama, { ListResponse } from 'ollama';

const fetchModels = async (): Promise<ListResponse> => {
  try {
    const models = await ollama.list();

    return models;
  } catch (error) {
    console.error('failed to find models', error);
  }
};

export { fetchModels };

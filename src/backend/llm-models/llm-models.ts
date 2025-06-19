import ollama, { ListResponse } from 'ollama';

const fetchModels = async (): Promise<ListResponse> => {
  console.log('🚀 ~ fetchModels ~ fetchModels:', fetchModels);
  try {
    const models = await ollama.list();
    console.log('🚀 ~ fetchModels ~ models:', models);

    return models;
  } catch (error) {
    console.error('failed to find models', error);
  }
};

export { fetchModels };

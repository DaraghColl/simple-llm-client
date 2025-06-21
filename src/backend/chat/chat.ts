import ollama, { Message } from 'ollama';

const MODEL = 'gemma3:1b';

// used to check for model before trying to send message
const initializeOllamaModel = async (modelName: string): Promise<void> => {
  console.log(`Attempting to pull Ollama model: "${modelName}"`);
  try {
    await ollama.pull({ model: modelName });
    console.log(`Model "${modelName}" pulled successfully.`);
  } catch (error) {
    console.warn(`Could not pull model "${modelName}"`, error);
  }
};

const chat = async function* (
  messages: Message[] = [],
  modelName: string = MODEL
): AsyncGenerator<string> {
  await initializeOllamaModel(modelName);

  try {
    const responseStream = await ollama.chat({
      model: modelName,
      messages: messages,
      stream: true,
    });

    for await (const chunk of responseStream) {
      // console.log('🚀 ~ forawait ~ chunk:', chunk);
      if (chunk.message.content) {
        yield chunk.message.content;
      }
    }
  } catch (error) {
    console.error('Error during chat streaming:', error);
    yield `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export { chat };

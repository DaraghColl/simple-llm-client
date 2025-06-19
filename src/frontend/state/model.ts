import { ref } from 'vue';
import { ListResponse } from 'ollama';

const model = ref<string | null>(null);
const modelList = ref<ListResponse['models'] | null>(null);

const getModel = () => model.value;
const setModel = (modelValue: string) => (model.value = modelValue);

const getModelList = () => modelList.value;
const setModelList = (modelListValue: ListResponse['models']) =>
  (modelList.value = modelListValue);

export { getModel, setModel, getModelList, setModelList };

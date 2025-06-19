<template>
  <div>
    <button
      class="absolute top-2 right-2 z-10 cursor-pointer opacity-50 hover:opacity-100"
      @click="setMenuActive(!settingsMenuActive)"
    >
      <Cog />
    </button>

    <div
      v-if="settingsMenuActive"
      class="pos absolute top-10 right-2 min-w-1/2 rounded-sm border-2 border-gray-800 bg-gray-800 text-sm"
    >
      <ul class="flex flex-col">
        <li class="rounded-sm p-2 hover:bg-gray-950">
          <button class="cursor-pointer" @click="fetchModels">Menu item</button>
          <select v-model="activeModel" class="model-select">
            <option disabled value="">Please select one</option>
            <option
              v-for="model in llmModelOptions"
              :key="model.name"
              :value="model.name"
            >
              {{ model.name }}
            </option>
          </select>
        </li>
        <li class="cursor-pointer rounded-sm p-2 hover:bg-gray-950">
          <button class="cursor-pointer" @click="appQuit">quit trayAI</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cog } from 'lucide-vue-next';
import { ref } from 'vue';
import { ListResponse } from 'ollama';

const settingsMenuActive = ref<boolean>(false);
const activeModel = ref<string>('');
const llmModelOptions = ref<ListResponse['models'] | null>(null);
const setMenuActive = (value: boolean) => (settingsMenuActive.value = value);

const fetchModels = async () => {
  const models = await window.electronAPI.fetchModels();
  if (models) {
    llmModelOptions.value = models.models;
  }
  console.log('🚀 ~ fetchModels ~ models:', models);
};

const appQuit = () => {
  window.electronAPI.appQuit();
};
</script>

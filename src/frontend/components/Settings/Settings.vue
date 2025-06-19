<template>
  <div ref="settings-menu-ref">
    <button
      class="absolute top-2 right-2 z-10 cursor-pointer opacity-50 hover:opacity-100"
      @click="toggleSettingsMenu"
    >
      <Cog />
    </button>

    <div
      v-if="settingsMenuActive"
      class="pos absolute top-10 right-2 min-w-1/2 rounded-sm border-2 border-gray-800 bg-gray-800 text-sm"
    >
      <ul class="flex flex-col">
        <li class="rounded-sm p-2 hover:bg-gray-950">
          <div class="flex items-center gap-2">
            <Brain class="w-5 stroke-blue-600" />
            <select
              :value="getModel()"
              class="cursor-pointer outline-0"
              @change="
                handleModelChange(($event.target as HTMLSelectElement).value)
              "
            >
              <option
                v-for="model in getModelList()"
                :key="model.name"
                :value="model.name"
              >
                {{ model.name }}
              </option>
            </select>
          </div>
        </li>
        <li class="cursor-pointer rounded-sm p-2 hover:bg-gray-950">
          <button
            class="flex cursor-pointer items-center gap-2"
            @click="appQuit"
          >
            <PowerCircle class="w-5 stroke-blue-600" />
            quit tray ai
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cog } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { getModel, getModelList, setModel } from '../../state/model';
import { PowerCircle, Brain } from 'lucide-vue-next';

const settingsMenuActive = ref<boolean>(false);
const settingsMenuRef = useTemplateRef('settings-menu-ref');

const toggleSettingsMenu = () => {
  settingsMenuActive.value = !settingsMenuActive.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    settingsMenuActive.value === true &&
    !settingsMenuRef.value.contains(event.target as Node)
  ) {
    toggleSettingsMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleModelChange = (newValue: string) => {
  setModel(newValue);
};

const appQuit = () => {
  window.electronAPI.appQuit();
};
</script>

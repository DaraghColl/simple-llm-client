<template>
  <Transition name="modal-bounce">
    <div
      v-if="getError()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/10"
    >
      <div
        class="relative mx-4 w-full max-w-sm rounded-lg bg-gray-900 p-6 shadow-xl"
      >
        <h2 class="text-2xl font-bold">Something went wrong</h2>
        <p class="my-4 text-sm font-light tracking-wide">
          {{ getError() }}
        </p>
        <button class="cursor-pointer" @click="clearError()">
          <XCircle class="absolute top-2 right-2" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XCircle } from 'lucide-vue-next';
import { useError } from '@composables/useError/useError';

const { getError, clearError } = useError();
</script>

<style>
/* CSS for the modal-bounce transition */
.modal-bounce-enter-active {
  animation: bounce-in 0.5s;
}

.modal-bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

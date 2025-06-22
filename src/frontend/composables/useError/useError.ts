import { ref } from 'vue';

const error = ref<string | null>(null);

const useError = () => {
  const getError = () => error.value;

  const setError = (value: string | null, callback?: () => void) => {
    error.value = value;
    callback && callback();
  };

  const clearError = () => {
    error.value = null;
  };

  return { getError, setError, clearError };
};

export { useError };

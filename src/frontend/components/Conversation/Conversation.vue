<!-- eslint-disable vue/no-v-html -->
<template>
  <p class="prose dark:prose-invert prose-sm mt-5" v-html="parsedMarkdown" />
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';

marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Props {
  response: string;
}

const { response } = defineProps<Props>();

// const parsedMarkdown = marked.parse(response);
const parsedMarkdown = computed(() => marked.parse(response));
</script>

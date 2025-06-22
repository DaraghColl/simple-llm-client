<!-- eslint-disable vue/no-v-html -->
<template>
  <p class="prose dark:prose-invert prose-sm mt-5" v-html="parsedMarkdown" />
</template>

<script setup lang="ts">
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed } from 'vue';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Props {
  response: string;
}

const { response } = defineProps<Props>();

const parsedMarkdown = computed(() => marked.parse(response));
</script>

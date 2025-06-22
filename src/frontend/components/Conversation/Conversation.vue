<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-for="(message, index) in props.conversation"
    :key="index"
    :ref="
      (el) => {
        if (index === props.conversation.length - 1)
          lastMessage = el as HTMLDivElement;
      }
    "
    class="mt-10"
  >
    <div
      class="my-5 rounded-sm p-2"
      :class="{
        'ml-auto w-fit rounded-tr-none border border-gray-800 p-2 shadow-md ring shadow-gray-800 ring-gray-800 ring-offset-0':
          message.role === 'user',
        'min-h-32': message.role === 'assistant',
      }"
    >
      <p
        class="prose dark:prose-invert prose-sm"
        v-html="formatMessage(message.content)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Message } from 'ollama';

interface Props {
  conversation: Message[];
}

const props = defineProps<Props>();

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

const lastMessage = ref<HTMLDivElement | null>(null);

const scrollToLastMessage = async () => {
  await nextTick();
  if (lastMessage.value) {
    lastMessage.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  } else {
    console.log(
      'lastMessage.value is still null/undefined, perhaps not yet rendered or element not found.'
    );
  }
};

watch(
  () => props.conversation.length,
  () => {
    scrollToLastMessage();
  },
  { immediate: true }
);

const formatMessage = (message: string) => marked.parse(message);
</script>

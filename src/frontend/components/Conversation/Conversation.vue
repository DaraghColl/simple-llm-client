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
  >
    <div
      class="my-5 rounded-sm p-2"
      :class="{
        'ml-auto w-fit rounded-tr-none border border-gray-800 p-2 shadow-md ring shadow-gray-800 ring-gray-800 ring-offset-0':
          message.role === 'user',
        'min-h-32': message.role === 'assistant',
      }"
    >
      <div
        v-if="
          props.generatingFirstResponse === true &&
          index === props.conversation.length - 1 &&
          message.role === 'assistant'
        "
        class="flex gap-4"
      >
        <LoaderCircle
          class="mb-4 w-4 animate-spin stroke-gray-800 dark:stroke-gray-200"
        />
        Thinking...
      </div>
      <p
        class="prose dark:prose-invert prose-sm"
        v-html="formatMessage(message.content)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUpdated } from 'vue';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Message } from 'ollama';
import { LoaderCircle } from 'lucide-vue-next';

interface Props {
  conversation: Message[];
  generatingFirstResponse: boolean;
  generatingCompleteResponse: boolean;
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

const addCopyButtons = () => {
  const preElements = document.querySelectorAll('pre')!;
  preElements.forEach((preBlock) => {
    preBlock.classList.add('relative');
    preBlock.classList.add('pt-5');

    const codeElements = preBlock.querySelectorAll('code');
    codeElements.forEach((codeBlock) => {
      const copyCodeButton = document.createElement('button');
      copyCodeButton.innerText = 'copy code';
      copyCodeButton.className =
        'absolute top-5 right-[.8rem] cursor-pointer bg-gray-900 hover:bg-gray-950 p-2';
      copyCodeButton.addEventListener('click', () =>
        copyCode(codeBlock.innerText)
      );
      codeBlock.insertAdjacentElement('afterend', copyCodeButton);
    });
  });
};

const copyCode = async (codeBlock: string) => {
  try {
    await navigator.clipboard.writeText(codeBlock);
  } catch (err) {
    console.error('Failed to copy code: ', err);
  }
};

watch(
  () => props.generatingCompleteResponse,
  () => {
    addCopyButtons();
  },
  { immediate: true }
);
</script>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const props = defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: "python" },
});

const codeRef = ref(null);

const doHighlight = async () => {
  await nextTick();
  if (!codeRef.value) return;
  try {
    hljs.highlightElement(codeRef.value);
  } catch (e) {}
};

onMounted(doHighlight);
watch(() => props.code, doHighlight);
watch(() => props.language, doHighlight);
</script>

<template>
  <pre class="rounded-lg bg-gray-900 text-white p-4 overflow-auto">
    <code :class="'language-' + language" ref="codeRef" v-text="code"></code>
  </pre>
</template>

<style scoped>
pre {
  white-space: pre;
}
</style>

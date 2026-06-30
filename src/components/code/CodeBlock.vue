<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const props = defineProps({
  code: String,
  language: {
    type: String,
    default: "javascript",
  },
});

const codeRef = ref(null);

const highlight = async () => {
  await nextTick();
  if (codeRef.value) {
    hljs.highlightElement(codeRef.value);
  }
};

onMounted(highlight);
watch(() => props.code, highlight);
</script>

<template>
  <pre class="rounded-xl overflow-auto p-4 bg-gray-100">
    <code ref="codeRef" :class="language">
      {{ code }}
    </code>
  </pre>
</template>

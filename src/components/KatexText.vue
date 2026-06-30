<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const root = ref(null);

const render = async () => {
  await nextTick();
  if (!root.value) return;

  renderMathInElement(root.value, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
};

onMounted(render);
watch(() => props.text, render);
</script>

<template>
  <div ref="root">
    {{ text }}
  </div>
</template>

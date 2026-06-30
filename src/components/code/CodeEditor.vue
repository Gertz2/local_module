<template>
  <textarea ref="ta" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import CodeMirror from "codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";

import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";

const props = defineProps({
  modelValue: { type: String, default: "" },
  language: { type: String, default: "python" },
  options: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["update:modelValue"]);

const ta = ref(null);
let editor = null;

onMounted(() => {
  if (ta.value) ta.value.value = props.modelValue || "";

  editor = CodeMirror.fromTextArea(ta.value, {
    mode: props.language === "python" ? "python" : "javascript",
    theme: "eclipse",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    autofocus: false,
    matchBrackets: true,
    ...props.options,
  });

  editor.on("change", (cm) => {
    const val = cm.getValue();
    emit("update:modelValue", val);
  });
});

watch(
  () => props.modelValue,
  (v) => {
    if (!editor) return;
    const cur = editor.getValue();
    if (v != null && v !== cur) {
      const cursor = editor.getCursor();
      editor.setValue(v);
      try {
        editor.setCursor(cursor);
      } catch {}
    }
  },
);

onBeforeUnmount(() => {
  if (editor) {
    try {
      editor.toTextArea();
    } catch {}
    editor = null;
  }
});
</script>

<style scoped>
:root {
  --editor-min-height: 200px;
}
textarea {
  min-height: var(--editor-min-height);
  display: block;
  width: 100%;
}
</style>

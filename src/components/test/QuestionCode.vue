<script setup>
import { ref, watch } from "vue";
import CodeEditor from "@/components/code/CodeEditor.vue";
import { analyzeCode } from "@/services/codeApi";
import { loadPyodideInstance } from "@/services/pyodideLoader";

const props = defineProps({
  modelValue: { type: String, default: "" },
  question: { type: Object, required: true },
  language: { type: String, default: "python" },
});
const emit = defineEmits(["update:modelValue"]);

const code = ref(props.modelValue ?? "");
watch(
  () => props.modelValue,
  (v) => (code.value = v ?? ""),
);
watch(code, (v) => emit("update:modelValue", v));

const analysis = ref(null);
const checking = ref(false);
const running = ref(false);
const runOutput = ref("");
const runError = ref("");

async function checkCode() {
  if (!code.value || !code.value.trim()) {
    analysis.value = { errors: 1, result: "Код пуст" };
    return;
  }
  checking.value = true;
  try {
    analysis.value = await analyzeCode(code.value);
  } catch (e) {
    analysis.value = { errors: 1, result: "Ошибка анализа" };
  } finally {
    checking.value = false;
  }
}

async function runPython() {
  runOutput.value = "";
  runError.value = "";
  if (!code.value || !code.value.trim()) {
    runError.value = "Код пуст";
    return;
  }
  running.value = true;
  try {
    const pyodide = await loadPyodideInstance();

    try {
      await pyodide.loadPackagesFromImports(code.value);
    } catch (e) {}

    let captured = "";
    const jsWrite = (s) => {
      captured += String(s);
    };
    pyodide.globals.set("js_write", jsWrite);

    const wrapper = `
import sys
class StdCatcher:
    def write(self, s):
        try:
            js_write(s)
        except Exception:
            pass
    def flush(self):
        pass

sys.stdout = StdCatcher()
sys.stderr = StdCatcher()

# user code starts here
${code.value}
`;

    await pyodide.runPythonAsync(wrapper);

    runOutput.value = captured;

    try {
      pyodide.globals.delete("js_write");
    } catch (e) {}
  } catch (err) {
    runError.value = String(err);
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class="font-medium">{{ question.text }}</label>
    <div class="border">
      <CodeEditor v-model="code" :language="language" />
    </div>
    <div class="flex gap-2">
      <button
        v-if="language === 'python'"
        type="button"
        @click="runPython"
        :disabled="running"
        class="px-4 py-2 bg-blue-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-blue-600 border-transparent border-2 transition cursor-pointer"
      >
        {{ running ? "Выполняется..." : "Выполнить" }}
      </button>
    </div>

    <div v-if="analysis" class="p-3 bg-gray-100 rounded text-sm">
      <div><strong>Проверка:</strong> {{ analysis.result }}</div>
      <div class="text-xs text-gray-600">Ошибок: {{ analysis.errors }}</div>
    </div>

    <div
      v-if="runOutput"
      class="mt-2 p-3 bg-white border rounded whitespace-pre-wrap"
    >
      <strong>Вывод:</strong>
      <div class="mt-2 text-sm">{{ runOutput }}</div>
    </div>

    <div
      v-if="runError"
      class="mt-2 p-3 bg-red-100 text-red-800 rounded whitespace-pre-wrap"
    >
      <strong>Ошибка исполнения:</strong>
      <div class="mt-2 text-sm">{{ runError }}</div>
    </div>
  </div>
</template>

<style scoped></style>

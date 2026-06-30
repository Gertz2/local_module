<script setup>
import { ref } from "vue";
import { uploadCode } from "@/services/codeApi";

const file = ref(null);
const loading = ref(false);
const emit = defineEmits(["uploaded"]);

function handleFile(e) {
  file.value = e.target.files[0];
}

async function send() {
  if (!file.value) return;

  loading.value = true;
  try {
    const result = await uploadCode(file.value);
    emit("uploaded", result);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <input type="file" @change="handleFile" />
    <button @click="send" class="px-4 py-2 bg-blue-600 text-white rounded">
      {{ loading ? "Загрузка..." : "Отправить код" }}
    </button>
  </div>
</template>

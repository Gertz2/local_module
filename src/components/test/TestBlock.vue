<template>
  <div class="p-4 border rounded shadow-sm">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-gray-600">{{ description }}</p>
    <div class="mt-3">
      <router-link :to="`/test/${testId}`">
        <button class="px-4 py-2 bg-blue-600 text-white rounded">Начать тест</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  testId: { type: [String, Number], required: true },
  title: { type: String, default: 'Тест: Тема 1' },
  description: { type: String, default: 'Краткое описание теста' }
})
</script>


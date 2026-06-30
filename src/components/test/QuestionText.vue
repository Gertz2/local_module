<template>
  <div>
    <input v-model="local" class="w-full border p-2 rounded-lg" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({ question: Object, modelValue: String });
const emit = defineEmits(["update:modelValue"]);
const local = ref(props.modelValue ?? "");
watch(local, (v) => emit("update:modelValue", v));
watch(
  () => props.modelValue,
  (v) => (local.value = v ?? ""),
);
</script>

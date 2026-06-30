<template>
  <div>
    <div v-for="(opt, idx) in question.options" :key="idx" class="text-xl">
      <label>
        <input type="radio" :name="question.id" :value="idx" v-model="local" />
        {{ opt }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";
const props = defineProps({ question: Object, modelValue: null });
const emit = defineEmits(["update:modelValue"]);
const local = ref(props.modelValue ?? null);
watch(local, (v) => emit("update:modelValue", v));
watch(
  () => props.modelValue,
  (v) => (local.value = v),
);
</script>

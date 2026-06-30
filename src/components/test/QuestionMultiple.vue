<template>
  <div>
    <div v-for="(opt, idx) in question.options" :key="idx" class="text-xl">
      <label>
        <input
          type="checkbox"
          :value="idx"
          @change="toggle(idx)"
          :checked="(local || []).includes(idx)"
        />
        {{ opt }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({ question: Object, modelValue: Array });
const emit = defineEmits(["update:modelValue"]);
const local = ref(props.modelValue ? [...props.modelValue] : []);
function toggle(idx) {
  const idxPos = local.value.indexOf(idx);
  if (idxPos === -1) local.value.push(idx);
  else local.value.splice(idxPos, 1);
  emit("update:modelValue", [...local.value]);
}
watch(
  () => props.modelValue,
  (v) => (local.value = v ? [...v] : []),
);
</script>

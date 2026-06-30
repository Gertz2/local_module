<template>
  <div class="font-mono">{{ mm }}:{{ ss }}</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
const props = defineProps({ seconds: { type: Number, required: true } });
const emit = defineEmits(["time-up"]);

const remaining = ref(props.seconds);
let intervalId = null;

const mm = computed(() =>
  String(Math.floor(remaining.value / 60)).padStart(2, "0"),
);
const ss = computed(() => String(remaining.value % 60).padStart(2, "0"));

function startTimer() {
  if (intervalId) clearInterval(intervalId);
  remaining.value = props.seconds;
  intervalId = setInterval(() => {
    if (remaining.value <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      emit("time-up");
    } else {
      remaining.value--;
    }
  }, 1000);
}

onMounted(startTimer);
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

watch(
  () => props.seconds,
  (newVal) => {
    remaining.value = newVal;
  },
);
</script>

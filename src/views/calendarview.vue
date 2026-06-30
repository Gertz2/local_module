<script setup>
import { ref, onMounted } from "vue";
import { inject } from "vue";
import Calendar from "@/components/calendar.vue";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 900);
});

const calendarData = inject("calendarData");
</script>

<template>
  <CalendarSkeleton v-if="isLoading" />
  <Calendar v-else :data="calendarData" />
</template>

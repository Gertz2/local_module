<script setup>
import { ref, onMounted } from "vue";
import Request from "@/components/course_request_to_create.vue";
import RequestSkeleton from "@/components/skeletons/RequestSkeleton.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <RequestSkeleton v-if="isLoading" />
  <Request v-else />
</template>

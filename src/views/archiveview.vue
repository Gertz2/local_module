<script setup>
import { ref, onMounted } from "vue";
import Archive from "@/components/archive.vue";
import ArchiveSkeleton from "@/components/skeletons/ArchiveSkeleton.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 900);
});
</script>

<template>
  <ArchiveSkeleton v-if="isLoading" />
  <Archive v-else />
</template>

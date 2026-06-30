<script setup>
import Draweritem from "./draweritem.vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="mt-4 md:mt-10 flex flex-col gap-2 md:gap-0">
    <Draweritem v-for="item in items" :key="item.text" :item="item" />
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="item.link"
    class="flex gap-5 items-center mt-16 p-4 opacity-50 rounded-[1vw] hover:bg-gray-200 hover:opacity-100 transition cursor-pointer"
  >
    <img :src="item.icon" :alt="item.text" />
    <p class="text-gray-700">{{ item.text }}</p>
  </RouterLink>
</template>

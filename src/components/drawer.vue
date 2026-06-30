<script setup>
import { inject } from "vue";
import Draweritemlist from "./draweritemlist.vue";

const sidebarData = inject("sidebarData");
</script>

<template>
  <div class="bg-white w-auto h-full fixed left-0 top-0 p-6 rounded-r-xl z-20">
    <RouterLink to="/" class="flex items-center gap-5">
      <img :src="sidebarData.logo" alt="CSU" />
      <p class="text-3xl text-red-500 font-bold">{{ sidebarData.title }}</p>
    </RouterLink>

    <Draweritemlist :items="sidebarData.menuItems" />
  </div>
</template>

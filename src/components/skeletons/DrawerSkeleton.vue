<template>
  <div
    class="bg-white w-48 h-full fixed left-0 top-0 p-6 rounded-r-xl animate-pulse"
  >
    <div class="flex items-center gap-5 mb-10">
      <div class="w-10 h-10 bg-gray-300 rounded"></div>
      <div class="h-6 w-24 bg-gray-300 rounded"></div>
    </div>

    <div class="flex flex-col gap-8 mt-10">
      <div v-for="i in 4" :key="i" class="flex items-center gap-4">
        <div class="w-6 h-6 bg-gray-300 rounded"></div>
        <div class="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="relative flex flex-col w-full px-6 animate-pulse">
    <div class="h-6 w-48 bg-gray-300 rounded ml-49 mt-10 mb-6"></div>

    <div class="ml-55">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="relative mb-2 p-8 bg-white rounded-[1vw] shadow-2xl border border-gray-100"
        >
          <div
            class="absolute -top-5 left-6 h-6 w-32 bg-gray-300 rounded-2xl"
          ></div>

          <div class="h-4 w-24 bg-gray-300 rounded mt-2"></div>

          <div class="mt-10 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-full"></div>
            <div class="h-4 bg-gray-300 rounded w-5/6"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>

          <div class="mt-8 space-y-2">
            <div class="h-4 w-40 bg-gray-300 rounded"></div>
            <div class="h-4 w-28 bg-gray-300 rounded"></div>
            <div class="h-4 w-32 bg-gray-300 rounded ml-auto"></div>
          </div>

          <div class="mt-4 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
</template>

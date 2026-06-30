<template>
  <div class="grid auto-rows-auto grid-cols-3 gap-5 mt-20 pr-8 animate-pulse">
    <div
      class="sticky top-20 self-start row-start-1 row-span-3 flex flex-col items-center p-2 ml-20 border border-gray-100 rounded-[2vw] bg-white shadow-xl"
    >
      <div class="relative mt-6 w-40 h-40 mx-auto">
        <div class="w-full h-full rounded-full bg-gray-200"></div>
      </div>

      <div class="mt-4 h-8 w-48 rounded bg-gray-200"></div>
      <div class="mt-2 h-5 w-36 rounded bg-gray-200"></div>

      <div class="mt-10 flex flex-col items-center space-y-4 w-full">
        <div class="h-5 w-3/4 rounded bg-gray-200"></div>
        <div class="h-5 w-2/3 rounded bg-gray-200"></div>
        <div class="h-5 w-1/2 rounded bg-gray-200"></div>
      </div>

      <div class="mt-10 mb-10 h-10 w-36 rounded-lg bg-gray-200"></div>
    </div>

    <!-- stats card -->
    <div
      class="p-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl"
    >
      <div class="ml-2 mt-6 mb-3 h-8 w-80 rounded bg-gray-200"></div>

      <div class="flex flex-wrap justify-center gap-4 p-4">
        <div
          v-for="n in 3"
          :key="n"
          class="flex flex-col items-center p-4 ml-5 border border-gray-300 rounded-[1.5vw] shadow-md w-full sm:w-1/2 lg:w-1/4"
        >
          <div class="h-10 w-10 rounded-full bg-gray-200"></div>
          <div class="mt-4 h-10 w-14 rounded bg-gray-200"></div>
          <div class="mt-2 h-5 w-20 rounded bg-gray-200"></div>
          <div class="mt-2 h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>

    <!-- calendar card -->
    <div
      class="p-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <div class="h-8 w-56 rounded bg-gray-200"></div>
          <div class="flex gap-2">
            <div class="h-10 w-10 rounded bg-gray-200"></div>
            <div class="h-10 w-10 rounded bg-gray-200"></div>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center">
          <div v-for="n in 7" :key="n" class="h-5 rounded bg-gray-200"></div>
        </div>

        <div class="grid grid-cols-7 gap-2 mt-2">
          <div
            v-for="n in 35"
            :key="n"
            class="p-2 rounded-[1.5vw] h-10 bg-gray-200"
          ></div>
        </div>
      </div>
    </div>

    <!-- courses card -->
    <div
      class="p-2 row-span-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl"
    >
      <div class="ml-2 mt-6 mb-3 h-8 w-40 rounded bg-gray-200"></div>

      <div class="flex justify-between px-4">
        <div class="h-10 w-28 rounded-[1.5vw] bg-gray-200"></div>
        <div class="h-10 w-32 rounded-[1.5vw] bg-gray-200"></div>
      </div>

      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="n in 5"
          :key="n"
          class="flex items-center justify-between p-3 rounded-lg"
        >
          <div class="flex items-center gap-4 w-full">
            <div class="w-12 h-12 rounded-full bg-gray-200"></div>
            <div class="w-full">
              <div class="h-5 w-40 rounded bg-gray-200"></div>
              <div class="w-19/20 h-2 bg-gray-200 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- notifications card -->
    <div
      class="p-2 row-span-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl"
    >
      <div class="ml-2 mt-6 mb-3 h-8 w-48 rounded bg-gray-200"></div>

      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="n in 4"
          :key="n"
          class="flex items-center justify-between p-3 border-t border-gray-200"
        >
          <div class="flex items-center gap-4 w-full">
            <div
              class="flex p-2 border border-gray-400 rounded-[1vw] flex-col items-center"
            >
              <div class="h-5 w-8 rounded bg-gray-200"></div>
              <div class="mt-1 h-4 w-8 rounded bg-gray-200"></div>
            </div>

            <div class="flex-1">
              <div class="h-5 w-56 rounded bg-gray-200"></div>
              <div class="mt-2 h-4 w-24 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="relative flex flex-col w-full animate-pulse">
    <div class="flex justify-between w-2/3 m-auto mt-5 p-5 ml-50">
      <div class="h-10 w-40 rounded-lg bg-gray-200"></div>
    </div>

    <div class="flex items-center justify-center gap-10 pb-10 ml-50">
      <div class="p-5 w-full">
        <div class="flex items-center gap-5 pb-15">
          <div class="h-11 w-80 rounded-xl bg-gray-200"></div>
          <div class="h-11 w-80 rounded-xl bg-gray-200"></div>
          <div class="h-11 w-80 rounded-xl bg-gray-200"></div>
          <div class="h-11 w-64 rounded-xl bg-gray-200"></div>
        </div>

        <div class="height-300px">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="n in 6"
              :key="n"
              class="relative mb-2 p-6 bg-white rounded-[1vw] shadow-2xl border border-gray-100"
            >
              <div class="h-6 w-24 rounded-xl bg-gray-200 mb-6"></div>
              <div class="h-5 w-2/3 rounded bg-gray-200 mb-3"></div>
              <div class="h-5 w-1/2 rounded bg-gray-200 mb-3"></div>
              <div class="h-5 w-3/4 rounded bg-gray-200 mb-3"></div>
              <div class="h-5 w-2/5 rounded bg-gray-200"></div>
            </div>
          </div>

          <div class="text-center py-10 text-gray-500 invisible">
            Курсы не найдены. Попробуйте изменить параметры фильтрации.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed inset-0 pointer-events-none">
    <div class="hidden"></div>
  </div>
</template>

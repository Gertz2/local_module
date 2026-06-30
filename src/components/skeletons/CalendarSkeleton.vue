<template>
  <div class="p-10 ml-55 animate-pulse">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="h-6 w-64 bg-gray-200 rounded mb-6"></div>

      <div class="overflow-x-auto">
        <div class="min-w-full">
          <div class="grid grid-cols-6 gap-4 bg-gray-50 p-4 rounded-t-lg">
            <div v-for="n in 6" :key="n" class="h-4 bg-gray-200 rounded"></div>
          </div>

          <div class="space-y-3 mt-3">
            <div
              v-for="row in 6"
              :key="row"
              class="grid grid-cols-6 gap-4 p-4 border-b border-gray-100"
            >
              <div
                v-for="col in 6"
                :key="col"
                class="h-5 bg-gray-200 rounded"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

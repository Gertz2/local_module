<script setup>
import { inject, computed } from "vue";

const archivedCourses = inject("archivedCourses");
const restoreCourse = inject("restoreCourse");
const isEditingGlobal = inject("isEditingGlobal");
const hasArchivedCourses = computed(() => archivedCourses.value.length > 0);
</script>

<template>
  <div class="w-4/5 flex flex-col m-auto">
    <div class="">
      <div v-if="hasArchivedCourses">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <div
            v-for="course in archivedCourses"
            :key="course.course_id"
            class="relative mb-2 p-6 bg-white rounded-[1vw] shadow-2xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-3xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <h2
              class="absolute text-xl -top-5 left-6 px-3 py-2 border-1 border-black rounded-2xl bg-[url('./Rectangle.png')]"
            >
              {{ course.subject }}
            </h2>

            <span
              class="w-fit px-3 py-1 mb-5 mt-5 bg-gray-200 rounded-lg inline-block text-sm"
            >
              {{ course.type }}
            </span>

            <div class="text-md h-full">
              <p>{{ course.description }}</p>
            </div>

            <div class="mt-8 flex flex-col h-full">
              <p class="flex items-center">{{ course.teacher }}</p>
              <p class="items-right">{{ course.year }} уч.год</p>
              <p class="flex justify-end">
                {{ course.direction }} - {{ course.group_number }}
              </p>
            </div>

            <div class="mt-auto pt-6">
              <button
                @click="restoreCourse(course.course_id)"
                class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
              >
                Восстановить курс
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500">Архив пуст.</div>
    </div>
  </div>
</template>

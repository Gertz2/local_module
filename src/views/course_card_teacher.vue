<script setup>
import { ref, provide } from "vue";
import Header from "@/components/Header.vue";
import Course_card from "@/components/course_card.vue";
import Literature from "@/components/literature_card.vue";
import Exam_card from "@/components/new_card.vue";
import Practice_card from "@/components/practice_card.vue";
import Subject_card from "@/components/subject_card.vue";
import Drawer from "@/components/drawer.vue";
import Drawerminimised from "@/components/drawerminimised.vue";

const isDrawerOpen = ref(false);
const isEditingGlobal = ref(false);

const toggleGlobalEditing = () => {
  isEditingGlobal.value = !isEditingGlobal.value;
};

provide("isEditingGlobal", isEditingGlobal);
</script>

<style scoped></style>

<template>
  <div>
    <div @mouseenter="isDrawerOpen = true" @mouseleave="isDrawerOpen = false">
      <Drawer v-if="isDrawerOpen" />
      <Drawerminimised v-else />
    </div>
    <Header />
    <div>
      <div class="flex justify-between w-2/3 m-auto mt-5">
        <button
          @click="toggleGlobalEditing"
          class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition cursor-pointer hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          {{ isEditingGlobal ? "Завершить редактирование" : "Редактировать" }}
        </button>
        <div class="relative">
          <img class="absolute top-3 left-3" src="/search.png" alt="search" />
          <input
            type="text"
            placeholder="Поиск..."
            class="bg-white p-2 pl-10 pr-4 rounded-xl focus:border-gray-400"
          />
        </div>
      </div>

      <Course_card />
      <Literature />
      <Practice_card />
      <Subject_card />
      <Exam_card />
    </div>
  </div>
</template>

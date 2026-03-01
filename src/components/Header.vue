<script setup>
import { ref, computed } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useProfilePhoto } from "@/composables/useProfilePhoto";

const { profilePhoto } = useProfilePhoto();

const breadcrumb = ref(["Предмет", "Преподаватель", "Практика"]);
const breadcrumbPath = computed(() => breadcrumb.value.join(" / "));

const userName = ref("Иван Иванов");
const options = [
  "О пользователе",
  "Личные файлы / Оценки",
  "Сообщения",
  "Настройки",
  "Выход",
];

const baseOptions = computed(() => [userName.value, ...options]);

const selectedOption = ref(userName.value);
</script>

<template>
  <div class="border-b border-gray-500">
    <header class="flex justify-between w-2/3 m-auto mt-10">
      <div class="flex items-center">
        <p class="text-gray-500 hover:text-black">
          {{ breadcrumbPath }}
        </p>
      </div>
      <div class="flex items-center gap-10 pb-10">
        <v-select
          v-model="selectedOption"
          :options="options"
          class="my-custom-select w-60"
        />
        <img
          class="w-15 h-15 rounded-full border border-grey-300 object-cover"
          :src="profilePhoto"
          alt="userphoto"
        />
      </div>
    </header>
  </div>
</template>

<style scoped>
::v-deep(.my-custom-select .vs__dropdown-toggle) {
  border-radius: var(--radius-xl);
  border-color: var(--color-white);
  background-color: var(--color-white);
  padding: calc(var(--spacing) * 4);
  padding-left: calc(var(--spacing) * 5);
  height: 40px !important; /* Высота */
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
  font-size: 14px !important;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 500;
  text-wrap: pretty;
  text-align: justify;
  white-space: normal;
}

::v-deep(.my-custom-select .vs__clear) {
  display: none !important;
}

::v-deep(.vs--single.vs--open .vs__selected) {
  position: relative;
}

::v-deep(.my-custom-select .vs__search) {
  display: none !important;
}

::v-deep(.my-custom-select .vs__open-indicator) {
  display: none !important;
}

::v-deep(.my-custom-select .vs__dropdown-toggle::after) {
  content: "";
  position: absolute !important;
  top: calc(var(--spacing) * 3);
  left: calc(var(--spacing) * 2);
  top: 55% !important;
  transform: translateY(-50%);
  padding-left: calc(var(--spacing) * 4);
  width: 11px;
  height: 11px;
  background-size: contain;
  background: url("/Icon2.png") no-repeat center center !important;
  cursor: pointer;
}
</style>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useProfilePhoto } from "@/composables/useProfilePhoto";
import scheme from "@/mock-json";

const router = useRouter();
const route = useRoute();
const { profilePhoto } = useProfilePhoto();

const getCourseName = (id) => {
  const course = scheme.coursesBlock.courses.find(
    (c) => String(c.course_id) === String(id),
  );
  return course ? course.subject : "Курс";
};

const breadcrumbs = computed(() => {
  if (route.name === "courses") {
    return [{ label: "Мои курсы", to: "/" }];
  }

  if (route.name === "course") {
    return [
      { label: "Мои курсы", to: "/" },
      {
        label: getCourseName(route.params.id),
        to: `/course/${route.params.id}`,
      },
    ];
  }

  if (route.name === "Test") {
    return [
      { label: "Мои курсы", to: "/" },
      {
        label: getCourseName(route.params.id),
        to: `/course/${route.params.id}`,
      },
      { label: "Тест", to: `/test/${route.params.id}` },
    ];
  }

  if (route.name === "profile") {
    return [
      { label: "Мои курсы", to: "/" },
      { label: "Профиль", to: "/profile" },
    ];
  }

  if (route.name === "archive") {
    return [
      { label: "Мои курсы", to: "/" },
      { label: "Архив", to: "/archive" },
    ];
  }

  if (route.name === "calendar") {
    return [
      { label: "Мои курсы", to: "/" },
      { label: "Календарь", to: "/calendar" },
    ];
  }

  if (route.name === "request") {
    return [
      { label: "Мои курсы", to: "/" },
      { label: "Запрос на создание курса", to: "/request" },
    ];
  }

  return [{ label: "Мои курсы", to: "/" }];
});

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
const isSidebarOpen = ref(false);

const goToProfile = () => {
  router.push("/profile");
};
</script>

<template>
  <div class="border-b border-gray-500">
    <header
      class="flex justify-end mr-10 mt-10 sm:justify-between sm:w-4/5 md:w-4/5 lg:w-4/5 sm:m-auto md:m-auto lg:m-auto sm:mt-10 md:mt-10 lg:mt-10 pb-10"
    >
      <div class="hidden sm:block flex items-center gap-1">
        <template v-for="(item, index) in breadcrumbs" :key="item.to">
          <router-link :to="item.to" class="text-gray-500 hover:text-black">
            {{ item.label }}
          </router-link>

          <span v-if="index < breadcrumbs.length - 1" class="text-gray-500">
            /
          </span>
        </template>
      </div>

      <div class="flex items-center gap-10">
        <div class="text-right">
          <div class="font-semibold">
            {{ currentUser?.full_name || "Пользователь" }}
          </div>
          <div class="text-sm text-gray-600">
            {{ currentUser?.role === "student" ? "Студент" : "Преподаватель" }}
          </div>
        </div>
        <img
          class="w-15 h-15 rounded-full border border-grey-300 object-cover cursor-pointer"
          :src="profilePhoto"
          alt="userphoto"
          @click="goToProfile"
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
  height: 40px !important;
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

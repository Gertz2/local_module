<script setup>
import { ref, provide, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";

import mockData from "@/mock-json.js";

import Header from "@/components/Header.vue";
import Drawer from "@/components/drawer.vue";
import Drawerminimised from "@/components/drawerminimised.vue";
import HeaderSkeleton from "@/components/skeletons/HeaderSkeleton.vue";
import DrawerSkeleton from "@/components/skeletons/DrawerSkeleton.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 900);
});

const route = useRoute();
const router = useRouter();

const isDrawerOpen = ref(false);
const isEditingGlobal = ref(false);
const activeTab = ref("courses");
const archivedCourses = ref([]);

const coursesData = ref(mockData.coursesBlock);
const calendarData = ref(mockData.calendarBlock);

const tabToPath = {
  courses: "/",
  archive: "/archive",
  calendar: "/calendar",
  request: "/request",
};

const pathToTab = {
  "/": "courses",
  "/archive": "archive",
  "/calendar": "calendar",
  "/request": "request",
};

const addCourse = (newCourse) => {
  coursesData.value.courses.push({
    ...newCourse,
    course_id: Date.now().toString(),
  });
};

const changeTab = (tab) => {
  activeTab.value = tab;
  const path = tabToPath[tab] || "/";
  if (route.path !== path) router.push(path);
};

const loadArchivedCourses = () => {
  const saved = localStorage.getItem("archivedCourses");
  if (saved) archivedCourses.value = JSON.parse(saved);
};

const saveArchivedCourses = () => {
  localStorage.setItem(
    "archivedCourses",
    JSON.stringify(archivedCourses.value),
  );
};

const archiveCourse = (course) => {
  coursesData.value.courses = coursesData.value.courses.filter(
    (c) => c.course_id !== course.course_id,
  );

  archivedCourses.value.push({
    ...course,
    archivedAt: new Date().toISOString(),
  });

  saveArchivedCourses();
};

const restoreCourse = (courseId) => {
  const course = archivedCourses.value.find((c) => c.course_id === courseId);
  if (course) {
    coursesData.value.courses.push(course);
    archivedCourses.value = archivedCourses.value.filter(
      (c) => c.course_id !== courseId,
    );
    saveArchivedCourses();
  }
};

loadArchivedCourses();
watch(archivedCourses, saveArchivedCourses, { deep: true });

watch(
  () => route.path,
  (newPath) => {
    activeTab.value = pathToTab[newPath] || "courses";
  },
  { immediate: true },
);

provide("isEditingGlobal", isEditingGlobal);
provide("archiveCourse", archiveCourse);
provide("restoreCourse", restoreCourse);
provide("archivedCourses", archivedCourses);

provide("activeTab", activeTab);
provide("changeTab", changeTab);

provide("coursesData", coursesData);
provide("calendarData", calendarData);
provide("addCourse", addCourse);

provide("sidebarData", mockData.sidebar);
</script>

<template>
  <HeaderSkeleton v-if="isLoading" />
  <Header v-else />
  <DrawerSkeleton v-if="isLoading" />
  <div
    v-else
    @mouseenter="isDrawerOpen = true"
    @mouseleave="isDrawerOpen = false"
  >
    <Drawer v-if="isDrawerOpen" @tab-change="changeTab" />
    <Drawerminimised v-else @tab-change="changeTab" />
  </div>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { inject } from "vue";
import Courses from "@/components/courses.vue";

const coursesData = inject("coursesData");
const archiveCourse = inject("archiveCourse");
</script>

<template>
  <Courses :data="coursesData" @archive-course="archiveCourse" />
</template>

import { createRouter, createWebHistory } from "vue-router";

import CourseCardTeacher from "@/views/course_card_teacher.vue";
import profile from "@/views/profile.vue";

const routes = [
  { path: "/", name: "CourseCardTeacher", component: CourseCardTeacher },
  { path: "/profile", name: "profile", component: profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

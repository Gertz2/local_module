import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";

import CoursesView from "@/views/coursesview.vue";
import ArchiveView from "@/views/archiveview.vue";
import CalendarView from "@/views/calendarview.vue";
import RequestView from "@/views/requestview.vue";
import CoursePage from "@/views/CoursePage.vue";

import profile from "@/views/profile.vue";
import TestPage from "@/views/TestPage.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "courses", component: CoursesView },
      { path: "archive", name: "archive", component: ArchiveView },
      { path: "calendar", name: "calendar", component: CalendarView },
      { path: "request", name: "request", component: RequestView },
      {
        path: "course/:id",
        name: "course",
        component: CoursePage,
        props: true,
      },
      { path: "/profile", name: "profile", component: profile },
      {
        path: "/create-test",
        name: "CreateTest",
        component: () => import("@/views/CreateTestView.vue"),
      },
    ],
  },

  { path: "/test/:id", name: "Test", component: TestPage, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

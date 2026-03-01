<script setup>
import { ref, provide, computed, watch } from "vue";
import { useProfilePhoto } from "@/composables/useProfilePhoto";
import Header from "@/components/Header.vue";
import Drawer from "@/components/drawer.vue";
import Drawerminimised from "@/components/drawerminimised.vue";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";

const { profilePhoto, handlePhotoUpload, openFileDialog } = useProfilePhoto();

const FIO = ref("Иван Иванов Иванович");
const post = ref("Студент");
const contacts = ref([]);
const courses = ref([
  {
    name: "Курс 1",
    progress: 40,
    icon: "/course1.png",
    like: true,
  },
  {
    name: "Курс 2",
    progress: 20,
    icon: "/course2.png",
    like: false,
  },
  {
    name: "Курс 3",
    progress: 60,
    icon: "/course3.png",
    like: true,
  },
  {
    name: "Курс 4",
    progress: 100,
    icon: "/course4.png",
    like: true,
  },
  {
    name: "Курс 5",
    progress: 100,
    icon: "/course5.png",
    like: false,
  },
]);

contacts.value = [
  { type: "Telegram", value: "@ggeerrttzz", url: "https://t.me/ggeerrttzz" },
  {
    type: "Email",
    value: "exampl@mail.com",
    url: "mailto:example@mail.com",
  },
];

function iconSrc(type) {
  switch (type) {
    case "Telegram":
      return "./telegram.svg";
    case "Email":
      return "./mail.svg";
    case "Phone":
      return "./whatsapp.svg";
  }
}

const isDrawerOpen = ref(false);
const activeTab = ref("active");

const filteredCourses = computed(() =>
  activeTab.value === "active"
    ? courses.value.filter((course) => course.progress < 100)
    : courses.value.filter((course) => course.progress === 100)
);

const notifications = ref([
  {
    date: "29 Сент",
    title: "Практическая теория",
    type: "Лекция",
    typeColor: "text-amber-600",
  },
  {
    date: "29 Сент",
    title: "Практическая теория I",
    type: "Тест",
    typeColor: "text-green-500",
  },
  {
    date: "29 Сент",
    title: "Практическая теория II",
    type: "Контрольная",
    typeColor: "text-blue-500",
  },
  {
    date: "29 Сент",
    title: "Практическая теория III",
    type: "Домашнее задание",
    typeColor: "text-cyan-500",
  },
]);

const currentMonth = ref(new Date());
const selectedDates = ref(["2023-09-23", "2023-09-24", "2023-09-27"]);

const daysInMonth = computed(() => {
  const start = startOfMonth(currentMonth.value);
  const end = endOfMonth(currentMonth.value);
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    formatted: format(date, "yyyy-MM-dd"),
  }));
});

const isSelected = (date) => selectedDates.value.includes(date);

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1);
};

const prevMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1);
};

const hoveredDate = ref(null);
const rangeStart = ref(null);
const rangeEnd = ref(null);

const isInRange = (date) => {
  if (!rangeStart.value || !rangeEnd.value) return false;
  const currentDate = new Date(date);
  return (
    currentDate >= new Date(rangeStart.value) &&
    currentDate <= new Date(rangeEnd.value)
  );
};

const handleDateClick = (date) => {
  if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
    rangeStart.value = date;
    rangeEnd.value = null;
  } else if (!rangeEnd.value) {
    rangeEnd.value = date;
    if (new Date(rangeEnd.value) < new Date(rangeStart.value)) {
      [rangeStart.value, rangeEnd.value] = [rangeEnd.value, rangeStart.value];
    }
  }
};

const taskStatus = ref([
  {
    title: "Курсов",
    completed: 42,
    total: 73,
    progress: 59,
  },
  {
    title: "Заданий",
    completed: 8,
    total: 24,
    progress: 33,
  },
  {
    title: "Тестов",
    completed: 3,
    total: 5,
    progress: 60,
  },
]);

const isEditingProfile = ref(false);

function toggleEditProfile() {
  isEditingProfile.value = !isEditingProfile.value;
}

watch(
  contacts,
  (newContacts) => {
    newContacts.forEach((contact) => {
      if (contact.type === "Telegram") {
        contact.url = `https://t.me/${contact.value}`;
      } else if (contact.type === "Email") {
        contact.url = `mailto:${contact.value}`;
      } else if (contact.type === "Phone") {
        contact.url = `tel:${contact.value}`;
      }
    });
  },
  { deep: true }
);
</script>

<template>
  <Header />
  <div @mouseenter="isDrawerOpen = true" @mouseleave="isDrawerOpen = false">
    <Drawer v-if="isDrawerOpen" />
    <Drawerminimised v-else />
  </div>
  <div class="grid auto-rows-auto grid-cols-3 gap-5 mt-20 pr-8">
    <div
      class="sticky top-20 self-start row-start-1 row-span-3 flex flex-col items-center p-2 ml-20 border border-gray-100 rounded-[2vw] bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <div class="relative mt-6 w-40 h-40 mx-auto">
        <img
          class="w-full h-full rounded-full border border-grey-300 object-cover"
          :src="profilePhoto"
          alt="userphoto"
        />
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handlePhotoUpload"
        />
        <button
          class="absolute inset-0 flex items-center justify-center rounded-full bg-gray-400 bg-opacity-50 text-white opacity-0 hover:opacity-50 transition cursor-pointer"
          @click="openFileDialog"
        >
          Загрузить
        </button>
      </div>
      <p class="mt-4 text-2xl text-center">
        {{ FIO }}
      </p>
      <p class="mt-2 text-lg text-center">Должность: {{ post }}</p>
      <div
        v-if="isEditingProfile"
        class="mt-10 flex flex-col items-center space-y-4"
      >
        <div
          v-for="(contact, index) in contacts"
          :key="index"
          class="flex items-center space-x-3 w-3/4"
        >
          <input
            v-model="contact.value"
            placeholder="Контакт"
            class="border w-full border-gray-300 rounded-lg px-2 py-1 w-1/2"
          />
        </div>
        <button
          class="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600 transition"
          @click="toggleEditProfile"
        >
          Сохранить
        </button>
      </div>
      <ul
        v-else-if="contacts.length"
        class="mt-10 w-auto flex flex-col items-center space-y-4"
      >
        <li
          v-for="contact in contacts"
          :key="contact.type"
          class="items-center space-x-3"
        >
          <a
            :href="contact.url"
            target="_blank"
            class="flex"
            :aria-label="contact.type"
          >
            <img
              :src="iconSrc(contact.type)"
              :alt="contact.type + ' icon'"
              class="w-6 h-6"
            />
            <span
              class="text-md underline ml-2 whitespace-normal break-words transition hover:text-blue-400"
              >{{ contact.value }}</span
            >
          </a>
        </li>
      </ul>
      <button
        v-if="!isEditingProfile"
        class="mt-10 mb-10 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition"
        @click="toggleEditProfile"
      >
        Редактировать
      </button>
    </div>
    <div
      class="p-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <h2 class="ml-2 mt-6 mb-3 text-3xl font-bold">
        Статус выполненых заданий
      </h2>
      <div class="flex flex-wrap justify-center gap-4 p-4">
        <div
          v-for="(status, index) in taskStatus"
          :key="index"
          class="flex flex-col items-center p-4 ml-5 border border-gray-300 rounded-[1.5vw] shadow-md w-full sm:w-1/2 lg:w-1/4"
        >
          <div class="relative">
            <div
              class="absolute top-0 right-0 w-12 h-12 rounded-full border-4 border-transparent"
              :style="{
                borderColor: `conic-gradient(#4caf50 ${status.progress}%, #e0e0e0 ${status.progress}%)`,
              }"
            ></div>
          </div>
          <p class="text-4xl font-bold mt-4">{{ status.completed }}</p>
          <p class="text-lg">{{ status.title }}</p>
          <p class="text-sm text-gray-500 mt-2">
            из {{ status.total }} завершено
          </p>
        </div>
      </div>
    </div>
    <div
      class="p-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <p class="text-3xl font-bold capitalize">
            {{ format(currentMonth, "LLLL yyyy", { locale: ru }) }}
          </p>
          <div class="flex gap-2">
            <button
              @click="prevMonth"
              class="px-4 py-2 opacity-70 hover:opacity-100 transition cursor-pointer"
            >
              &lt;
            </button>
            <button
              @click="nextMonth"
              class="px-4 py-2 opacity-70 hover:opacity-100 transition cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-2 text-center text-gray-500 font-bold">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>
        <div class="grid grid-cols-7 gap-2 mt-2">
          <template v-for="day in daysInMonth" :key="day.formatted">
            <div
              :class="[
                'p-2 rounded-[1.5vw] text-center cursor-pointer transition',
                isSelected(day.formatted) ? 'bg-purple-500 text-white' : '',
                isInRange(day.formatted) ? 'bg-blue-200' : '',
                hoveredDate === day.formatted ? 'bg-gray-300' : 'text-gray-700',
              ]"
              @mouseenter="hoveredDate = day.formatted"
              @mouseleave="hoveredDate = null"
              @click="handleDateClick(day.formatted)"
            >
              {{ day.date.getDate() }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      class="p-2 row-span-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <h2 class="ml-2 mt-6 mb-3 text-3xl font-bold">Мои курсы</h2>
      <div class="flex justify-between px-4">
        <button
          :class="{
            'cursor-pointer text-gray-800 border border-gray-300 rounded-[1.5vw] shadow-md p-3 hover:bg-blue-400 transition ':
              activeTab === 'active',
            'cursor-pointer text-gray-800 border border-gray-300 rounded-[1.5vw] shadow-md p-3 hover:bg-blue-400 transition':
              activeTab !== 'active',
          }"
          @click="activeTab = 'active'"
        >
          Активные
        </button>
        <button
          :class="{
            'cursor-pointer text-gray-800 border border-gray-300 rounded-[1.5vw] shadow-md p-3 hover:bg-blue-400 transition':
              activeTab === 'completed',
            'cursor-pointer text-gray-800 border border-gray-300 rounded-[1.5vw] shadow-md p-3 hover:bg-blue-400 transition':
              activeTab !== 'completed',
          }"
          @click="activeTab = 'completed'"
          class="cursor-pointer text-gray-800 border border-gray-300 rounded-[1.5vw] shadow-md p-3 hover:bg-blue-400 transition"
        >
          Завершенные
        </button>
      </div>
      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="(course, index) in filteredCourses"
          :key="index"
          class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all"
        >
          <div class="flex items-center gap-4 w-full">
            <img
              src="/images.jpg"
              class="w-12 h-12 rounded-full"
              :alt="course.name"
            />
            <div class="w-full">
              <p class="text-lg font-medium">{{ course.name }}</p>
              <div class="w-19/20 h-2 bg-gray-200 rounded-full mt-2 relative">
                <div
                  class="h-full"
                  :class="{
                    'bg-blue-500': course.progress < 50,
                    'bg-orange-500':
                      course.progress >= 50 && course.progress < 100,
                    'bg-green-500': course.progress === 100,
                  }"
                  :style="{ width: course.progress + '%' }"
                ></div>
                <span
                  class="absolute -bottom-1 left-full ml-2 text-sm text-gray-600"
                >
                  {{ course.progress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="p-2 row-span-2 border border-gray-100 rounded-[2vw] m-auto w-49/50 h-full bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <h2 class="ml-2 mt-6 mb-3 text-3xl font-bold">Уведомления</h2>
      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          class="flex items-center justify-between p-3 border-t border-gray-200"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex p-2 border border-gray-400 rounded-[1vw] flex-col items-center"
            >
              <p class="text-lg font-bold">
                {{ notification.date.split(" ")[0] }}
              </p>
              <p class="text-sm text-gray-500">
                {{ notification.date.split(" ")[1] }}
              </p>
            </div>
            <div>
              <p class="text-lg font-medium">{{ notification.title }}</p>
              <p :class="['text-sm', notification.typeColor]">
                {{ notification.type }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

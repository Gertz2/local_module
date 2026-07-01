<script setup>
import { ref, computed, inject, provide, onMounted, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import scheme from "@/mock-json";
import NewCard from "@/components/new_card.vue";
import CoursePageSkeleton from "@/components/skeletons/CoursePageSkeleton.vue";

const route = useRoute();
const router = useRouter();

const isEditingGlobal = inject("isEditingGlobal", ref(false));
provide("isEditingGlobal", isEditingGlobal);

const isLoading = ref(true);

const isHiddenCourse = ref(false);
const isHiddenLiterature = ref(false);
const isHiddenExam = ref(false);

const isCollapsedCourse = ref(false);
const isCollapsedLiterature = ref(false);
const isCollapsedExam = ref(false);

const isEditingCourse = ref(false);
const isEditingLiterature = ref(false);
const isEditingExam = ref(false);

const course = computed(() => scheme.courseDetails.currentCourse);

const courseTitle = ref("");
const courseType = ref("");
const courseDescription = ref("");
const courseTeacher = ref("");
const courseDirection = ref("");
const courseGroup = ref("");
const courseYear = ref("");
const courseForm = ref("");

const literatureTitle = ref("ЛИТЕРАТУРА");
const literatureText = ref("");
const dateOpenText = ref("");

const examTopic = ref("ЭКЗАМЕН. ЗАЧЕТ");
const examDescription = ref("Балльно-рейтинговая система");

const uploadedLiteratureFiles = ref([]);

const syncFromCourse = () => {
  if (!course.value) return;

  courseTitle.value = course.value.subject || "Курс";
  courseType.value = course.value.type || "";
  courseDescription.value = course.value.description || "";
  courseTeacher.value = course.value.teacher || "";
  courseDirection.value = course.value.direction || "";
  courseGroup.value = course.value.group_number || "";
  courseYear.value = course.value.year || "";
  courseForm.value = course.value.form_of_study || "";

  literatureText.value =
    "Демидович, Б. П. Сборник задач и упражнений по математическому анализу : учебное пособие для вузов / Б. П. Демидович. — 23-е изд., стер. — Санкт-Петербург : Лань, 2021. — 624 с. — ISBN 978-5-8114-6940-6.";
  dateOpenText.value = "понедельник, 1 сентября 2025, 00:00";
};

watch(course, syncFromCourse, { immediate: true });

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 900);
});

const toggleGlobalEditing = () => {
  isEditingGlobal.value = !isEditingGlobal.value;

  if (!isEditingGlobal.value) {
    isEditingCourse.value = false;
    isEditingLiterature.value = false;
    isEditingExam.value = false;
  }
};

const startEditingCourse = () => {
  isEditingCourse.value = true;
};

const startEditingLiterature = () => {
  isEditingLiterature.value = true;
};

const startEditingExam = () => {
  isEditingExam.value = true;
};

const saveCourse = () => {
  isEditingCourse.value = false;
};

const saveLiterature = () => {
  isEditingLiterature.value = false;
};

const saveExam = () => {
  isEditingExam.value = false;
};

const cancelCourse = () => {
  syncFromCourse();
  isEditingCourse.value = false;
};

const cancelLiterature = () => {
  syncFromCourse();
  isEditingLiterature.value = false;
};

const cancelExam = () => {
  isEditingExam.value = false;
};

const toggleCourseHidden = () => {
  isHiddenCourse.value = !isHiddenCourse.value;
};

const toggleLiteratureHidden = () => {
  isHiddenLiterature.value = !isHiddenLiterature.value;
};

const toggleExamHidden = () => {
  isHiddenExam.value = !isHiddenExam.value;
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => {
    uploadedLiteratureFiles.value.push({
      file,
      url: URL.createObjectURL(file),
    });
  });
};

const removeFile = (index) => {
  uploadedLiteratureFiles.value.splice(index, 1);
};
</script>

<template>
  <CoursePageSkeleton v-if="isLoading" />

  <div v-else class="pb-10 relative flex flex-col grid grid-cols-1">
    <div
      class="flex flex-col sm:flex-row sm:justify-between gap-2 w-full px-4 md:w-4/5 md:px-0 mx-auto mt-5"
    >
      <button
        @click="toggleGlobalEditing"
        class="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer"
      >
        {{ isEditingGlobal ? "Завершить редактирование" : "Редактировать" }}
      </button>

      <button
        @click="router.back()"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer"
      >
        Назад
      </button>
    </div>

    <div
      v-if="!isHiddenCourse || isEditingGlobal"
      class="p-2 flex justify-between border border-gray-100 rounded-[2vw] w-full px-4 sm:w-4/5 md:w-4/5 md:px-0 mx-auto mt-20 bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <div class="relative flex flex-col w-full">
        <div class="relative flex space-x-2">
          <img
            v-if="isEditingGlobal && !isEditingCourse"
            src="/editing.png"
            @click="startEditingCourse"
            alt="Редактировать"
            class="absolute top-2 right-2 sm:top-1 sm:right-1 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Редактировать"
          />
          <img
            v-if="isEditingGlobal"
            src="/hide.png"
            @click="toggleCourseHidden"
            alt="Скрыть"
            class="absolute top-2 right-10 sm:top-1 sm:right-12 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Скрыть"
          />
        </div>

        <h2
          class="text-black-700 course-name md:course-title lg:course-title absolute -top-5 left-4 sm:left-6 px-3 py-1 border-1 border-black rounded-2xl bg-[url('/Rectangle.png')] max-w-[calc(100%-2rem)] break-words"
        >
          <template v-if="isEditingCourse">
            <input
              v-model="courseTitle"
              class="bg-transparent border-b border-gray-300 focus:outline-none w-full"
            />
          </template>
          <template v-else>
            {{ courseTitle }}
          </template>
        </h2>

        <div
          class="flex items-center cursor-pointer"
          @click="isCollapsedCourse = !isCollapsedCourse"
        >
          <img
            src="/Icon2.png"
            alt="toggle"
            class="ml-4 sm:ml-8 mt-4 sm:mt-6 mb-3"
          />
          <p class="course-title">ОБЩЕЕ</p>
        </div>

        <div v-if="!isCollapsedCourse">
          <template v-if="isEditingCourse">
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Тип:
              <input
                v-model="courseType"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <p class="my-2 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Описание:
              <input
                v-model="courseDescription"
                class="ml-2 border border-gray-300 rounded px-2 py-1 w-full sm:w-[70%]"
              />
            </p>

            <p class="my-2 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Преподаватель:
              <input
                v-model="courseTeacher"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <p class="my-2 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Направление:
              <input
                v-model="courseDirection"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <p class="my-2 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Группа:
              <input
                v-model="courseGroup"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <p class="my-0.1 ml-13 mb-6 mr-11 text-2xl">
              Год:
              <input
                v-model="courseYear"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <p class="my-0.1 ml-13 mb-6 mr-11 text-2xl">
              Форма обучения:
              <input
                v-model="courseForm"
                class="ml-2 border border-gray-300 rounded px-2 py-1"
              />
            </p>

            <div
              class="flex flex-col sm:flex-row justify-end gap-2 mx-4 sm:mr-11 mb-4"
            >
              <button
                @click="saveCourse"
                class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Сохранить
              </button>
              <button
                @click="cancelCourse"
                class="w-full sm:w-auto px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </template>

          <template v-else>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              {{ courseType }} для направления:
              <span class="italic"
                >{{ courseDirection }} - {{ courseGroup }}</span
              >
            </p>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Преподаватель:
              <span class="italic">{{ course.teacher.name }}</span>
            </p>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Должность:
              <span class="italic">{{ course.teacher.position }}</span>
            </p>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Кафедра:
              <span class="italic">{{ course.teacher.department }}</span>
            </p>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              e-mail: <span class="italic">{{ course.teacher.email }}</span>
            </p>
          </template>
        </div>
      </div>
    </div>

    <div
      v-if="!isHiddenLiterature || isEditingGlobal"
      class="p-2 flex justify-between border border-gray-100 rounded-[2vw] w-full px-4 md:w-4/5 md:px-0 mx-auto mt-20 bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <div class="relative flex flex-col w-full">
        <div class="space-x-2">
          <img
            v-if="isEditingGlobal && !isEditingLiterature"
            src="/editing.png"
            @click="startEditingLiterature"
            alt="Редактировать"
            class="absolute top-1 right-1 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Редактировать"
          />
          <img
            v-if="isEditingGlobal"
            src="/hide.png"
            @click="toggleLiteratureHidden"
            alt="Скрыть"
            class="absolute top-1 right-12 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Скрыть"
          />
        </div>

        <div
          class="flex items-center cursor-pointer"
          @click="isCollapsedLiterature = !isCollapsedLiterature"
        >
          <img src="/Icon2.png" alt="toggle" class="ml-8 mt-6 mb-3" />
          <p class="course-title">{{ literatureTitle }}</p>
        </div>

        <div v-if="!isCollapsedLiterature" class="flex flex-col">
          <template v-if="isEditingLiterature">
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Открыто:
              <input
                v-model="dateOpenText"
                class="ml-2 border border-gray-300 rounded px-2 py-1 w-full sm:w-[60%]"
              />
            </p>

            <textarea
              v-model="literatureText"
              class="mx-4 sm:mx-11 mb-6 p-2 border border-gray-300 rounded-lg h-28 w-[calc(100%-2rem)] sm:w-auto"
            ></textarea>

            <div class="mt-4 mx-11">
              <label
                class="px-4 py-2 text-grey rounded-lg shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer inline-block"
              >
                Прикрепить файлы
                <input
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileUpload"
                />
              </label>
            </div>

            <div class="flex justify-end gap-2 mx-11 my-4">
              <button
                @click="saveLiterature"
                class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Сохранить
              </button>
              <button
                @click="cancelLiterature"
                class="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Отмена
              </button>
            </div>
          </template>

          <template v-else>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              Открыто: <span class="italic">{{ dateOpenText }}</span>
            </p>
            <p class="my-4 mx-4 sm:mx-11 text-lg sm:text-2xl break-words">
              <span>{{ literatureText }}</span>
            </p>

            <div
              v-if="uploadedLiteratureFiles.length"
              class="mt-4 mx-4 sm:mx-11 flex flex-col gap-2"
            >
              <template
                v-for="(file, index) in uploadedLiteratureFiles"
                :key="index"
              >
                <a :href="file.url" :download="file.file.name">
                  <img
                    v-if="file.file.type.startsWith('image/')"
                    :src="file.url"
                    class="cursor-pointer rounded-[1.5vw] mb-10 max-w-full h-auto"
                    alt="Превью"
                  />
                  <div
                    v-else
                    class="flex items-center mt-5 mb-10 underline cursor-pointer text-lg sm:text-2xl rounded-[1.5vw] shadow-xl hover:-translate-y-1 hover:-translate-x-1"
                  >
                    <img
                      src="/Icon.png"
                      alt="file"
                      class="my-0.1 py-5 px-5 ml-2 mr-5"
                    />
                    {{ file.file.name }}
                  </div>
                </a>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col border border-gray-100 rounded-[2vw] w-full px-4 md:w-4/5 md:px-0 mx-auto mt-20 mb-10 bg-white shadow-xl hover:-translate-y-2 hover:-translate-x-2 hover:shadow-xl transition relative"
    >
      <div class="flex flex-col w-full">
        <div
          class="flex items-center cursor-pointer"
          @click="toggleSubjectCollapse"
        >
          <img src="/Icon2.png" alt="toggle" class="ml-8 mt-6 mb-3" />
          <p class="course-title">Тема 1</p>
        </div>

        <div v-if="!isCollapsedSubject" class="flex flex-col gap-4">
          <div
            class="flex flex-col rounded-[1.5vw] mx-3 sm:mx-5 my-3 sm:m-5 shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition"
          >
            <div class="flex items-center">
              <img src="/Icon.png" alt="icon" class="my-0.1 ml-11 mr-5 mb-6" />
              <p
                class="my-0.1 mx-4 sm:mr-11 mb-4 sm:mb-6 text-lg sm:text-2xl break-words"
              >
                Таблица разложений некоторых функций в степенные ряды
              </p>
            </div>
            <div>
              <p class="my-4 ml-11 mr-11 text-2xl">Домашнее задание №1</p>
              <p class="my-0.1 ml-11 mr-11 text-2xl">
                Открыто:
                <span class="italic">понедельник, 1 сентября 2025, 00:00</span>
              </p>
              <p class="my-0.1 ml-11 mr-11 mb-6 text-2xl">
                Закроется в:
                <span class="italic">суббота, 7 сентября 2025, 00:00</span>
              </p>
            </div>
          </div>

          <RouterLink :to="`/test/${1}`" class="no-underline">
            <div
              class="flex flex-col rounded-[1.5vw] mx-3 sm:mx-5 my-3 sm:m-5 shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition cursor-pointer"
              role="button"
              aria-label="Перейти к тесту"
            >
              <div class="flex items-center p-6">
                <div class="flex-1">
                  <p
                    class="my-0.1 mx-4 sm:mr-11 mb-2 text-lg sm:text-2xl font-semibold break-words"
                  >
                    Тест: Проверка знаний по теме
                  </p>
                  <p
                    class="my-0.1 mx-4 sm:mr-11 mb-2 text-lg sm:text-2xl font-semibold break-words text-gray-600"
                  >
                    Время: 10 минут
                  </p>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      v-if="!isHiddenExam || isEditingGlobal"
      class="p-2 flex flex-col border border-gray-100 rounded-[2vw] w-full px-4 md:w-4/5 md:px-0 mx-auto mt-20 bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
    >
      <div class="relative flex flex-col w-full">
        <div class="space-x-2">
          <img
            v-if="isEditingGlobal && !isEditingExam"
            src="/editing.png"
            @click="startEditingExam"
            alt="Редактировать"
            class="absolute top-1 right-1 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Редактировать"
          />
          <img
            v-if="isEditingGlobal"
            src="/hide.png"
            @click="toggleExamHidden"
            alt="Скрыть"
            class="absolute top-1 right-12 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
            title="Скрыть"
          />
        </div>

        <div
          class="flex items-center cursor-pointer"
          @click="isCollapsedExam = !isCollapsedExam"
        >
          <img src="/Icon2.png" alt="toggle" class="ml-8 mt-6 mb-3" />
          <p class="course-title">{{ examTopic }}</p>
        </div>

        <div v-if="!isCollapsedExam" class="flex flex-col">
          <template v-if="isEditingExam">
            <textarea
              v-model="examDescription"
              class="mx-4 sm:mx-11 mb-6 p-2 border border-gray-300 rounded-lg h-28 w-[calc(100%-2rem)] sm:w-auto"
            ></textarea>

            <div class="flex justify-end gap-2 mx-11 my-4">
              <button
                @click="saveExam"
                class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
              >
                Сохранить
              </button>
              <button
                @click="cancelExam"
                class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </template>

          <template v-else>
            <p
              class="my-2 mx-4 sm:mx-11 mb-4 sm:mb-6 text-lg sm:text-2xl break-words"
            >
              {{ examDescription }}
            </p>
          </template>
        </div>
      </div>
    </div>

    <NewCard />
  </div>
</template>

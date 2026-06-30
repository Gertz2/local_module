<script setup>
import { ref, watch, computed, onMounted } from "vue";
import CoursesPageSkeleton from "@/components/skeletons/CoursesPageSkeleton.vue";
import { inject } from "vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 900);
});

const emit = defineEmits(["archive-course"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      courses: [],
      filters: {
        year: [],
        direction: [],
        form_of_study: [],
        type: [],
      },
    }),
  },
});

const selectedYear = ref("Выберите год");
const selectedDirection = ref("Выберите направление");
const selectedFormOfStudy = ref("Выберите форму обучения");

const searchQuery = ref("");

const isEditingGlobal = inject("isEditingGlobal");

const editingCourse = ref(null);

const editedCourse = ref({});

const showModal = ref(false);

const courseToDelete = ref(null);

const courseToArchive = ref(null);

const archiveCourse = inject("archiveCourse");
const restoreCourse = inject("restoreCourse");

const activeTab = ref("courses");

const changeTab = inject("changeTab");

const switchTab = (tab) => {
  console.log("Переключаем на вкладку:", tab);
  activeTab.value = tab;
};

const filteredCourses = ref(props.data.courses);

const addCourse = () => {
  const newCourse = {
    course_id: Date.now().toString(),
    subject: "",
    course_type: "",
    course_description: "",
    teacher_name: "",
    year: "",
    direction: "",
    group_number: "",
    form_of_study: "",
    isNew: true,
  };

  props.data.courses.push(newCourse);

  editingCourse.value = newCourse.course_id;

  editedCourse.value = { ...newCourse };

  applyFilters();
};

const applyFilters = () => {
  if (activeTab.value === "courses") {
    filteredCourses.value = props.data.courses.filter((course) => {
      const matchesYear =
        selectedYear.value === "Выберите год" ||
        selectedYear.value === "Все года" ||
        course.year === selectedYear.value;

      const matchesDirection =
        selectedDirection.value === "Выберите направление" ||
        selectedDirection.value === "Все направления" ||
        course.direction.includes(selectedDirection.value);

      const matchesFormOfStudy =
        selectedFormOfStudy.value === "Выберите форму обучения" ||
        selectedFormOfStudy.value === "Все формы обучения" ||
        course.form_of_study.includes(selectedFormOfStudy.value);

      const matchesSearch =
        course.subject
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        course.teacher_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());

      return (
        matchesYear && matchesDirection && matchesFormOfStudy && matchesSearch
      );
    });
  }
};

const toggleGlobalEditing = () => {
  isEditingGlobal.value = !isEditingGlobal.value;

  if (!isEditingGlobal.value) {
    editingCourse.value = null;
  }
};

const startEditing = (course) => {
  if (isEditingGlobal.value) {
    editingCourse.value = course.course_id;

    editedCourse.value = { ...course };
  }
};

const saveEditing = (courseId) => {
  const index = props.data.courses.findIndex((c) => c.course_id === courseId);
  if (index !== -1) {
    props.data.courses[index] = { ...editedCourse.value };
  }

  editingCourse.value = null;

  applyFilters();
};

const cancelEditing = () => {
  editingCourse.value = null;
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

const confirmArchiveCourse = (course) => {
  courseToArchive.value = course;
  showModal.value = true;
};

const handleArchive = () => {
  if (courseToArchive.value) {
    const index = props.data.courses.findIndex(
      (c) => c.course_id === courseToArchive.value.course_id,
    );
    if (index !== -1) {
      props.data.courses.splice(index, 1);
    }

    emit("archive-course", courseToArchive.value);

    showModal.value = false;

    courseToArchive.value = null;

    applyFilters();
  }
};

const deleteCourse = () => {
  if (courseToDelete.value !== null) {
    const index = props.data.courses.findIndex(
      (c) => c.course_id === courseToDelete.value,
    );
    if (index !== -1) {
      props.data.courses.splice(index, 1);

      applyFilters();
    }
  }

  showModal.value = false;

  courseToDelete.value = null;
};

const confirmDeleteCourse = (courseId) => {
  courseToDelete.value = courseId;
  showModal.value = true;
};

watch(
  [selectedYear, selectedDirection, selectedFormOfStudy, searchQuery],
  applyFilters,
  { immediate: true },
);
</script>

<template>
  <CoursesPageSkeleton v-if="isLoading" />
  <div v-else class="relative flex flex-col">
    <div
      class="flex justify-between w-full px-4 md:w-4/5 md:px-0 mx-auto mt-10"
    >
      <button
        @click="toggleGlobalEditing"
        class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition cursor-pointer"
      >
        {{ isEditingGlobal ? "Завершить редактирование" : "Редактировать" }}
      </button>
    </div>
    <div class="justify-between w-4/5 m-auto mt-10">
      <div v-if="activeTab === 'courses'">
        <div
          class="flex items-center grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 pb-15"
        >
          <select
            v-model="selectedYear"
            class="border border-gray-300 rounded-xl p-2 bg-white"
          >
            <option disabled value="Выберите год">Выберите год</option>
            <option
              v-for="year in props.data.filters.year"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>

          <select
            v-model="selectedDirection"
            class="border border-gray-300 rounded-xl p-2 bg-white"
          >
            <option disabled value="Выберите направление">
              Выберите направление
            </option>
            <option
              v-for="direction in props.data.filters.direction"
              :key="direction"
              :value="direction"
            >
              {{ direction }}
            </option>
          </select>

          <select
            v-model="selectedFormOfStudy"
            class="border border-gray-300 rounded-xl p-2 bg-white"
          >
            <option disabled value="Выберите форму обучения">
              Выберите форму обучения
            </option>
            <option
              v-for="form in props.data.filters.form_of_study"
              :key="form"
              :value="form"
            >
              {{ form }}
            </option>
          </select>

          <div class="border border-gray-300 rounded-xl bg-white">
            <div class="relative">
              <img class="absolute top-3 left-3" src="/search.png" alt="" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск..."
                class="bg-white p-2 pl-10 pr-4 rounded-xl focus:border-gray-500 w-full"
              />
            </div>
          </div>
        </div>

        <div class="height-300px">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <router-link
              v-for="course in filteredCourses"
              :key="course.course_id"
              :to="`/course/${course.course_id}`"
            >
              <div
                class="relative h-full mb-2 p-6 bg-white rounded-[1vw] shadow-2xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-3xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div
                  v-if="isEditingGlobal && editingCourse !== course.course_id"
                  class="absolute top-4 right-4 flex space-x-2"
                >
                  <img
                    src="/editing.png"
                    @click.stop.prevent="startEditing(course)"
                    alt="edit_course"
                    class="cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
                    title="Редактировать курс"
                  />
                  <img
                    src="/archive.png"
                    @click.stop.prevent="confirmArchiveCourse(course)"
                    alt="archive_course"
                    class="cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
                    title="Архивировать курс"
                  />
                  <img
                    src="/delete.png"
                    @click.stop.prevent="confirmDeleteCourse(course.course_id)"
                    alt="delete_course"
                    class="cursor-pointer w-6 h-6 opacity-60 hover:opacity-100 transition"
                    title="Удалить курс"
                  />
                </div>

                <h2
                  class="text-black-700 text-md md:course-name lg:course-name absolute -top-6 left-6 px-3 py-1 border-1 border-black rounded-2xl bg-[url('/Rectangle.png')]"
                >
                  <template v-if="editingCourse === course.course_id">
                    <input
                      v-model="editedCourse.subject"
                      class="bg-transparent border-b border-gray-300 focus:outline-none"
                    />
                  </template>
                  <template v-else>
                    {{ course.subject }}
                  </template>
                </h2>

                <div class="mt-1 mb-3">
                  <template v-if="editingCourse === course.course_id">
                    <select
                      v-model="editedCourse.course_type"
                      class="border border-gray-300 rounded-xl p-2 bg-white w-full md:w-80 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    >
                      <option value="Лекционный курс">Лекционный курс</option>
                      <option value="Практический курс">
                        Практический курс
                      </option>
                      <option value="Лабораторные занятия">
                        Лабораторные занятия
                      </option>
                      <option value="Семинар">Семинар</option>
                    </select>
                  </template>
                  <template v-else>
                    <span
                      class="px-3 py-1 bg-gray-200 rounded-lg inline-block text-sm"
                    >
                      {{ course.type }}
                    </span>
                  </template>
                </div>

                <div class="mt-8">
                  <template v-if="editingCourse === course.course_id">
                    <div class="space-y-4">
                      <input
                        v-model="editedCourse.subject"
                        placeholder="Название курса"
                        class="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        v-model="editedCourse.description"
                        placeholder="Описание курса"
                        class="w-full p-2 border border-gray-300 rounded-lg h-20"
                      >
                      </textarea>
                      <input
                        v-model="editedCourse.teacher"
                        placeholder="Преподаватель"
                        class="p-2 border border-gray-300 rounded-lg w-full"
                      />
                      <select
                        v-model="editedCourse.form_of_study"
                        class="border border-gray-300 rounded-xl p-2 bg-white w-full md:w-90 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      >
                        <option disabled value="">
                          Выберите форму обучения
                        </option>
                        <option value="Очная">Очная</option>
                        <option value="Заочная">Заочная</option>
                      </select>
                      <div class="grid grid-cols-2 gap-4">
                        <select
                          v-model="editedCourse.direction"
                          class="border border-gray-300 rounded-xl p-2 bg-white w-full md:w-45 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        >
                          <option disabled value="">
                            Выберите направление
                          </option>
                          <option value="МТ">МТ</option>
                          <option value="МП">МП</option>
                          <option value="МК">МК</option>
                          <option value="МН">МН</option>
                        </select>
                        <input
                          v-model="editedCourse.group_number"
                          placeholder="Номер группы"
                          class="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <input
                        v-model="editedCourse.year"
                        placeholder="Год"
                        class="p-2 border border-gray-300 rounded-lg"
                      />
                      <div class="flex justify-end space-x-2">
                        <button
                          @click="saveEditing(course.course_id)"
                          class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
                        >
                          Сохранить
                        </button>
                        <button
                          @click="cancelEditing"
                          class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <p class="text-md h-full">{{ course.description }}</p>
                  </template>
                </div>

                <div class="mt-8 flex flex-col h-full">
                  <template v-if="editingCourse !== course.course_id">
                    <p class="flex items-center">{{ course.teacher }}</p>
                    <p class="items-right">{{ course.year }} уч.год</p>
                    <div class="mt-auto flex justify-end">
                      <p class="text-right">
                        {{ course.direction }} - {{ course.group_number }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </router-link>
          </div>

          <div
            v-if="filteredCourses.length === 0"
            class="text-center py-10 text-gray-500"
          >
            Курсы не найдены. Попробуйте изменить параметры фильтрации.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showModal && courseToArchive"
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-[1vw] max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">Архивировать курс?</h3>
      <p class="text-gray-500 mb-6">
        Курс "{{ courseToArchive.subject }}" будет перемещен в архив.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleArchive"
          class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
        >
          Архивировать
        </button>
        <button
          @click="showModal = false"
          class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showModal && courseToDelete"
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-[1vw] max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">Удалить курс?</h3>
      <p class="text-gray-600 mb-6">
        Вы уверены, что хотите удалить этот курс? Это действие нельзя отменить.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="deleteCourse"
          class="px-4 py-2 bg-red-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-red-800 border-transparent border-2 transition cursor-pointer"
        >
          Удалить
        </button>
        <button
          @click="showModal = false"
          class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

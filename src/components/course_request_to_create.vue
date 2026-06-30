<script setup>
import { ref, inject } from "vue";

// Получаем необходимые глобальные состояния и функции через inject из родительского компонента
const isEditingGlobal = inject("isEditingGlobal"); // Флаг режима редактирования
const activeTab = inject("activeTab"); // Текущая активная вкладка
const changeTab = inject("changeTab"); // Функция для смены вкладки
const coursesData = inject("coursesData"); // Данные о курсах
const addCourse = inject("addCourse"); // Функция для добавления нового курса

const selectedYear = ref("Выберите год");
const selectedDirection = ref("Выберите направление");
const selectedFormOfStudy = ref("Выберите форму обучения");
const selectedCourseType = ref("Выберите тип курса");

// Реактивная переменная для хранения данных нового курса
const newCourse = ref({
  subject: "", // Название курса
  course_description: "", // Описание курса
  teacher_name: "", // Имя преподавателя
  year: "", // Учебный год
  form_of_study: "", // Форма обучения
  course_type: "", // Тип курса
  direction: "",
  group_number: "",
});

// Функция для обработки добавления нового курса
const handleAddCourse = () => {
  // Проверяем, что название курса заполнено
  if (!newCourse.value.subject.trim()) {
    alert("Название курса обязательно для заполнения");
    return;
  }

  // Создаем объект курса для добавления
  const courseToAdd = {
    ...newCourse.value, // Копируем все поля из newCourse
    course_id: Date.now().toString(), // Генерируем уникальный ID
    isNew: true, // Помечаем как новый курс
  };

  // Вызываем функцию добавления курса
  addCourse(courseToAdd);

  // Сбрасываем форму после добавления
  newCourse.value = {
    subject: "",
    course_description: "",
    course_type: "",
    teacher_name: "",
    year: "",
    form_of_study: "",
    direction: "",
    group_number: "",
  };
};
</script>

<template>
  <div v-if="activeTab === 'request'" class="request-tab">
    <div class="w-full pt-10">
      <div class="bg-white rounded-[1vw] shadow-md p-6 mb-8 w-4/5 mx-auto">
        <h2 class="text-xl font-bold mb-4">Добавить новый курс</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Название курса</label>
              <input
                v-model="newCourse.subject"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Введите нзвание курса"
                required
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">ФИО Преподавателя</label>
              <input
                v-model="newCourse.teacher_name"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Введите ФИО Преподавателя (Иванов А. А.)"
                required
              />
            </div>
          </div>

          <!-- Блок для описания курса -->
          <div>
            <label class="block text-gray-700 mb-1">Описание курса</label>
            <textarea
              v-model="newCourse.course_description"
              class="w-full p-2 border border-gray-300 rounded-lg h-20"
              placeholder="Введите описание курса"
            >
            </textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Год</label>
              <select
                v-model="newCourse.year"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option
                  v-for="year in coursesData.filters.year.slice(1)"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 mb-1">Форма обучения</label>
              <select
                v-model="selectedDirection"
                class="border border-gray-300 rounded-xl p-2 bg-white w-70"
              >
                <option
                  v-for="form in coursesData.filters.form_of_study.slice(1)"
                  :key="form"
                  :value="form"
                >
                  {{ form }}
                </option>
              </select>
            </div>

            <!-- Выбор типа курса -->
            <div>
              <label class="block text-gray-700 mb-1">Тип курса</label>
              <select
                v-model="newCourse.course_type"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Лекционный курс">Лекционный курс</option>
                <option value="Практический курс">Практический курс</option>
                <option value="Лабораторные занятия">
                  Лабораторные занятия
                </option>
                <option value="Семинар">Семинар</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Направление</label>
              <select
                v-model="newCourse.direction"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="МТ">МТ</option>
                <option value="МП">МП</option>
                <option value="МК">МК</option>
                <option value="МН">МН</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">Номер группы</label>
              <input
                v-model="newCourse.group_number"
                type="number"
                class="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Введите номер группы"
                required
              />
            </div>
          </div>

          <!-- Кнопка для отправки формы -->
          <button
            @click="handleAddCourse"
            class="px-4 py-2 bg-blue-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-blue-600 border-transparent border-2 transition cursor-pointer"
          >
            Добавить курс
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

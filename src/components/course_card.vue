<script setup>
import { ref, watch, inject } from "vue";

const isCollapsed = ref(false);
const isEditing = ref(false);
const errorMessage = ref("");
const isEditingGlobal = inject("isEditingGlobal");

const props = defineProps({
  title: {
    type: String,
    default: "Математический анализ",
  },
  topic: {
    type: String,
    default: "ОБЩЕЕ",
  },
  groupename: {
    type: String,
    default: "Лекции для направления МП-2",
  },
  teacher: {
    type: String,
    default: "Плеханова Марина Васильевна",
  },
  position: {
    type: String,
    default: "Доктор физико-математических наук профессор",
  },
  department: {
    type: String,
    default: "Математический анализ",
  },
  email: {
    type: String,
    default: "asdsadsa@asd.com",
  },
  container: Object,
  startEditing: Function,
  confirmDeleteContainer: Function,
});

const titleText = ref(props.title);
const topicText = ref(props.topic);
const groupenameText = ref(props.groupename);
const teacherText = ref(props.teacher);
const positionText = ref(props.position);
const departmentText = ref(props.department);
const emailText = ref(props.email);

watch(props, () => {
  titleText.value = props.title;
  topicText.value = props.topic;
  groupenameText.value = props.groupename;
  teacherText.value = props.teacher;
  positionText.value = props.position;
  departmentText.value = props.department;
  emailText.value = props.email;
});

const toggleCollapse = () => {
  if (!isEditing.value) {
    isCollapsed.value = !isCollapsed.value;
  }
};

const startEditing = () => {
  isEditing.value = true;
  errorMessage.value = "";
};

const saveChanges = () => {
  if (
    !titleText.value.trim() ||
    !topicText.value.trim() ||
    !groupenameText.value.trim() ||
    !teacherText.value.trim() ||
    !positionText.value.trim() ||
    !departmentText.value.trim() ||
    !emailText.value.trim()
  ) {
    errorMessage.value = "Все поля должны быть заполнены!";
    return;
  }
  isEditing.value = false;
  errorMessage.value = "";
};

const cancelEditing = () => {
  titleText.value = props.title;
  topicText.value = props.topic;
  groupenameText.value = props.groupename;
  teacherText.value = props.teacher;
  positionText.value = props.position;
  departmentText.value = props.department;
  emailText.value = props.email;
  isEditing.value = false;
  errorMessage.value = "";
};
</script>

<template>
  <div
    class="p-2 flex justify-between border border-gray-100 rounded-[2vw] m-auto w-2/3 mt-20 bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition"
  >
    <div class="relative flex flex-col w-full">
      <div class="relative flex space-x-2">
        <img
          src="/editing.png"
          v-if="!isEditing && isEditingGlobal"
          @click="startEditing"
          alt="edit_topic"
          class="absolute top-1 right-1 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
          title="Редактировать"
        />
        <img
          src="/hide.png"
          v-if="!isEditing && isEditingGlobal"
          alt="hide_topic"
          class="absolute top-1 right-12 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
          title="Скрыть"
        />
      </div>

      <h2
        class="text-black-700 text-3xl absolute px-2 translate-x-6 -translate-y-6 border border-black rounded-xl bg-[url(./Rectangle.png)]"
      >
        <template v-if="isEditing && isEditingGlobal">
          <input
            v-model="titleText"
            class="w-full bg-white border border-gray-300 rounded-lg px-2 py-1"
          />
        </template>
        <template v-else>{{ titleText }}</template>
      </h2>

      <div class="flex items-center cursor-pointer" @click="toggleCollapse">
        <img
          v-if="!isEditing || !isEditingGlobal"
          src="/Icon2.png"
          alt="toggle"
          class="ml-8 mt-6 mb-3"
        />
        <template v-if="isEditing && isEditingGlobal"> </template>
        <template v-else>
          <p class="ml-2 mt-6 mb-3 text-3xl font-bold">{{ topicText }}</p>
        </template>
      </div>

      <div v-if="!isCollapsed">
        <template v-if="isEditing && isEditingGlobal">
          <input
            v-model="groupenameText"
            placeholder="Введите группу"
            class="border border-gray-300 rounded-lg mt-10 px-2 py-1 my-4 w-full"
          />
          <input
            v-model="teacherText"
            placeholder="Введите преподавателя"
            class="border border-gray-300 rounded-lg px-2 py-1 my-4 w-full"
          />
          <input
            v-model="positionText"
            placeholder="Введите должность"
            class="border border-gray-300 rounded-lg px-2 py-1 my-4 w-full"
          />
          <input
            v-model="departmentText"
            placeholder="Введите кафедру"
            class="border border-gray-300 rounded-lg px-2 py-1 my-4 w-full"
          />
          <input
            v-model="emailText"
            placeholder="Введите email"
            class="border border-gray-300 rounded-lg px-2 py-1 my-4 w-full"
          />
        </template>
        <template v-else>
          <p class="my-4 ml-13 mr-11 text-2xl">
            <span class="italic">{{ groupenameText }}</span>
          </p>
          <p class="my-0.1 ml-13 mr-11 text-2xl">
            Преподаватель: <span class="italic">{{ teacherText }}</span>
          </p>
          <p class="my-0.1 ml-13 mr-11 text-2xl">
            Должность: <span class="italic">{{ positionText }}</span>
          </p>
          <p class="my-0.1 ml-13 mr-11 text-2xl">
            Кафедра: <span class="italic">{{ departmentText }}</span>
          </p>
          <p class="my-0.1 ml-13 mb-6 mr-11 text-2xl">
            e-mail: <span class="italic">{{ emailText }}</span>
          </p>
        </template>
      </div>

      <p v-if="errorMessage" class="text-red-500 ml-13 mt-2">
        {{ errorMessage }}
      </p>

      <div class="flex justify-end mb-2 mt-4">
        <button
          v-if="isEditing && isEditingGlobal"
          @click="saveChanges"
          class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer"
        >
          Сохранить
        </button>
        <button
          v-if="isEditing && isEditingGlobal"
          @click="cancelEditing"
          class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition cursor-pointer"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

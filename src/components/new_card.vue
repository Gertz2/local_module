<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const containers = ref([]);
const showModal = ref(false);
const containerToDelete = ref(null);
const isEditingGlobal = inject("isEditingGlobal");

const savedTests = ref([]);
const showExistingTestModal = ref(false);
const targetContainerId = ref(null);
const selectedTestId = ref("");

onMounted(() => {
  savedTests.value = JSON.parse(localStorage.getItem("createdTests") || "[]");
});

const existingTests = computed(() => savedTests.value);

const openCreateTestPage = (containerId) => {
  router.push(`/create-test?containerId=${containerId}`);
};

const attachExistingTest = () => {
  const container = containers.value.find(
    (c) => c.id === targetContainerId.value,
  );

  const test = savedTests.value.find(
    (t) => String(t.id) === String(selectedTestId.value),
  );

  if (container && test) {
    container.tests.push({
      ...test,
      isEditing: false,
      isNew: false,
    });
  }

  showExistingTestModal.value = false;
  targetContainerId.value = null;
  selectedTestId.value = "";
};

const refreshSavedTests = () => {
  savedTests.value = JSON.parse(localStorage.getItem("createdTests") || "[]");
};

const addContainer = () => {
  containers.value.push({
    id: Date.now(),
    isCollapsed: false,
    title: "",
    fields: [],
    files: [],
    tests: [],
    isEditing: true,
    isNew: true,
  });
};

const toggleCollapse = (id) => {
  const container = containers.value.find((c) => c.id === id);
  if (container && !container.isEditing) {
    container.isCollapsed = !container.isCollapsed;
  }
};

const startEditing = (id) => {
  const container = containers.value.find((c) => c.id === id);
  if (container) {
    container.isEditing = true;
    container.isNew = false;
  }
};

const saveContainer = (id) => {
  const container = containers.value.find((c) => c.id === id);
  if (container && container.title.trim()) {
    container.isEditing = false;
    container.isNew = false;
  }
};

const cancelEditing = (id) => {
  const container = containers.value.find((c) => c.id === id);
  if (container) {
    if (container.isNew) {
      containers.value = containers.value.filter((c) => c.id !== id);
    } else {
      container.isEditing = false;
    }
  }
};

const deleteContainer = () => {
  if (containerToDelete.value !== null) {
    containers.value = containers.value.filter(
      (c) => c.id !== containerToDelete.value,
    );
  }
  showModal.value = false;
  containerToDelete.value = null;
};

const confirmDeleteContainer = (id) => {
  containerToDelete.value = id;
  showModal.value = true;
};

const addField = (id, type) => {
  const container = containers.value.find((c) => c.id === id);
  if (container) {
    container.fields.push({ id: Date.now(), value: "", type });
  }
};

const addTest = (containerId) => {
  const container = containers.value.find((c) => c.id === containerId);
  if (container) {
    container.tests.push({
      id: Date.now(),
      title: "Новый тест",
      duration: "10 минут",
      isEditing: true,
      isNew: true,
    });
  }
};

const removeField = (containerId, fieldId) => {
  const container = containers.value.find((c) => c.id === containerId);
  if (container) {
    container.fields = container.fields.filter((f) => f.id !== fieldId);
  }
};

const handleFileUpload = (event, containerId) => {
  const container = containers.value.find((c) => c.id === containerId);
  if (container) {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      container.files.push({
        file,
        url: URL.createObjectURL(file),
      });
    });
  }
};

const removeFile = (containerId, index) => {
  const container = containers.value.find((c) => c.id === containerId);
  if (container) {
    container.files.splice(index, 1);
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      v-for="container in containers"
      :key="container.id"
      class="flex flex-col border border-gray-100 rounded-[2vw] w-4/5 bg-white shadow-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl transition p-2 mt-10"
    >
      <div class="relative flex space-x-2">
        <img
          src="/editing.png"
          v-if="!container.isEditing && isEditingGlobal"
          @click="startEditing(container.id)"
          alt="Редактировать курс"
          class="absolute top-1 right-1 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
          title="Редактировать курс"
        />
        <img
          src="/delete.png"
          v-if="!container.isNew && !container.isEditing && isEditingGlobal"
          @click="confirmDeleteContainer(container.id)"
          alt="Удалить курс"
          class="absolute right-10 cursor-pointer w-7 h-7 opacity-70 hover:opacity-100 transition"
          title="Удалить курс"
        />
        <img
          src="/hide.png"
          v-if="!isEditing && !container.isEditing && isEditingGlobal"
          alt="Скрыть тему"
          class="absolute top-1 right-23 cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
          title="Скрыть"
        />
      </div>

      <div class="flex flex-col">
        <div
          class="flex items-center cursor-pointer"
          @click="toggleCollapse(container.id)"
        >
          <img src="/Icon2.png" alt="toggle" class="ml-8 mt-6 mb-3" />
          <template v-if="container.isEditing && isEditingGlobal">
            <input
              v-model="container.title"
              placeholder="Введите название темы"
              class="ml-2 mt-6 mb-3 text-xl border border-gray-300 rounded-lg px-2 py-1 w-full"
              @click.stop
            />
          </template>
          <template v-else>
            <p class="text-xl font-bold" @dblclick="startEditing(container.id)">
              <span class="course-title">
                {{ container.title }}
              </span>
            </p>
          </template>
        </div>

        <div v-if="!container.isCollapsed" class="flex flex-col text-2xl">
          <template v-if="container.isEditing && isEditingGlobal">
            <div
              v-for="field in container.fields"
              :key="field.id"
              class="flex items-center w-full mb-2"
            >
              <template v-if="field.type === 'input'">
                <input
                  v-model="field.value"
                  placeholder="Введите заголовок"
                  class="border border-gray-300 rounded-lg px-2 py-1 w-full"
                  @click.stop
                />
              </template>
              <template v-else>
                <textarea
                  v-model="field.value"
                  placeholder="Введите текст"
                  class="px-2 py-1 w-full border border-gray-300 rounded-lg h-20"
                ></textarea>
              </template>
              <img
                src="/close.png"
                alt="Удалить поле"
                @click="removeField(container.id, field.id)"
                class="ml-2 w-10 h-8 opacity-50 hover:opacity-100 transition cursor-pointer"
              />
            </div>

            <div v-if="container.files.length" class="mt-4 gap-2 w-full mr-11">
              <div
                v-for="(file, index) in container.files"
                :key="index"
                class="flex items-center mb-4 gap-2"
              >
                <a :href="file.url" :download="file.file.name" class="flex">
                  <img
                    v-if="file.file.type.startsWith('image/')"
                    :src="file.url"
                    class="rounded-[1.5vw]"
                    alt="Превью"
                  />
                  <div v-else class="flex items-center">
                    <img src="/Icon.png" class="mr-2" alt="Файл" />
                    <span class="underline">{{ file.file.name }}</span>
                  </div>
                </a>
                <img
                  src="/close.png"
                  alt="Удалить файл"
                  @click="removeFile(container.id, index)"
                  class="ml-2 w-10 h-8 opacity-50 hover:opacity-100 transition cursor-pointer"
                />
              </div>
            </div>
            <div
              v-if="
                savedTests.filter(
                  (t) => String(t.containerId) === String(container.id),
                ).length
              "
              class="flex flex-col gap-4 mx-5 m-5"
            >
              <div
                v-for="test in savedTests.filter(
                  (t) => String(t.containerId) === String(container.id),
                )"
                :key="test.id"
                class="flex flex-col rounded-[1.5vw] shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition cursor-pointer p-6 bg-white"
              >
                <p class="text-2xl font-semibold mb-2">{{ test.title }}</p>
                <p class="text-lg text-gray-600 mb-2">
                  Время: {{ test.durationSec / 60 }} минут
                </p>
                <RouterLink
                  :to="`/test/${test.id}`"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-fit"
                >
                  Начать тест
                </RouterLink>
              </div>
            </div>
          </template>

          <template v-else>
            <template
              v-for="(field, index) in container.fields"
              :key="field.id"
            >
              <div
                v-if="
                  field.type === 'input' &&
                  container.fields[index + 1] &&
                  container.fields[index + 1].type === 'textarea'
                "
                class="flex flex-col rounded-[1.5vw] mx-5 m-5 shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition"
              >
                <p class="text-2xl font-bold my-3 ml-13 mr-11">
                  {{ field.value }}
                </p>
                <p class="text-2xl ml-13 mr-11 mb-6">
                  {{ container.fields[index + 1]?.value }}
                </p>
              </div>

              <p
                v-else-if="
                  (field.type === 'input' || field.type === 'textarea') &&
                  !(
                    index > 0 &&
                    container.fields[index - 1].type === 'input' &&
                    field.type === 'textarea'
                  )
                "
                class="my-1 ml-13 mr-11 mt-5"
              >
                {{ field.value }}
              </p>
            </template>

            <div
              v-if="container.files.length"
              class="mt-4 ml-13 mr-11 flex flex-col gap-2"
            >
              <div v-for="(file, index) in container.files" :key="index">
                <a :href="file.url" :download="file.file.name">
                  <img
                    v-if="file.file.type.startsWith('image/')"
                    :src="file.url"
                    class="cursor-pointer rounded-[1.5vw] mb-10"
                    alt="Превью"
                  />
                  <div
                    v-else
                    class="flex items-center mt-5 mb-10 underline cursor-pointer text-2xl rounded-[1.5vw] shadow-xl hover:-translate-y-1 hover:-translate-x-1"
                  >
                    <img
                      src="/Icon.png"
                      alt="Файл"
                      class="my-0.1 py-5 px-5 ml-8"
                    />
                    {{ file.file.name }}
                  </div>
                </a>
              </div>
            </div>
          </template>
        </div>
        <div v-if="container.tests.length" class="mt-6 flex flex-col gap-4">
          <div
            v-for="test in container.tests"
            :key="test.id"
            class="flex flex-col rounded-[1.5vw] mx-5 m-5 shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition p-5 bg-white"
          >
            <template
              v-if="container.isEditing && isEditingGlobal && test.isEditing"
            >
              <input
                v-model="test.title"
                class="border border-gray-300 rounded-lg px-2 py-1 w-full mb-3"
                placeholder="Название теста"
              />
              <input
                v-model="test.duration"
                class="border border-gray-300 rounded-lg px-2 py-1 w-full mb-3"
                placeholder="Время теста"
              />

              <div class="flex justify-end">
                <button
                  @click="
                    test.isEditing = false;
                    test.isNew = false;
                  "
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Сохранить тест
                </button>
              </div>
            </template>

            <template v-else>
              <p class="text-2xl font-semibold mb-2">{{ test.title }}</p>
              <p class="text-lg text-gray-600 mb-3">
                Время: {{ Math.floor(test.durationSec / 60) }} минут
              </p>

              <RouterLink
                :to="`/test/${test.id}`"
                class="w-fit px-4 py-2 bg-blue-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-blue-600 border-transparent border-2 transition cursor-pointer"
              >
                Начать тест
              </RouterLink>
            </template>
          </div>
        </div>
        <div
          v-if="container.isEditing && isEditingGlobal"
          class="flex mt-2 space-x-2 grid gap-2 lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1"
        >
          <button
            @click="addField(container.id, 'input')"
            class="px-4 py-2 text-grey rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer"
          >
            + Заголовок
          </button>
          <button
            @click="addField(container.id, 'textarea')"
            class="px-4 py-2 text-grey rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer"
          >
            + Текст
          </button>
          <button
            @click="openCreateTestPage(container.id)"
            class="px-4 py-2 text-grey rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer"
          >
            + Создать тест
          </button>

          <button
            @click="
              targetContainerId = container.id;
              showExistingTestModal = true;
            "
            class="px-4 py-2 text-grey rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer"
          >
            + Добавить существующий тест
          </button>

          <label
            class="text-center mt-3 px-4 py-2 text-grey rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border transition cursor-pointer"
          >
            + Прикрепить файлы
            <input
              type="file"
              multiple
              class="hidden"
              @change="(e) => handleFileUpload(e, container.id)"
            />
          </label>
        </div>

        <div
          v-if="container.isEditing && isEditingGlobal"
          class="flex justify-end mt-4 p-5 space-x-2"
        >
          <button
            @click="saveContainer(container.id)"
            class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
          >
            Сохранить
          </button>
          <button
            @click="cancelEditing(container.id)"
            class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>

    <button
      v-if="isEditingGlobal"
      @click="addContainer"
      class="mb-10 py-10 mt-20 text-white rounded-[2vw] shadow-md hover:bg-blue-400 transition border-dashed border-3 w-4/5 text-4xl cursor-pointer"
    >
      +
    </button>

    <div
      v-if="showModal"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700/70"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg">
        <p class="text-xl mb-4">Вы уверены, что хотите удалить курс?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="deleteContainer"
            class="bg-red-600 opacity-80 hover:opacity-100 text-white px-4 py-2 rounded cursor-pointer"
          >
            Удалить
          </button>
          <button
            @click="showModal = false"
            class="bg-gray-300 opacity-80 hover:opacity-100 px-4 py-2 rounded cursor-pointer"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showExistingTestModal"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700/70 z-50"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg w-[500px]">
        <h3 class="text-xl font-semibold mb-4">Выберите тест</h3>

        <div v-if="existingTests.length === 0" class="text-gray-500 mb-4">
          Сохранённых тестов пока нет.
        </div>

        <select
          v-else
          v-model="selectedTestId"
          class="w-full p-2 border border-gray-300 rounded-[1vw] mb-4"
          @click="
            refreshSavedTests();
            targetContainerId = container.id;
            showExistingTestModal = true;
          "
        >
          <option disabled value="">Выберите тест</option>
          <option v-for="test in existingTests" :key="test.id" :value="test.id">
            {{ test.title }} — {{ test.durationSec / 60 }} мин
          </option>
        </select>

        <div class="flex justify-end space-x-4">
          <button
            @click="attachExistingTest"
            :disabled="!selectedTestId"
            class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
          >
            Добавить
          </button>
          <button
            @click="showExistingTestModal = false"
            class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

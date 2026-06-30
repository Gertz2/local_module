<script setup>
import { ref, computed } from "vue";

const isEditing = ref(false);
const showAddForm = ref(false);
const editingIndex = ref(null);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      schedule: [],
    }),
  },
});

// Инициализация данных расписания
const scheduleItems = ref(props.data.schedule);

const dayOrder = {
  Понедельник: 1,
  Вторник: 2,
  Среда: 3,
  Четверг: 4,
  Пятница: 5,
  Суббота: 6,
  Воскресенье: 7,
};

const daysOfWeek = props.data.filters?.days || Object.keys(dayOrder);

const newItem = ref({
  day: "",
  time: "",
  subject: "",
  direction: "",
  group_number: "",
  classroom: "",
  classroomLink: "",
  teacher: "",
});

const editForm = ref({
  day: "",
  time: "",
  subject: "",
  direction: "",
  group_number: "",
  classroom: "",
  classroomLink: "",
  teacher: "",
});

const isNewItemValid = computed(() => {
  return (
    newItem.value.day &&
    newItem.value.time &&
    newItem.value.subject &&
    newItem.value.direction &&
    newItem.value.group_number &&
    newItem.value.teacher
  );
});

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    editingIndex.value = null;
    showAddForm.value = false;
  }
};

const startEdit = (index) => {
  editingIndex.value = index;
  editForm.value = { ...scheduleItems.value[index] };
};

const saveEdit = (index) => {
  scheduleItems.value[index] = { ...editForm.value };
  editingIndex.value = null;
  saveToDatabase();
};

const cancelEdit = () => {
  editingIndex.value = null;
};

const deleteItem = (index) => {
  itemToDelete.value = index;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (itemToDelete.value !== null) {
    scheduleItems.value.splice(itemToDelete.value, 1);
    saveToDatabase();
  }
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const addItem = () => {
  scheduleItems.value.push({ ...newItem.value });

  // Сортировка по дню недели и времени
  scheduleItems.value.sort((a, b) => {
    // Сначала сравниваем дни
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }

    // Если дни одинаковые, сравниваем время
    return a.time.localeCompare(b.time);
  });

  showAddForm.value = false;
  resetNewItem();
  saveToDatabase();
};

const resetNewItem = () => {
  newItem.value = {
    day: "",
    time: "",
    subject: "",
    group_number: "",
    classroom: "",
    classroomLink: "",
    teacher: "",
  };
};

const saveToDatabase = async () => {
  try {
  } catch (error) {}
};
</script>

<template>
  <div class="relative flex flex-col w-full">
    <div class="flex justify-between w-4/5 m-auto mt-5 pb-10">
      <button
        @click="toggleEditMode"
        class="px-4 py-2 hover:-translate-y-0.5 hover:-translate-x-0.5 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition cursor-pointer"
      >
        {{ isEditing ? "Завершить редактирование" : "Редактировать" }}
      </button>
    </div>

    <div class="flex items-center m-auto w-4/5">
      <div class="bg-white rounded-[1vw] shadow-md p-6 w-full">
        <h2 class="text-2xl font-bold mb-6">Календарь занятий</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Преподаватель
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  День недели
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Время
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Название
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Группа
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Аудитория
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  v-if="isEditing"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in scheduleItems"
                :key="index"
                class="relative"
              >
                <!-- ФИО преподавателя -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <input
                      v-model="editForm.teacher"
                      class="border rounded-md p-1"
                    />
                  </template>
                  <template v-else>
                    {{ item.teacher }}
                  </template>
                </td>

                <!-- День недели -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <select
                      v-model="editForm.day"
                      class="border rounded-md p-1"
                    >
                      <option v-for="day in daysOfWeek" :key="day" :value="day">
                        {{ day }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ item.day }}
                  </template>
                </td>

                <!-- Время -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <input
                      v-model="editForm.time"
                      type="time"
                      class="border rounded-md p-1"
                    />
                  </template>
                  <template v-else>
                    {{ item.time }}
                  </template>
                </td>

                <!-- Название курса -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <input
                      v-model="editForm.subject"
                      class="border rounded-md p-1 w-full"
                    />
                  </template>
                  <template v-else>
                    {{ item.subject }}
                  </template>
                </td>

                <!-- Группа -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <input
                      v-model="editForm.group_number"
                      class="border rounded-md p-1"
                    />
                  </template>
                  <template v-else>
                    {{ item.group_number }}
                  </template>
                </td>

                <!-- Аудитория -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <template v-if="editingIndex === index">
                    <input
                      v-model="editForm.classroom"
                      class="border rounded-md p-1"
                    />
                  </template>
                  <template v-else>
                    <a
                      v-if="item.classroomLink"
                      :href="item.classroomLink"
                      target="_blank"
                      class="text-black-500 hover:underline"
                    >
                      {{ item.classroom }}
                    </a>
                    <span v-else>Ауд. {{ item.classroom }}</span>
                  </template>
                </td>

                <td class="px-6 py-4 whitespace-nowrap" v-if="isEditing">
                  <template v-if="editingIndex === index">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="saveEdit(index)"
                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Сохранить
                      </button>
                      <button
                        @click="cancelEdit"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Отмена
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex space-x-2">
                      <img
                        src="/editing.png"
                        @click="startEdit(index)"
                        alt="edit"
                        class="cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
                        title="Редактировать занятие"
                      />

                      <img
                        src="/delete.png"
                        @click="deleteItem(index)"
                        alt="delete"
                        class="cursor-pointer w-5 h-5 opacity-60 hover:opacity-100 transition"
                        title="Удалить занятие"
                      />
                    </div>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 class="text-lg font-medium mb-4">Удалить занятие?</h3>
            <p class="text-gray-600 mb-6">
              Вы уверены, что хотите удалить это занятие? Это действие нельзя
              отменить.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="cancelDelete"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4" v-if="isEditing">
          <button
            @click="showAddForm = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-blue-600 border-transparent border-2 transition cursor-pointer"
            v-if="!showAddForm"
          >
            Добавить занятие
          </button>

          <div v-if="showAddForm" class="mt-4 p-4 border rounded-lg bg-gray-40">
            <h3 class="text-lg font-medium mb-4">Добавить новое занятие</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-1">День недели*</label>
                <select
                  v-model="newItem.day"
                  class="w-full border rounded-md p-2"
                >
                  <option v-for="day in daysOfWeek" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Время*</label>
                <input
                  v-model="newItem.time"
                  type="time"
                  class="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Название*</label>
                <input
                  v-model="newItem.subject"
                  class="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Группа*</label>
                <input
                  v-model="newItem.group_number"
                  class="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Аудитория</label>
                <input
                  v-model="newItem.classroom"
                  class="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1"
                  >ФИО преподавателя*</label
                >
                <input
                  v-model="newItem.teacher"
                  class="w-full border rounded-md p-2"
                  placeholder="Иванов А.А."
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-1"
                  >Ссылка на аудиторию (если есть)</label
                >
                <input
                  v-model="newItem.classroomLink"
                  class="w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div class="mt-4 flex justify-end space-x-2">
              <button
                @click="addItem"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                :disabled="!isNewItemValid"
              >
                Добавить
              </button>
              <button
                @click="showAddForm = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  min-width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tr:hover {
  background-color: #f3f4f6;
}

button {
  transition: all 0.2s ease;
}

input,
select {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: black;
}
</style>

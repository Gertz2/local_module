<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import KatexText from "@/components/KatexText.vue";

const route = useRoute();
const router = useRouter();

const containerId = route.query.containerId;

const loading = ref(true);
const loadError = ref("");
const bankQuestions = ref([]);

const testTitle = ref("Тест по теме 1");
const durationMinutes = ref(10);
const searchQuery = ref("");
const filterType = ref("all");
const selectedQuestionIds = ref([]);

const typeLabels = {
  single: "Один ответ",
  multiple: "Несколько ответов",
  text: "Текст",
  code: "Код",
};

async function loadQuestionsBank() {
  loading.value = true;
  loadError.value = "";

  try {
    const res = await fetch("/tests/questions-bank.json", {
      cache: "no-store",
    });
    if (!res.ok)
      throw new Error(
        `Не удалось загрузить questions-bank.json (${res.status})`,
      );

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("questions-bank.json не найден или возвращается не JSON");
    }

    const data = await res.json();
    bankQuestions.value = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError.value = err?.message || "Ошибка загрузки банка вопросов";
    bankQuestions.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadQuestionsBank();
});

const filteredQuestions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return bankQuestions.value.filter((q) => {
    const matchesType =
      filterType.value === "all" || q.type === filterType.value;
    const matchesQuery =
      !query ||
      (q.text || "").toLowerCase().includes(query) ||
      (q.id || "").toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });
});

const selectedQuestions = computed(() =>
  bankQuestions.value.filter((q) => selectedQuestionIds.value.includes(q.id)),
);

function toggleQuestion(id) {
  const index = selectedQuestionIds.value.indexOf(id);
  if (index === -1) selectedQuestionIds.value.push(id);
  else selectedQuestionIds.value.splice(index, 1);
}

function isSelected(id) {
  return selectedQuestionIds.value.includes(id);
}

function selectAllVisible() {
  const ids = filteredQuestions.value.map((q) => q.id);
  selectedQuestionIds.value = Array.from(
    new Set([...selectedQuestionIds.value, ...ids]),
  );
}

function clearSelected() {
  selectedQuestionIds.value = [];
}

function saveTest() {
  if (!containerId) {
    alert("Не найден контейнер, к которому нужно привязать тест");
    return;
  }

  const newTest = {
    id: Date.now(),
    title: testTitle.value.trim() || "Новый тест",
    durationSec: Number(durationMinutes.value || 0) * 60,
    questionIds: [...selectedQuestionIds.value],
    containerId: String(containerId),
  };

  const saved = JSON.parse(localStorage.getItem("createdTests") || "[]");
  saved.push(newTest);
  localStorage.setItem("createdTests", JSON.stringify(saved));

  router.back();
}
</script>

<template>
  <div class="pb-10">
    <div class="mt-10">
      <div class="bg-white rounded-[1vw] shadow-md w-4/5 p-6 mx-auto">
        <h2 class="text-2xl font-bold mb-6">Создание теста</h2>

        <div v-if="loading" class="text-gray-500">
          Загрузка банка вопросов...
        </div>
        <div v-else-if="loadError" class="text-red-500 mb-4">
          {{ loadError }}
        </div>

        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Название теста</label>
              <input
                v-model="testTitle"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-[1vw]"
                placeholder="Введите название теста"
              />
            </div>

            <div>
              <label class="block text-gray-700 mb-1"
                >Время теста (минуты)</label
              >
              <input
                v-model="durationMinutes"
                type="number"
                min="1"
                class="w-full p-2 border border-gray-300 rounded-[1vw]"
                placeholder="Например, 10"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Поиск по вопросам</label>
              <input
                v-model="searchQuery"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-[1vw]"
                placeholder="Введите текст или id"
              />
            </div>

            <div>
              <label class="block text-gray-700 mb-1">Тип вопроса</label>
              <select
                v-model="filterType"
                class="w-full p-2 border border-gray-300 rounded-[1vw] bg-white"
              >
                <option value="all">Все типы</option>
                <option value="single">Один ответ</option>
                <option value="multiple">Несколько ответов</option>
                <option value="text">Текст</option>
                <option value="code">Код</option>
              </select>
            </div>

            <div class="flex items-end gap-2">
              <button
                @click="selectAllVisible"
                type="button"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-blue-600 border-transparent border-2 transition cursor-pointer"
              >
                Выбрать видимые
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <p class="text-gray-700">
              Выбрано вопросов:
              <strong>{{ selectedQuestionIds.length }}</strong>
            </p>
            <button
              type="button"
              @click="clearSelected"
              class="px-4 py-2 bg-gray-400 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-gray-500 border-transparent border-2 transition cursor-pointer"
            >
              Очистить выбор
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold mb-3">Банк вопросов</h3>

              <div v-if="filteredQuestions.length === 0" class="text-gray-500">
                Вопросы не найдены.
              </div>

              <div v-else class="flex flex-col gap-3">
                <div
                  v-for="question in filteredQuestions"
                  :key="question.id"
                  class="p-4 border border-gray-200 rounded-[1vw] shadow-sm hover:shadow-md transition"
                  :class="
                    isSelected(question.id)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white'
                  "
                >
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <KatexText :text="question.text" class="font-semibold" />
                      <p class="text-sm text-gray-500 mt-1">
                        ID: {{ question.id }} · Тип:
                        {{ typeLabels[question.type] || question.type }}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      :checked="isSelected(question.id)"
                      @change="toggleQuestion(question.id)"
                      class="mt-1 w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-3">Выбранные вопросы</h3>

              <div v-if="selectedQuestions.length === 0" class="text-gray-500">
                Пока ничего не выбрано.
              </div>

              <div v-else class="flex flex-col gap-3">
                <div
                  v-for="question in selectedQuestions"
                  :key="question.id"
                  class="p-4 bg-white border border-gray-200 rounded-[1vw] shadow-sm"
                >
                  <KatexText :text="question.text" class="font-semibold" />
                  <p class="text-sm text-gray-500 mt-1">
                    {{ typeLabels[question.type] || question.type }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="saveTest"
              class="px-4 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
              :disabled="selectedQuestionIds.length === 0"
            >
              Сохранить тест
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

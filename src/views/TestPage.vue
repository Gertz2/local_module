<script setup>
import { ref, reactive, computed, onMounted, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import scheme from "@/mock-json";

import Header from "@/components/Header.vue";
import Drawer from "@/components/drawer.vue";
import Drawerminimised from "@/components/drawerminimised.vue";

import Timer from "../components/test/Timer.vue";
import QuestionSingle from "../components/test/QuestionSingle.vue";
import QuestionMultiple from "../components/test/QuestionMultiple.vue";
import QuestionText from "../components/test/QuestionText.vue";
import QuestionCode from "../components/test/QuestionCode.vue";
import KatexText from "@/components/KatexText.vue";

const props = defineProps({
  id: { type: String, default: null },
});

const route = useRoute();
const router = useRouter();
provide("sidebarData", scheme.sidebar);

const testId = computed(() => String(props.id ?? route.params.id ?? "1"));
const isDrawerOpen = ref(false);

const loading = ref(true);
const loadError = ref("");
const test = ref(null);
const questions = ref([]);
const remainingSec = ref(600);
const timerKey = ref(0);

const answers = reactive({});
const finished = ref(false);
const result = ref({ correctCount: 0, totalAuto: 0 });

const testTitle = computed(() => test.value?.title || `Тест #${testId.value}`);

async function loadQuestionsBank(selectedIds = []) {
  const res = await fetch("/tests/questions-bank.json", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Не удалось загрузить questions-bank.json (${res.status})`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("questions-bank.json не найден или возвращается не JSON");
  }

  const data = await res.json();
  const bankQuestions = Array.isArray(data) ? data : [];

  if (Array.isArray(selectedIds) && selectedIds.length > 0) {
    const byId = new Map(bankQuestions.map((q) => [String(q.id), q]));
    questions.value = selectedIds
      .map((id) => byId.get(String(id)))
      .filter(Boolean);
  } else {
    questions.value = bankQuestions;
  }
}

function initAnswers() {
  for (const key of Object.keys(answers)) {
    delete answers[key];
  }

  for (const q of questions.value) {
    if (q.type === "multiple") {
      answers[q.id] = [];
    } else if (q.type === "single") {
      answers[q.id] = null;
    } else {
      answers[q.id] = "";
    }
  }
}

async function loadTest() {
  loading.value = true;
  loadError.value = "";

  try {
    const savedTests = JSON.parse(localStorage.getItem("createdTests") || "[]");
    const savedTest = savedTests.find((t) => String(t.id) === testId.value);

    if (savedTest) {
      test.value = savedTest;
      remainingSec.value = Number(savedTest.durationSec || 600);
      await loadQuestionsBank(savedTest.questionIds || []);
      initAnswers();
      return;
    }

    const res = await fetch(`/tests/${testId.value}.json`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("fetch failed");

    const data = await res.json();
    test.value = data;
    questions.value = data.questions || [];
    remainingSec.value = data.durationSec || 600;
    initAnswers();
  } catch (err) {
    loadError.value = err?.message || "Не удалось загрузить тест";
    test.value = null;
    questions.value = [];
    remainingSec.value = 600;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadTest();
});

function componentForType(type) {
  if (type === "single") return QuestionSingle;
  if (type === "multiple") return QuestionMultiple;
  if (type === "text") return QuestionText;
  if (type === "code") return QuestionCode;
  return QuestionText;
}

function grade() {
  let correctCount = 0;
  let totalAuto = 0;

  for (const q of questions.value) {
    if (q.type === "single" || q.type === "multiple") {
      totalAuto++;

      const a = answers[q.id];
      if (q.type === "single") {
        if (a === q.correct?.[0]) correctCount++;
      } else {
        const arrA = Array.isArray(a) ? [...a].sort() : [];
        const arrC = Array.isArray(q.correct) ? [...q.correct].sort() : [];
        if (JSON.stringify(arrA) === JSON.stringify(arrC)) correctCount++;
      }
    }
  }

  return { correctCount, totalAuto };
}

function submit() {
  if (finished.value) return;
  finished.value = true;
  result.value = grade();
  remainingSec.value = 0;
  timerKey.value++;
}

function onTimeUp() {
  if (!finished.value) submit();
}

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/");
}
</script>

<template>
  <Header />

  <div
    class="drawer-wrapper"
    @mouseenter="isDrawerOpen = true"
    @mouseleave="isDrawerOpen = false"
  >
    <div class="drawer-inner">
      <Drawer v-if="isDrawerOpen" />
      <Drawerminimised v-else />
    </div>
  </div>

  <main class="main-content">
    <div class="container mx-auto">
      <div class="my-4">
        <div class="flex justify-between w-4/5 m-auto mt-5">
          <h2 class="text-2xl font-bold">{{ testTitle }}</h2>
          <div class="text-lg font-mono">
            <Timer
              :seconds="remainingSec"
              @time-up="onTimeUp"
              :key="timerKey"
            />
          </div>
        </div>

        <div v-if="loading" class="p-4 text-center">Загрузка теста...</div>

        <div v-else-if="loadError" class="p-4 text-center text-red-500">
          {{ loadError }}
        </div>

        <div v-else class="flex flex-col w-4/5 m-auto mt-5">
          <div
            v-if="!finished && questions.length === 0"
            class="p-4 border rounded bg-gray-50"
          >
            Вопросы не найдены в тесте.
          </div>

          <form
            v-if="!finished && questions.length > 0"
            @submit.prevent="submit"
          >
            <div
              v-for="(q, idx) in questions"
              :key="q.id"
              class="p-2 border border-gray-100 rounded-[2vw] m-auto p-10 mt-20 bg-white shadow-xl"
            >
              <div class="mb-3">
                <span class="text-2xl">Вопрос {{ idx + 1 }}.</span>
                <KatexText :text="q.text" class="mt-5 text-2xl" />
                <span
                  v-if="q.type === 'code'"
                  class="ml-3 text-sm italic text-gray-500"
                >
                  (ввод кода)
                </span>
              </div>

              <component
                :is="componentForType(q.type)"
                :question="q"
                v-model="answers[q.id]"
                v-bind="
                  q.type === 'code' ? { language: q.language || 'python' } : {}
                "
              />
            </div>

            <div class="mt-10 mb-10 flex">
              <button
                type="submit"
                class="px-10 py-2 bg-green-600 text-white rounded-[1vw] shadow-md opacity-70 hover:opacity-100 hover:border-green-700 border-transparent border-2 transition cursor-pointer"
              >
                Отправить тест
              </button>
            </div>
          </form>

          <div
            v-if="finished"
            class="p-10 flex flex-col gap-4 border border-gray-100 rounded-[2vw] m-auto w-2/3 mt-8 bg-white shadow-xl"
          >
            <h3 class="text-2xl font-semibold">Тест завершён</h3>
            <p>
              Правильных ответов: <strong>{{ result.correctCount }}</strong> /
              <strong>{{ result.totalAuto }}</strong>
            </p>
            <div class="mt-2">
              <button
                @click="goBack"
                class="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded cursor-pointer"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.katex .base,
.katex .strut {
  display: inline;
}
</style>

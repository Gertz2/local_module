export async function analyzeCode(code) {
  await new Promise((r) => setTimeout(r, 300));
  if (!code || !code.trim()) return { errors: 1, result: "Код пуст" };

  const s = String(code);
  const ok = /def\s+\w+|class\s+\w+|import\s+|print\(|return\s+/.test(s);
  return ok
    ? { errors: 0, result: "Локальная проверка: базовая структура найдена" }
    : {
        errors: 1,
        result: "Локальная проверка: возможно недостаточно конструкций",
      };
}

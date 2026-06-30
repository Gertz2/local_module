import courses from "@/mock/courses.json";

export function getCourseById(id) {
  const course = courses.find((c) => String(c.id) === String(id));
  return Promise.resolve(course || null);
}

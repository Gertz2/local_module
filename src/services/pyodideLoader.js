let pyodideInstance = null;
let loading = null;

export async function loadPyodideInstance() {
  if (pyodideInstance) return pyodideInstance;
  if (loading) return loading;

  const src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = async () => {
      try {
        const pyodide = await globalThis.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        });
        pyodideInstance = pyodide;
        resolve(pyodideInstance);
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return loading;
}

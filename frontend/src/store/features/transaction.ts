export const Backend_Url = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
  : "http://localhost:2122";

/// <reference types="vite/client" />

// Опис змінних оточення з файлу .env, щоб TypeScript знав про VITE_API_URL
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

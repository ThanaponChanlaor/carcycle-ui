/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DATA_SOURCE?: 'mock' | 'firestore' | 'api'
  readonly VITE_USE_MOCK_DATA: string
  readonly VITE_ADMIN_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window ||
  '__TAURI_INTERNALS__' in window ||
  (window as any).__TAURI_METADATA__ !== undefined
);

const STORAGE_KEY = 'tauri_api_base_url';

export function getTauriApiBaseUrl(): string | null {
  if (!isTauri) {
    return null;
  }
  
  const envUrl = import.meta.env.VITE_TAURI_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved || null;
}

export function setTauriApiBaseUrl(url: string): void {
  if (!isTauri) {
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, url);
}

export function getSavedApiUrl(): string | null {
  return getTauriApiBaseUrl();
}



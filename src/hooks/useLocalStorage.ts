import { useEffect, useState } from 'react'


export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved === null ? fallback : (JSON.parse(saved) as T)
  } catch {
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* empty */ }
}


export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readFromStorage(key, initialValue))

  useEffect(() => {
    writeToStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}

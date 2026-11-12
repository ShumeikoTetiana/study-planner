import { useEffect, useState } from 'react'

// Читає значення з localStorage. Якщо там нічого немає або дані пошкоджені
// (JSON.parse кидає помилку) — повертає значення за замовчуванням, і застосунок не ламається
export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved === null ? fallback : (JSON.parse(saved) as T)
  } catch {
    return fallback
  }
}

// Записує значення в localStorage. Помилку (наприклад, сховище переповнене) просто ігноруємо
export function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // нічого не робимо: застосунок працює далі, просто без збереження
  }
}

// Custom hook: як useState, але значення ще й зберігається в localStorage.
// Використовується для активного фільтра
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Початкове значення читаємо зі сховища лише один раз — при першому рендері
  const [value, setValue] = useState<T>(() => readFromStorage(key, initialValue))

  // Після кожної зміни значення записуємо його в сховище (побічний ефект)
  useEffect(() => {
    writeToStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}

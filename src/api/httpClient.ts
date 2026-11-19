// HTTP client — єдине місце в застосунку, яке знає про fetch і адресу сервера.
// Компоненти й repository не пишуть fetch самі, а викликають request()

// Адреса API береться зі змінної оточення (файл .env)
const API_URL = import.meta.env.VITE_API_URL

// Помилка HTTP: сервер відповів, але зі статусом 4xx/5xx
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown // дані, які відправляємо (перетворюються на JSON)
  signal?: AbortSignal // сигнал для скасування запиту
}

// Виконує запит і повертає вже розібраний JSON.
// <T> — тип даних, які очікуємо у відповіді
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options

  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  // fetch НЕ кидає помилку на 404 чи 500 — перевіряємо статус самі
  if (!response.ok) {
    throw new HttpError(response.status, `HTTP ${response.status}`)
  }

  return (await response.json()) as T
}

// Чи це скасований запит (AbortController.abort()).
// Такий запит не вважаємо помилкою і не показуємо користувачу
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

// Централізована нормалізація помилок (додаткове завдання №4):
// будь-яку помилку перетворюємо на зрозумілий текст для інтерфейсу
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 404) return 'Завдання не знайдено на сервері'
    if (error.status >= 500) return 'Сервер тимчасово недоступний. Спробуйте пізніше'
    return `Сервер повернув помилку (${error.status})`
  }

  // fetch кидає TypeError, коли немає інтернету або сервер недосяжний
  if (error instanceof TypeError) {
    return 'Не вдалося з’єднатися з сервером. Перевірте інтернет'
  }

  return 'Сталася невідома помилка'
}

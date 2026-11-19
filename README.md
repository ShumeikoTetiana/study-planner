# Study Planner

Лабораторні роботи:
- №8 — **React Fundamentals: компоненти, JSX, props, стан, події та списки**;
- №9 — **React State та Effects: Context API, useReducer, useEffect і Custom Hooks**;
- №10 — **React та REST API: API layer, Repository Pattern, асинхронні операції та CRUD**.

Автор: Шумейко Тетяна Сергіївна ([ShumeikoTetiana](https://github.com/ShumeikoTetiana))

Планувальник навчальних завдань, який працює з REST API [DummyJSON Todos](https://dummyjson.com/docs/todos): список з пагінацією, деталі завдання, створення, перемикання «виконано», зміна назви, видалення з підтвердженням.

> DummyJSON лише імітує POST / PUT / DELETE: відповідь приходить, але сервер нічого не зберігає. Тому після успішного запиту застосунок сам оновлює список у UI, а після перезавантаження сторінки дані знову такі, як на сервері.

## Технології

- React 19 + TypeScript
- Vite
- SCSS + BEM
- ESLint

## Запуск

Потрібен Node.js 22.22 або новіший.

```bash
cp .env.example .env   # адреса API (VITE_API_URL)
npm install
npm run dev      # запуск у режимі розробки
npm run lint     # перевірка ESLint
npm run build    # перевірка типів TypeScript і збірка
```

## Структура

```
src/
├── api/httpClient.ts            # fetch, VITE_API_URL, перевірка response.ok, нормалізація помилок
├── repositories/taskRepository.ts # getAll / getById / create / update / delete + mapping ApiTodo → Task
├── hooks/
│   ├── useTasks.ts              # server state списку: сторінка, loading/error/success, AbortController
│   ├── useTaskDetails.ts        # завантаження одного завдання (getById) з AbortController
│   ├── useTaskContext.ts        # доступ до контексту
│   └── useLocalStorage.ts       # збереження фільтра (client state)
├── context/                     # TaskProvider: server state + UI state (фільтр, вибране завдання, toast)
├── components/                  # UI без URL і fetch; кожен компонент зі своїм .scss (BEM)
├── types/task.ts                # domain-модель Task
├── App.tsx
└── main.tsx
```

## Як усе працює (лаба 10)

```
Компонент → useTaskContext() → useTasks / useTaskDetails → taskRepository → httpClient → fetch → API
```

- **httpClient** знає лише про HTTP: будує URL з `VITE_API_URL`, перевіряє `response.ok`, кидає `HttpError`.
- **taskRepository** знає endpoint-и DummyJSON і перетворює `ApiTodo` у `Task`. Компоненти бачать лише `Task`.
- **useTasks** завантажує сторінку при зміні `page`; при переході між сторінками попередній запит скасовується через `AbortController`. Скасований запит не показується як помилка.
- **Стани:** «Завантаження…», «Помилка завантаження» з кнопкою «Спробувати ще», «Завдань не знайдено.», список.
- **Server state** (завдання з API) живе лише в `useTasks`; **client state** — фільтр (localStorage), поточна сторінка, вибране завдання, форма.

## Додаткові завдання

- Лаба 8: лічильник кількості завдань у кнопках фільтра.
- Лаба 9: масове видалення виконаних («Очистити виконані») з можливістю Undo.
- Лаба 10: централізована нормалізація помилок (`getErrorMessage` у `httpClient.ts`).

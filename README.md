# Study Planner

Лабораторні роботи:
- №8 — **React Fundamentals: компоненти, JSX, props, стан, події та списки**;
- №9 — **React State та Effects: Context API, useReducer, useEffect і Custom Hooks**.

Автор: Шумейко Тетяна Сергіївна ([ShumeikoTetiana](https://github.com/ShumeikoTetiana))

Простий планувальник навчальних завдань: перегляд списку, додавання, редагування, позначення виконаним, видалення з можливістю скасування (Undo), фільтр і статистика. Завдання та обраний фільтр зберігаються в localStorage.

## Технології

- React 19 + TypeScript
- Vite
- SCSS + BEM
- ESLint

## Запуск

Потрібен Node.js 22.22 або новіший.

```bash
npm install
npm run dev      # запуск у режимі розробки
npm run lint     # перевірка ESLint
npm run build    # перевірка типів TypeScript і збірка
```

## Структура

```
src/
├── components/
│   ├── Header.tsx         # заголовок застосунку
│   ├── TaskForm.tsx       # форма додавання і редагування завдання
│   ├── TaskStats.tsx      # статистика: усього / виконано / не виконано
│   ├── TaskFilters.tsx    # фільтр, «Очистити виконані», «Скинути дані»
│   ├── TaskList.tsx       # список завдань і повідомлення про порожній список
│   ├── TaskItem.tsx       # одне завдання з кнопками
│   ├── Toast.tsx          # одне сповіщення зі смужкою прогресу
│   ├── Notifications.tsx  # місце для сповіщень (у т.ч. «буде видалено» + Undo)
│   └── *.scss             # стилі кожного компонента (BEM)
├── context/
│   ├── TaskContext.ts     # createContext і тип значення контексту
│   └── TaskProvider.tsx   # useReducer, useEffect-и, toast, функції для компонентів
├── hooks/
│   ├── useTaskContext.ts  # доступ до контексту з перевіркою провайдера
│   └── useLocalStorage.ts # useState + збереження в localStorage
├── reducers/
│   └── taskReducer.ts     # чиста функція: як змінюється стан для кожної дії
├── types/task.ts          # тип Task, Priority, TaskFilter
├── data/initialTasks.ts   # початкові завдання
├── styles/                # змінні та базові глобальні стилі
├── App.tsx                # складає сторінку всередині TaskProvider
└── main.tsx               # точка входу
```

## Як усе працює (лаба 9)

```
TaskProvider  (useReducer → tasks, pendingDelete; useLocalStorage → filter; useState → toast)
│   useEffect: tasks → localStorage
│   useEffect: кількість невиконаних → document.title
│   useEffect: pendingDelete → таймер 5 с → confirmDelete (cleanup: clearTimeout)
│
└── компоненти беруть дані та функції через useTaskContext()
    TaskForm · TaskStats · TaskFilters · TaskList → TaskItem · Notifications → Toast
```

- **Reducer** (`taskReducer.ts`) підтримує дії `add`, `toggle`, `update`, `requestDelete`, `confirmDelete`, `undoDelete`, `clearCompleted`, `reset`. Він чистий: без таймерів, localStorage і DOM.
- **Undoable Delete:** «Видалити» лише позначає завдання як «буде видалено», показує toast з прогресом і кнопкою «Скасувати». Якщо за 5 секунд не скасувати — завдання видаляється остаточно.
- **localStorage:** при старті reducer отримує збережені завдання (пошкоджені дані → початковий список), після кожної зміни вони записуються назад.

## Додаткові завдання

- Лаба 8: лічильник кількості завдань у кнопках фільтра.
- Лаба 9: масове видалення виконаних («Очистити виконані») з можливістю Undo.

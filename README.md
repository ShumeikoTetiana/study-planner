# Study Planner

Лабораторна робота №8 — **React Fundamentals: компоненти, JSX, props, стан, події та списки**.

Автор: Шумейко Тетяна Сергіївна ([ShumeikoTetiana](https://github.com/ShumeikoTetiana))

Простий планувальник навчальних завдань: перегляд списку, додавання, позначення виконаним, видалення, фільтр і статистика. Дані зберігаються лише в пам'яті React (після перезавантаження сторінки повертаються початкові завдання).

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
│   ├── Header.tsx        # заголовок застосунку
│   ├── TaskForm.tsx      # форма додавання завдання
│   ├── TaskStats.tsx     # статистика: усього / виконано / не виконано
│   ├── TaskFilters.tsx   # кнопки фільтра + «Очистити виконані»
│   ├── TaskList.tsx      # список завдань (map) і повідомлення про порожній список
│   ├── TaskItem.tsx      # одне завдання з кнопками
│   └── *.scss            # стилі кожного компонента (BEM)
├── types/task.ts         # тип Task, Priority, TaskFilter
├── data/initialTasks.ts  # початкові завдання
├── styles/               # змінні та базові глобальні стилі
├── App.tsx               # стан застосунку і логіка змін
└── main.tsx              # точка входу
```

## Як компоненти взаємодіють

```
App  (state: tasks, filter)
├── Header
├── TaskForm      ── onAdd(task) ──────────────► App
├── TaskStats     ◄── tasks
├── TaskFilters   ◄── current, counts   ── onChange(filter), onClearCompleted() ──► App
└── TaskList      ◄── visibleTasks
    └── TaskItem  ◄── task              ── onToggle(id), onDelete(id) ──► App
```

Дані йдуть **згори вниз** через props, а про дії користувача дочірні компоненти повідомляють **знизу вгору** через callback-функції.

## Додаткові завдання

- Лічильник кількості завдань у кнопках фільтра.
- Кнопка «Очистити виконані» (показується лише коли є виконані завдання).

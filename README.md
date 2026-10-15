# Ульяна Буданова — premium landing page

Одностраничный сайт декоратора на React + TypeScript + Vite.

## Запуск

```bash
npm install
npm run dev
```

Для production-сборки:

```bash
npm run build
npm run preview
```

## Что реализовано

- премиальный responsive-first интерфейс на русском языке;
- WebGL hero с парящими формами, реакцией на курсор, bloom, зерном и виньеткой;
- scroll-driven 3D-морфинг между hero и услугами через GSAP ScrollTrigger;
- 3D-карусель работ на Three.js: вращение колесом или свайпом;
- отдельная WebGL-сцена новогоднего блока с шейдерными снежинками и огнями;
- Lenis smooth scroll, Framer Motion reveal/hover/layout-анимации, магнитный курсор и tilt-карточки;
- адаптивная сетка 11 услуг, проекты с фильтрами, таймлайн процесса, преимущества, отзывы и контакты;
- React Hook Form + Zod валидация формы;
- a11y: семантические landmarks, focus-visible, aria-подписи, reduced-motion fallback;
- SEO/OG/Twitter метатеги.

## Фотографии проектов

Фото лежат в `public/projects/<id>/` и называются `01.jpg`, `02.jpg` и так далее. Портрет лежит в `public/images/portrait.jpg`. Исходники с русскими названиями папок хранятся в `assets/`, сайт их не читает.

Новый проект добавляется так:

1. Положите фото в `public/projects/<id>/` с именами по порядку.
2. Добавьте запись в `projects` в `src/data.ts`: `photoCount` задаёт число фото, `cover` задаёт номер обложки, `alt` описывает кадр для скринридеров.

Обложка попадает в сетку и в 3D-карусель. По клику на карточку открывается галерея со всеми фото.

## Перед публикацией

Замените демо-значения телефона, Telegram и WhatsApp в секции `contacts` в `src/App.tsx`, добавьте реальный URL в Open Graph метатеги и подключите форму к выбранному обработчику заявок/API.

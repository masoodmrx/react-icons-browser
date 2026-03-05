# React Icons Browser

یک اپلیکیشن دسکتاپ آفلاین با Electron + Vite + React + TypeScript برای مرور، جستجو و کپی آیکن‌های پکیج `react-icons`.

## Features

- دسته‌بندی بر اساس pack (fa, md, ai, bi, bs, fi, gi, hi, hi2, io, io5, lu, ri, si, tb)
- جستجوی سریع fuzzy با Fuse.js
- گرید virtualized برای عملکرد بهتر با تعداد بالای آیکن‌ها
- صفحه Favorites با ذخیره در localStorage
- صفحه Settings (theme, density, default size)
- پیش‌نمایش آیکن در Modal + color picker + size slider
- کپی import، usage و نام آیکن
- اسکریپت بروزرسانی کتابخانه آیکن‌ها و تولید metadata

## Project structure

```txt
/react-icons-browser
  /electron
    main.ts
    preload.ts
  /src
    main.tsx
    App.tsx
    /components
    /pages
    /hooks
  /icons
  package.json
  vite.config.ts
  tsconfig.json
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run Electron (with Vite dev server)

```bash
npm run electron
```

## Distribution (Windows installer + portable)

```bash
npm run dist
```

## Update icon library

```bash
npm run update-icons
```

این دستور:
1. `react-icons` را update می‌کند.
2. فایل `icons/metadata.json` را بازتولید می‌کند.

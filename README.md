# AkAi Frontend

AI-powered academic schedule reminder — Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
akai-frontend/                 ← project root (run commands here)
├── app/
│   ├── (dashboard)/           ← routes with sidebar layout
│   │   ├── layout.tsx
│   │   ├── home/
│   │   ├── tasks/
│   │   ├── planner/
│   │   ├── ai-assistant/
│   │   └── settings/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx               → redirects to /login
│   └── globals.css
├── components/
│   ├── ai/
│   ├── auth/
│   ├── brand/
│   ├── dashboard/
│   ├── layout/
│   ├── planner/
│   ├── settings/
│   ├── tasks/
│   └── ui/                    ← shadcn components
├── hooks/
├── lib/
├── store/
├── types/
└── public/
```

**Note:** Keep a single project root. Do not nest another `akai-frontend/` folder inside this directory — that causes duplicate `app/` and `components/` paths.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |

# 📐 PLANTO Frontend Coding Guidelines

> **อ่านก่อนแตะโค้ดทุกครั้ง** — เอกสารนี้คือมาตรฐานการเขียน Frontend ของโปรเจค PLANTO  
> เป้าหมาย: โค้ดที่ใครก็อ่านออก, แก้ได้ไม่พัง, ส่งต่อทีมได้โดยไม่ต้องอธิบาย

---

## 1. หลักการสำคัญ (ต้องจำ 3 ข้อนี้)

```
1. อ่านก่อนเขียน  — ดูโค้ดที่มีอยู่ก่อนเสมอ ไม่สร้างรูปแบบใหม่ถ้ามีอยู่แล้ว
2. Token ก่อน    — ค่าทุกอย่างในโปรเจคต้องมาจาก Design Token เท่านั้น
3. แก้เฉพาะจุด  — ไม่ rewrite ทั้งไฟล์ถ้าต้องการแก้แค่ 5 บรรทัด
```

---

## 2. Design Token System

### Token คืออะไร และทำไมต้องใช้

Token คือชื่อที่ตั้งให้กับค่า CSS เพื่อให้ทั้ง project ใช้ค่าเดียวกัน  
ไฟล์หลัก: `src/index.css` — **Single Source of Truth ของทุก Token**

### ✅ ถูกต้อง — ใช้ Token เสมอ

```css
.my-card {
  border-radius: var(--radius-lg);       /* ✅ */
  color: var(--text-primary);            /* ✅ */
  background: var(--emerald-10);         /* ✅ */
  padding: var(--space-4);               /* ✅ */
  font-size: var(--text-base);           /* ✅ */
}
```

### ❌ ผิด — ห้าม Hardcode ค่าเหล่านี้

```css
.my-card {
  border-radius: 16px;                   /* ❌ */
  color: #ffffff;                        /* ❌ */
  background: rgba(16, 185, 129, 0.1);  /* ❌ */
  padding: 16px;                         /* ❌ */
  font-size: 14px;                       /* ❌ */
}
```

### Token Reference ที่ใช้บ่อย

```css
/* ── Border Radius ── */
--radius-xs: 4px      /* badge, tag */
--radius-sm: 8px      /* button, input */
--radius-md: 12px     /* card inner */
--radius-lg: 16px     /* card */
--radius-xl: 20px     /* modal */
--radius-2xl: 24px    /* section */
--radius-3xl: 32px    /* dashboard frame */
--radius-full: 9999px /* pill, circle */

/* ── Spacing (8px grid) ── */
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px  --space-8: 32px  --space-10: 40px

/* ── Font Size ── */
--text-xs: 10px   /* micro label */
--text-sm: 12px   /* caption */
--text-base: 14px /* body */
--text-md: 16px   /* sub-heading */
--text-lg: 18px   /* section title */
--text-xl: 22px   /* page title */
--text-2xl: 28px  /* hero */

/* ── Font Weight ── */
--fw-regular: 400  --fw-medium: 500  --fw-semibold: 600
--fw-bold: 700     --fw-black: 800

/* ── Colors ── */
--neon-emerald: #10b981    /* primary action */
--color-success: #10b981
--color-danger: #ef4444
--color-warning: #f59e0b
--color-info: #3b82f6
--text-primary: #fff
--text-secondary: #9CA3AF
--text-tertiary: #6B7280
--text-disabled: #4B5563

/* ── Emerald Opacity Scale ── */
--emerald-5 thru --emerald-70  (ห้ามใช้ rgba(16,185,129,...) โดยตรง)

/* ── Glassmorphism ── */
--glass-bg            /* standard card background */
--glass-bg-deep       /* darker overlay */
--glass-bg-subtle     /* rgba(255,255,255,0.03) */
--glass-border        /* rgba(255,255,255,0.08) */
--glass-blur          /* blur(12px) */
```

### ถ้าต้องการค่าที่ยังไม่มี Token

1. เพิ่ม Token ใหม่ใน `src/index.css` ก่อน
2. แล้วค่อยใช้ใน CSS file
3. **ห้ามสร้าง `:root {}` ใน CSS file ของ component**

---

## 3. CSS File Structure

### กฎการตั้งชื่อและจัดระเบียบ

```
src/
├── index.css              ← Global tokens + utilities (ห้ามสร้าง rule เฉพาะ component ที่นี่)
├── App.css                ← App shell เท่านั้น
└── components/
    ├── Header.css         ← Styles ของ Header เท่านั้น
    ├── ModuleName/
    │   └── ModuleName.css ← Styles ของ module นั้นเท่านั้น
```

### Template CSS File ที่ถูกต้อง

```css
/* ── ComponentName.css ──────────────────────────────────────────────────── */

/* ── Section Name ────────────────────────────────────────────────────────── */
.component-root {
  /* ... */
}

/* ── Sub-section ─────────────────────────────────────────────────────────── */
.component-child {
  /* ... */
}
```

### สิ่งที่ห้ามทำใน CSS file

```css
/* ❌ ห้าม redeclare :root */
:root {
  --my-new-var: 10px;
}

/* ❌ ห้าม duplicate @keyframes ที่มีอยู่แล้วใน index.css */
@keyframes fadeInUp { ... }   /* มีอยู่แล้วใน index.css */
@keyframes slideDown { ... }  /* มีอยู่แล้วใน index.css */
@keyframes zoomIn { ... }     /* มีอยู่แล้วใน index.css */
@keyframes overlayIn { ... }  /* มีอยู่แล้วใน index.css */

/* ❌ ห้าม import font ใหม่ */
@import url('https://fonts.googleapis.com/...Manrope...');
/* Font ทั้งหมดกำหนดใน index.css เท่านั้น */
```

---

## 4. Global Animations (ใช้ได้เลย ไม่ต้อง redeclare)

```css
/* ใช้ animation: [name] [duration] [easing]; ได้เลย */

animation: fadeInUp 0.4s ease-out;    /* page/section เข้ามา */
animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);   /* dropdown */
animation: zoomIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);  /* modal popup */
animation: overlayIn 0.2s ease;       /* overlay fade */
```

---

## 5. React Component Standards

### Component File Template

```tsx
// ── ComponentName.tsx ────────────────────────────────────────────────────
// [อธิบาย 1 บรรทัดว่า component ทำอะไร]

import React, { useState } from 'react';
import { IconName } from 'lucide-react';
import { useContextHook } from '../../hooks/ContextName';
import type { TypeName } from '../../types';
import './ComponentName.css';

// ── Types ────────────────────────────────────────────────────────────────
interface ComponentNameProps {
  propName: string;
  onAction: (value: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────
const ComponentName: React.FC<ComponentNameProps> = ({ propName, onAction }) => {
  const [localState, setLocalState] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSomething = () => {
    // ...
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="component-root">
      {/* ... */}
    </div>
  );
};

export default ComponentName;
```

### กฎ Component

| กฎ | รายละเอียด |
|---|---|
| **Functional Only** | ห้ามใช้ Class Component เด็ดขาด |
| **Single Responsibility** | 1 component = 1 หน้าที่ ถ้ายาวเกิน 300 บรรทัดให้แยก |
| **Type Everything** | Props ทุกตัวต้องมี TypeScript type ห้าม `any` (ยกเว้นจำเป็น) |
| **อ่าน types.ts ก่อน** | ก่อนสร้าง interface ใหม่ ตรวจสอบว่ามีอยู่แล้วใน `types.ts` ไหม |
| **ห้าม inline style** | ใช้ CSS class เสมอ ยกเว้น dynamic value ที่คำนวณจาก JS เท่านั้น |

---

## 6. Tailwind CSS Usage

โปรเจคนี้ใช้ **Tailwind CSS v4** ร่วมกับ per-module CSS files

### เมื่อไหรใช้ Tailwind / เมื่อไหรใช้ CSS file

```
ใช้ Tailwind ได้ถ้า:
  ✅ Layout utilities: flex, grid, items-center, justify-between
  ✅ Width/Height แบบง่าย: w-full, h-full, min-h-screen
  ✅ One-off utility ที่ไม่ซ้ำ: overflow-hidden, relative, absolute

ใช้ CSS file ถ้า:
  ✅ มี hover/active/focus state
  ✅ Animation/transition ซับซ้อน
  ✅ Class ที่ใช้ซ้ำในหลาย element
  ✅ Glassmorphism (backdrop-filter)
  ✅ Pseudo-elements (::before, ::after)
```

### ห้ามผสมกัน (Anti-pattern)

```tsx
/* ❌ อย่าทำแบบนี้ — hardcode สีใน Tailwind inline */
<div className="bg-[#10b981] text-[14px] rounded-[12px]">

/* ✅ ทำแบบนี้ */
<div className="card-element">   {/* แล้วกำหนดใน .css */}
```

---

## 7. State Management

โปรเจคนี้มี **3 Global Contexts** — ใช้ผ่าน hooks เท่านั้น

```tsx
import { useTLog }     from '../../hooks/TLogManager';    // transactions
import { useQuickFill } from '../../hooks/QuickFillManager'; // quick fills
import { useSettings }  from '../../hooks/SettingsManager';  // user settings
```

### กฎ State

- **Global Data** → ใช้ Context เสมอ (ห้ามส่ง raw data ผ่าน props ลึกๆ)
- **UI State** (open/close, active tab) → `useState` ใน component นั้น
- **Computed Data** → `useMemo` ห้ามคำนวณซ้ำใน render

### Cross-Component Communication — ใช้ CustomEvent

```tsx
// ส่ง event (ไม่ใช้ prop drilling)
window.dispatchEvent(new CustomEvent('planto_event_name', { detail: payload }));

// รับ event
useEffect(() => {
  const handler = (e: Event) => { /* ... */ };
  window.addEventListener('planto_event_name', handler);
  return () => window.removeEventListener('planto_event_name', handler);
}, []);
```

**Custom Events ที่มีอยู่แล้ว (ห้ามสร้างชื่อซ้ำ):**

| Event | ผลลัพธ์ |
|---|---|
| `planto_apply_quick_fill` | TLog Form: pre-populate fields |
| `planto_open_quickfill_setup` | เปิด QuickFill setup modal |
| `planto_reset_asset_mart` | Reset AssetMart view |
| `planto_reset_milestones` | Reset Milestones view |
| `planto_reset_subscription` | Reset Subscription view |

---

## 8. Data & localStorage

**ห้ามอ่าน localStorage โดยตรงใน component** — ใช้ผ่าน hooks เท่านั้น

```tsx
/* ❌ ห้าม */
const data = JSON.parse(localStorage.getItem('planto_transactions') || '[]');

/* ✅ ถูกต้อง */
const { transactions } = useTLog();
```

**localStorage Keys ที่มีอยู่ (ห้ามสร้างชื่อใหม่ที่คล้ายกัน):**

| Key | เจ้าของ |
|---|---|
| `planto_transactions` | TLogManager |
| `planto_milestones` | useMilestones |
| `planto_quick_fills` | QuickFillManager |
| `planto_settings` | SettingsManager |
| `planto_followed_assets` | AssetMart/FollowList |
| `planto-zen-dashboard-v3` | useDashboard |

---

## 9. Typography Rules

**Font เดียวเท่านั้น: Inter** (กำหนดใน `:root` ใน `index.css`)

```css
/* ❌ ห้ามกำหนด font-family ใน component CSS */
.my-title { font-family: 'Manrope', sans-serif; }

/* ✅ ใช้ weight token แทน */
.my-title {
  font-weight: var(--fw-bold);
  font-size: var(--text-xl);
  letter-spacing: -0.02em;   /* headings ใช้ค่านี้เสมอ */
}
```

**Type Scale Hierarchy:**

```
Page Title    → text-xl (22px) + fw-bold   + letter-spacing: -0.02em
Section Title → text-lg (18px) + fw-bold
Sub-heading   → text-md (16px) + fw-semibold
Body          → text-base (14px) + fw-regular
Caption       → text-sm (12px)  + fw-medium
Micro Label   → text-xs (10px)  + fw-semibold + uppercase + letter-spacing: 0.05em
```

---

## 10. Design Rules (Zen Aesthetic)

```
สีหลัก:    #10b981 (Emerald) — ใช้เฉพาะ CTA, active state, highlight
พื้นหลัง:  #050505 (Obsidian Void)
Surface:   #121214 (Dark Slate)
Font:      Inter — ทุกหน้า ทุก component

กฎสี:
  - Emerald ปรากฏน้อย = มีความหมายมาก (อย่า overuse)
  - ใช้ emerald opacity (--emerald-8 ถึง --emerald-20) สำหรับ background
  - ใช้ --neon-emerald สำหรับ text/border/icon ที่ต้องการ attention
  - Hover state: ไม่เกิน --emerald-30 สำหรับ background

Glassmorphism:
  - background: var(--glass-bg)
  - backdrop-filter: var(--glass-blur)
  - border: 1px solid var(--glass-border)
  - ห้ามใช้ glassmorphism ซ้อนกันมากกว่า 2 ชั้น

Border Radius Meaning:
  - Pill (--radius-full)  = Action buttons, badges
  - 2xl/3xl              = Page-level containers
  - lg/xl                = Cards
  - sm/md                = Inputs, small buttons
```

---

## 11. Checklist ก่อน Commit

```
ก่อน commit ทุกครั้ง ตรวจ:

□ ไม่มี hardcode color (#hexcode) ใน .css files
□ ไม่มี font-family ที่ไม่ใช่ Inter
□ ไม่มี :root {} นอกจากใน index.css
□ ไม่มี @keyframes ซ้ำกับที่มีใน index.css
□ ทุก TypeScript type มาจาก types.ts (ไม่สร้างซ้ำ)
□ ไม่มี console.log() ที่ลืมลบ
□ Component ใหม่มี JSDoc comment อธิบาย props
□ npm run build ผ่านโดยไม่มี error ใหม่
```

---

## 12. สิ่งที่ห้ามทำเด็ดขาด

```
❌ Class Component (React)
❌ any type ใน TypeScript (ยกเว้น third-party ที่จำเป็น)
❌ Hardcode color/size/spacing ใน .css
❌ Import font ใหม่ใน component CSS
❌ :root {} ใน component CSS
❌ อ่าน/เขียน localStorage โดยตรงใน component
❌ Prop drilling เกิน 2 ชั้น (ใช้ Context แทน)
❌ !important (ยกเว้นแก้ third-party library)
❌ แก้ node_modules
❌ สร้าง custom event ชื่อซ้ำกับที่มีอยู่
```

---

## 13. เมื่อไม่แน่ใจ

1. **อ่าน `README_ARCH.md`** — แผนที่ภาพรวมโปรเจค
2. **ดู component ที่ใกล้เคียง** — ถ้ามีคนทำแบบนี้แล้ว ทำตามรูปแบบเดิม
3. **ดู `src/types.ts`** — ก่อนสร้าง interface ใหม่
4. **ดู `src/index.css`** — ก่อนใส่ค่า CSS ใดๆ

> [!IMPORTANT]
> เอกสารนี้ไม่ใช่ข้อเสนอแนะ — เป็นมาตรฐานที่ต้องปฏิบัติตาม  
> ถ้าพบจุดที่ต้องการข้อยกเว้น ให้ระบุเหตุผลใน code comment ก่อนทำ

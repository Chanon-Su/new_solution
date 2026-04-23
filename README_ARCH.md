# 🏛️ README_ARCH - Project Architecture & Source of Truth

**Role:** Senior System Architect
**Status:** Living Document / Source of Truth
**Last Updated:** 2026-04-23

---

## 🎯 Project Purpose

**PLANTO** คือ premium, privacy-focused **Portfolio Tracker** สำหรับ Personal Finance ที่ออกแบบตาม philosophy ว่า "User Owns Data" ผู้ใช้สามารถติดตาม Digital และ Traditional Assets (Crypto, Stocks, Gold, FX ฯลฯ) ตั้งเป้าหมายทางการเงิน และวิเคราะห์ Dividend ได้ในที่เดียว โดยข้อมูลทั้งหมดเก็บใน `localStorage` ของผู้ใช้เองเท่านั้น

**Design Philosophy:** "Zen Aesthetic" — Clean, Minimalist, Dark Mode, Glassmorphism, Tactile — inspired by Obsidian & macOS.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Core Framework | React 19 (TypeScript) + Vite |
| Styling | Tailwind CSS v4 + Vanilla CSS (per-component `.css` files) |
| Icons | Lucide React |
| State | React Context API (`TLogProvider`) + `useState`/`useMemo` |
| Persistence | `localStorage` (Primary DB) + CSV Import/Export |
| Routing | Tab-based SPA (ไม่ใช้ React Router, ใช้ `useState` ใน `App.tsx`) |
| Data Sources | Mock Data (ปัจจุบัน), Planned: CoinGecko API, Alpha Vantage |

---

## 📂 File Structure (Actual)

```
root/
├── _agents/                  # AI Agent workflows & knowledge base
│   └── workflows/            # Workflow markdown files (/recontext, /mode_plan ฯลฯ)
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── Dashboard/        # Grid-based modular dashboard
│   │   │   ├── BlocksLayer.tsx
│   │   │   ├── CoordinatesLayer.tsx
│   │   │   ├── DashboardBlock.tsx
│   │   │   ├── DashboardControls.tsx
│   │   │   ├── DashboardGrid.tsx
│   │   │   ├── GridConfigurator.tsx
│   │   │   └── NavigationArrows.tsx
│   │   ├── Dashboard.tsx     # Entry point + Dashboard.css
│   │   │
│   │   ├── TLog/             # Transaction Logging Module
│   │   │   ├── TLog.tsx              # Entry point (wrapper)
│   │   │   ├── TLog_zone1_Form.tsx   # Input form (BUY/SELL/DIVIDEND)
│   │   │   ├── TLog_zone2_Summary.tsx # Asset summary cards
│   │   │   ├── TLog_zone3_History.tsx # History view wrapper
│   │   │   ├── HistoryTable.tsx      # Transaction history table + edit/delete
│   │   │   ├── HistoryPagination.tsx # Pagination logic
│   │   │   └── mockData.ts           # Dev mock transactions
│   │   │
│   │   ├── AssetMart/        # Market Data & Asset Browser
│   │   │   ├── AssetMart.tsx         # Entry point (BentoGrid hub)
│   │   │   ├── BentoGrid.tsx         # Asset category grid
│   │   │   ├── AssetInventory.tsx    # Asset list per category
│   │   │   ├── AssetDetail.tsx       # Full detail view (price, chart, metrics)
│   │   │   ├── FollowList.tsx        # User's tracked assets
│   │   │   └── AssetMart.css
│   │   │
│   │   ├── Milestones/       # Goal & Milestone Tracking Module
│   │   │   ├── MilestonesPage.tsx    # Entry point + list of milestone cards
│   │   │   ├── MilestoneCard.tsx     # Single milestone card (summary)
│   │   │   ├── MilestoneDetailView.tsx # Full detail: analytics + tasks
│   │   │   ├── MilestoneSummary.tsx  # Analytics sub-view (chart, progress)
│   │   │   ├── MilestoneTasks.tsx    # Sub-checklist management
│   │   │   ├── MilestoneChart.tsx    # Dual-axis combo chart (Recharts)
│   │   │   ├── MilestoneAnalyticsDrawer.tsx # Slide-in analytics panel
│   │   │   └── Milestones.css
│   │   │
│   │   ├── Subscription/     # Subscription & Billing Module
│   │   │   ├── SubscriptionJourney.tsx  # Multi-step flow controller
│   │   │   ├── SubscriptionSelector.tsx # Plan selection page
│   │   │   ├── PricingCard.tsx          # Individual plan card
│   │   │   ├── CheckoutPage.tsx         # Checkout & confirmation
│   │   │   ├── SuccessPage.tsx          # Post-purchase success
│   │   │   ├── planData.ts              # Centralized plan configs & ranking
│   │   │   ├── hooks/                   # useSubscription hook
│   │   │   └── utils/                   # billingUtils (formatting, calculations)
│   │   │
│   │   ├── UI/               # Shared Design System Components
│   │   │   ├── ZenField.tsx            # Reusable styled input field
│   │   │   └── ZenDropdown.tsx         # Multi-level custom dropdown
│   │   │
│   │   ├── Header.tsx        # Global glassmorphism navigation bar
│   │   └── Header.css
│   │
│   ├── hooks/                # Global Custom Hooks
│   │   ├── TLogManager.tsx          # ⭐ TLogContext Provider + useTLog() hook
│   │   ├── useDashboard.ts          # Dashboard block layout state
│   │   ├── useBlockInteraction.ts   # Drag/resize/snap logic
│   │   ├── useMilestones.ts         # Milestone CRUD + localStorage
│   │   └── useMilestoneAnalytics.ts # Calculated analytics for milestones
│   │
│   ├── utils/                # Pure Helper Functions
│   │   ├── storage.ts        # localStorage read/write operations
│   │   ├── csvUtils.ts       # CSV import/export logic
│   │   ├── assetMapping.ts   # Asset symbol → category mapping
│   │   └── gridUtils.ts      # Grid layout math helpers
│   │
│   ├── types.ts              # ⭐ Centralized TypeScript interfaces
│   ├── index.css             # Global styles (Tailwind v4 variables, Zen tokens)
│   ├── App.css               # App shell styles
│   └── App.tsx               # ⭐ Root: Tab router + TLogProvider wrapper
│
├── PRD.md                    # Product Requirements Document ("The What")
├── ADD.md                    # Architecture Design Document ("The How")
├── README_ARCH.md            # This file — Source of Truth
├── decisions.md              # ADR log (Architecture Decision Records)
├── error.md                  # Known bugs & error log
└── package.json
```

---

## 🗂️ Core Data Models (`src/types.ts`)

### `Transaction`
ข้อมูลหลักของระบบ — บันทึกทุก Financial Event

```typescript
type Transaction = {
  id: string;
  date: string;           // ISO 8601
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  frequency?: '1m' | '3m' | '6m' | '1y' | 'OTHER'; // สำหรับ DIVIDEND
  asset: string;          // ตัวย่อ เช่น 'BTC', 'AAPL'
  category: string;       // 'Crypto', 'Stock', 'Gold', 'Others'
  amount: number;         // จำนวนหน่วย
  price: number;          // ราคาต่อหน่วย / มูลค่า Dividend
  currency: 'THB' | 'USD';
  fee: number;
  notes: string;
};
```

### `Milestone`
เป้าหมายทางการเงิน — รองรับ Multi-Asset Tracking

```typescript
interface Milestone {
  id: string;
  title: string;
  category: 'money' | 'asset' | 'dividend';
  targetValue: number;
  trackingDimension?: 'Cash' | 'Unit' | 'Dividend';
  dividendPeriod?: '1m' | '3m' | '6m' | '1y';  // เฉพาะ Dividend mode
  linkedAssets: string[];    // รายการ Asset symbols (multi-asset)
  precision?: number;
  subChecklist: SubChecklistItem[];
  // ... fields อื่นๆ
}
```

### `DashboardBlock` / `VisType`
Layout block บน Dashboard — `allocation`, `value`, `activity`, `empty`

---

## 🔄 Data Flow

```
[User Input - TLog Zone 1]
        │
        ▼
[TLogProvider (TLogManager.tsx)]   ◄── React Context (Global)
        │  addTransaction()
        │  removeTransaction()
        │  updateTransaction()
        │  importTransactions()
        ▼
[localStorage]  ←→  storage.ts (read/write helpers)
        │
        ├──► transactions[]      → TLog Zone 3 (HistoryTable)
        │
        ├──► assetSummaries[]   → TLog Zone 2 (Summary Cards)
        │    (computed via useMemo: BUY/SELL/DIVIDEND aggregation
        │     incl. avgDividend, latestDividendPrice)
        │
        └──► (future) Dashboard Vis blocks
```

**Milestone Data Flow:**
```
[useMilestones] ←→ localStorage (key: 'planto-milestones')
      │
      ▼
[useMilestoneAnalytics] — คำนวณ currentValue จาก transactions
      │                    ตาม trackingDimension + dividendPeriod
      ▼
[MilestoneSummary / MilestoneChart]
```

---

## 🧭 Page Routing

Navigation จัดการด้วย `useState` ใน `App.tsx` — ไม่มี URL-based routing

| Tab Key | Component | คำอธิบาย |
|---|---|---|
| `dashboard` | `Dashboard.tsx` | Customizable grid dashboard |
| `asset-mart` | `AssetMart/AssetMart.tsx` | Asset browser & follow list |
| `t-log` | `TLog/TLog.tsx` | Transaction input & history |
| `goal` | `Milestones/MilestonesPage.tsx` | Milestone & goal tracking |
| `plans` | `Subscription/SubscriptionJourney.tsx` | Subscription management |
| `profile` | (inline) | User profile & plan status |

---

## ⭐ Key Architectural Decisions

### 1. TLogProvider as Global State
`TLogManager.tsx` เป็น React Context Provider ที่ครอบ `App.tsx` ทั้งหมด ทำให้ทุก component เข้าถึง `transactions` และ `assetSummaries` ได้ผ่าน `useTLog()` hook โดยไม่ต้อง prop-drill

### 2. Per-Module CSS Files
แต่ละ feature module มี `.css` ของตัวเอง (เช่น `Milestones.css`, `AssetMart.css`) แทนที่จะรวมทุกอย่างไว้ที่ `index.css` — เพื่อ isolation และ maintainability

### 3. Computed Summaries via useMemo
`assetSummaries` ใน TLogProvider คำนวณแบบ real-time จาก `transactions` array ผ่าน `useMemo` — ไม่มี denormalized data ใน localStorage

### 4. Milestone Multi-Asset Support
`linkedAssets: string[]` แทน `linkedAssetSymbol: string` (deprecated) — ให้ Milestone ติดตาม assets หลายตัวพร้อมกันได้

---

## ⚖️ Coding Rules ("Iron Laws")

1. **Functional Only:** ห้ามใช้ Class Components. ใช้ React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) เท่านั้น
2. **Tailwind-First + Module CSS:** ใช้ Tailwind CSS v4 เป็นหลัก, ใช้ per-module `.css` สำหรับ complex animations หรือ glassmorphism ที่ Tailwind handle ไม่ดี
3. **Strict Design Tokens:**
   - Primary highlight: `#10b981` (Emerald-500)
   - Foundation: "Obsidian Zen" dark mode (`#0D0D0D` base)
   - Font: ใช้ font stack ที่กำหนดใน `index.css`
4. **Component Isolation:** แต่ละ component ต้องอ่านข้อมูลผ่าน Context/Hook ไม่รับ raw data ผ่าน props ที่ซับซ้อน
5. **No Lib Edits:** ห้ามแก้ไขไฟล์ใน `node_modules`
6. **Snap-to-Grid Precision:** Dashboard layout ต้องใช้ math จาก `gridUtils.ts` เสมอ
7. **Privacy by Default:** ห้าม introduce external cloud/analytics โดยไม่ได้รับ approval

---

## 📋 Agent Working Rules

- **อ่านไฟล์ก่อนเขียน code เสมอ** โดยเฉพาะ `types.ts` และ component ที่เกี่ยวข้อง
- **แก้เฉพาะจุด** — ห้าม rewrite ไฟล์ทั้งหมดถ้าแก้ได้ด้วย targeted edit
- **ถามก่อนถ้าไม่แน่ใจ** — อย่าคาดเดา assumption ที่ส่งผลต่อ data model
- **ภาษาไทย 100%** ในการสื่อสารและ document (ยกเว้น Technical Term / Code)

---

> [!IMPORTANT]
> This file is the **Source of Truth** for the project architecture. Before initiating any task, the Agent must review this document to ensure alignment with the overarching design philosophy and actual file structure.

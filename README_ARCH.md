# 🏛️ README_ARCH - Project Architecture & Source of Truth

**Role:** Senior System Architect
**Status:** Living Document / Source of Truth
**Last Updated:** 2026-05-01

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
| Charts | Recharts |
| State | React Context API (3 Providers) + `useState`/`useMemo` |
| Persistence | `localStorage` (Primary DB) + CSV Import/Export |
| Routing | Tab-based SPA (ไม่ใช้ React Router, ใช้ `useState` ใน `App.tsx`) |
| Data Sources | Mock Data (ปัจจุบัน), `mockPriceHistory.ts` สำหรับ AssetMart charts |

---

## 📂 File Structure (Actual — อัพเดท 2026-05-01)

```
root/
├── _agents/                        # AI Agent workflows & knowledge base
│   └── workflows/                  # Workflow markdown files (/recontext, /mode_plan ฯลฯ)
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   │
│   │   ├── Dashboard.tsx           # ⭐ Entry point Dashboard Page (ดึง components จาก Dashboard/)
│   │   ├── Dashboard.css           # Dashboard page-level styles
│   │   │
│   │   ├── Dashboard/              # Grid-based modular dashboard system
│   │   │   ├── BlocksLayer.tsx         # Renders all DashboardBlocks สำหรับ page หนึ่งๆ
│   │   │   ├── CoordinatesLayer.tsx    # Grid coordinate overlay (เฉพาะ edit/layout mode)
│   │   │   ├── DashboardBlock.tsx      # ⭐ Single block: drag/resize + VisRenderer + VisConfigPopup
│   │   │   ├── DashboardControls.tsx   # FAB buttons (Edit, Layout, Add Block)
│   │   │   ├── DashboardGrid.tsx       # Visual grid lines background
│   │   │   ├── GridConfigurator.tsx    # Popup สำหรับกำหนด columns/rows
│   │   │   ├── NavigationArrows.tsx    # Left/Right arrows สำหรับ multi-page navigation
│   │   │   └── Vis/                    # Visualization sub-system
│   │   │       ├── Vis.css                 # Styles สำหรับ Vis system ทั้งหมด
│   │   │       ├── VisConfigPopup.tsx      # ⭐ Config modal (chart type, data source, filters, live preview)
│   │   │       ├── VisEmptyState.tsx       # Empty placeholder สำหรับ block ที่ยังไม่ configure
│   │   │       ├── VisRenderer.tsx         # ⭐ Router: รับ VisConfig → render chart ที่ถูกต้อง
│   │   │       └── charts/                 # Chart components แยกตามประเภท
│   │   │           ├── VisBarChart.tsx         # Bar Chart + Target Bar (Milestone)
│   │   │           ├── VisHistogram.tsx        # Histogram (distribution)
│   │   │           ├── VisLineChart.tsx        # Line Chart (T-Log timeseries + AssetMart price)
│   │   │           ├── VisPieChart.tsx         # Pie/Donut Chart
│   │   │           ├── VisTable.tsx            # Transaction table view
│   │   │           ├── VisTitleBlock.tsx       # Static title/text block
│   │   │           └── VisTreeMap.tsx          # Treemap (allocation)
│   │   │
│   │   ├── AssetMart.tsx           # Entry point AssetMart (ดึง components จาก AssetMart/)
│   │   ├── AssetMart.css           # AssetMart page-level styles (root level)
│   │   │
│   │   ├── AssetMart/              # Market Data & Asset Browser module
│   │   │   ├── AssetMart.tsx           # BentoGrid hub + routing logic ภายใน
│   │   │   ├── AssetMart.css           # AssetMart-specific styles
│   │   │   ├── BentoGrid.tsx           # Asset category grid (Crypto, Stock, ฯลฯ)
│   │   │   ├── AssetInventory.tsx      # Asset list per category
│   │   │   ├── AssetDetail.tsx         # Full detail view (price, chart, metrics)
│   │   │   └── FollowList.tsx          # User's tracked/followed assets
│   │   │
│   │   ├── TLog/                   # Transaction Logging Module
│   │   │   ├── TLog.tsx                # Entry point (thin wrapper)
│   │   │   ├── TLog_zone1_Form.tsx     # ⭐ Input form (BUY/SELL/DIVIDEND, fee 3D, Quick Fill listener)
│   │   │   ├── TLog_zone2_Summary.tsx  # Asset summary cards (computed from TLogContext)
│   │   │   ├── TLog_zone3_History.tsx  # History view wrapper (tabs + pagination)
│   │   │   ├── HistoryTable.tsx        # Transaction history table + inline edit/delete + Privacy filter
│   │   │   ├── HistoryPagination.tsx   # Pagination logic component
│   │   │   ├── QuickFillSetup.tsx      # ⭐ Global modal สำหรับ Create/Edit Quick Fill shortcuts
│   │   │   └── mockData.ts             # Dev mock transactions
│   │   │
│   │   ├── Milestones/             # Goal & Milestone Tracking Module
│   │   │   ├── MilestonesPage.tsx          # Entry point + list of milestone cards
│   │   │   ├── MilestoneCard.tsx           # Single milestone card (summary view)
│   │   │   ├── MilestoneDetailView.tsx     # Full detail: analytics + tasks tabs
│   │   │   ├── MilestoneSummary.tsx        # Analytics sub-view (chart, progress rings)
│   │   │   ├── MilestoneTasks.tsx          # Sub-checklist CRUD management
│   │   │   ├── MilestoneChart.tsx          # Dual-axis combo chart (Recharts)
│   │   │   ├── MilestoneAnalyticsDrawer.tsx# Slide-in analytics panel
│   │   │   └── Milestones.css
│   │   │
│   │   ├── Settings/               # Global Settings Module (เพิ่มใหม่)
│   │   │   ├── SettingsPage.tsx        # Settings page: Timezone, Privacy toggles, Danger Zone (Nuke)
│   │   │   └── Settings.css
│   │   │
│   │   ├── Subscription/           # Subscription & Billing Module
│   │   │   ├── SubscriptionJourney.tsx     # Multi-step flow controller
│   │   │   ├── SubscriptionSelector.tsx    # Plan selection page (grid layout)
│   │   │   ├── PricingCard.tsx             # Individual plan card (brightness-based hover)
│   │   │   ├── CheckoutPage.tsx            # Checkout & confirmation
│   │   │   ├── SuccessPage.tsx             # Post-purchase success
│   │   │   ├── planData.ts                 # Centralized plan configs (incl. Free Plan)
│   │   │   ├── hooks/
│   │   │   │   └── useSubscription.ts      # Subscription state hook
│   │   │   └── utils/
│   │   │       └── billingUtils.ts         # Formatting & calculation helpers
│   │   │
│   │   ├── UI/                     # Shared Design System Components
│   │   │   ├── ZenField.tsx            # Reusable styled input field wrapper
│   │   │   └── ZenDropdown.tsx         # Multi-level custom dropdown (BUY/SELL/DIVIDEND+sub)
│   │   │
│   │   ├── Header.tsx              # ⭐ Global glassmorphism navigation bar
│   │   └── Header.css              #    (รวม QuickFill hover dropdown ที่ nav T-Log)
│   │
│   ├── hooks/                      # Global Custom Hooks & Context Providers
│   │   ├── TLogManager.tsx             # ⭐ TLogContext Provider + useTLog() hook
│   │   ├── QuickFillManager.tsx        # ⭐ QuickFillContext Provider + useQuickFill() hook
│   │   ├── SettingsManager.tsx         # ⭐ SettingsContext Provider + useSettings() hook
│   │   ├── useDashboard.ts             # Dashboard block layout state + localStorage persistence
│   │   ├── useBlockInteraction.ts      # Drag/resize/snap logic สำหรับ DashboardBlock
│   │   ├── useMilestones.ts            # Milestone CRUD + localStorage
│   │   ├── useMilestoneAnalytics.ts    # Calculated analytics สำหรับ Milestone progress
│   │   └── useVisData.ts               # ⭐ Data pipeline: VisConfig → VisData (tlog/milestone/assetmart)
│   │
│   ├── utils/                      # Pure Helper Functions
│   │   ├── storage.ts              # localStorage CRUD สำหรับ transactions (in-memory cache)
│   │   ├── csvUtils.ts             # CSV import/export logic
│   │   ├── assetMapping.ts         # Asset symbol → category mapping
│   │   ├── gridUtils.ts            # Grid layout math helpers (isAreaAvailable, findFirstAvailableSpace)
│   │   └── mockPriceHistory.ts     # Mock price history generator สำหรับ AssetMart line chart
│   │
│   ├── types.ts                    # ⭐ Centralized TypeScript interfaces (ดูหัวข้อ Data Models)
│   ├── index.css                   # Global styles (Tailwind v4 variables, Zen design tokens)
│   ├── App.css                     # App shell styles
│   └── App.tsx                     # ⭐ Root: Provider tree + Tab router + currentPlanId state
│
├── PRD.md                          # Product Requirements Document ("The What")
├── ADD.md                          # Architecture Design Document ("The How")
├── README_ARCH.md                  # This file — Source of Truth
├── decisions.md                    # ADR log (Architecture Decision Records)
├── error.md                        # Known bugs & error log
├── dashboard.txt                   # Dashboard layout notes/scratch
└── package.json
```

---

## 🗂️ Core Data Models (`src/types.ts`)

### `Transaction`
ข้อมูลหลักของระบบ — บันทึกทุก Financial Event

```typescript
type Transaction = {
  id: string;
  date: string;               // ISO 8601 + time: "2026-04-30 14:30:00"
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  frequency?: '1m' | '3m' | '6m' | '1y' | 'OTHER'; // สำหรับ DIVIDEND
  asset: string;              // ตัวย่อ เช่น 'BTC', 'AAPL'
  category: string;           // 'STOCK' | 'CRYPTO' | 'BOND' | 'FUND' | 'COMMODITY' | 'REALESTATE' | 'OTHER'
  amount: number;             // จำนวนหน่วย
  price: number;              // ราคาต่อหน่วย / มูลค่า Dividend
  currency: 'THB' | 'USD';
  fee: number;                // รวมสุทธิ (= fee_vat + fee_discount หรือ manual override)
  fee_vat?: number;           // VAT 7% (optional)
  fee_discount?: number;      // ส่วนลด (optional)
  notes: string;
};
```

### `QuickFillItem`
Template สำหรับ Quick Fill shortcuts — pre-populate TLog Zone 1 form

```typescript
interface QuickFillItem {
  id: string;
  name: string;               // ชื่อแสดงผล เช่น "เติมพอร์ตประจำเดือน"
  icon?: string;              // Emoji หรือ Asset Symbol (ถ้า > 2 chars = logo mode)
  type?: 'BUY' | 'SELL' | 'DIVIDEND';
  frequency?: '1m' | '3m' | '6m' | '1y' | 'OTHER';
  asset?: string;
  category?: string;
  amount?: number;
  price?: number;
  currency?: 'THB' | 'USD';
  fee?: number;
  fee_vat?: number;
  fee_discount?: number;
  notes?: string;
}
```

### `Milestone`
เป้าหมายทางการเงิน — รองรับ Multi-Asset Tracking

```typescript
interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'money' | 'asset' | 'dividend';
  targetValue: number;
  currentValue?: number;      // Calculated from T-Log (ไม่ store)
  unit: string;
  linkedAssets: string[];     // Multi-asset list เช่น ['BTC', 'ETH']
  linkedAssetSymbol?: string; // @deprecated — ใช้เพื่อ migration เท่านั้น
  trackingDimension?: 'Cash' | 'Unit' | 'Dividend';
  dividendPeriod?: '1m' | '3m' | '6m' | '1y';
  precision?: number;
  tags: string[];
  subChecklist: SubChecklistItem[];
  createdAt: string;
}
```

### `DashboardBlock` + `VisConfig`
Layout block บน Dashboard พร้อม Visualization configuration

```typescript
type DashboardBlock = {
  id: string;
  x: number; y: number;       // Grid position (0-indexed)
  w: number; h: number;       // Grid size (units)
  type: VisType;              // ประเภท chart ที่แสดง
  title: string;
  page: number;               // Dashboard page (0, 1, 2)
  visConfig?: VisConfig;      // Full visualization config
};

// VisType ที่รองรับ:
type VisType = 'pie' | 'bar' | 'target-bar' | 'line' | 'treemap' | 'histogram' | 'table' | 'title' | 'empty';

// Data sources:
type VisDataSource = 'tlog' | 'milestone' | 'assetmart';
```

### `SubscriptionPlan`
แผน Subscription ที่รองรับ

```typescript
type SubscriptionPlan = {
  id: string;                 // เช่น 'plan-free', 'plan-standard', 'plan-vip'
  title: string;
  description: string;
  features: string[];
  billing: { monthlyPrice: number; yearlyPrice: number; currency: string; };
  type: 'standard' | 'group' | 'vip';
  rank: number;
  isFeatured?: boolean;
};
```

---

## 🌐 Global Context Providers (Provider Tree ใน `App.tsx`)

```
<SettingsProvider>          ← outermost: privacy mode, timezone
  <TLogProvider>            ← transactions + assetSummaries (computed)
    <QuickFillProvider>     ← quick fill shortcuts list
      <App shell>
        <Header />
        <main>{renderContent()}</main>
        <QuickFillSetup />  ← Global modal (rendered once, controlled via CustomEvent)
```

### 1. `TLogProvider` (`TLogManager.tsx`)
- expose: `transactions` (sorted desc), `assetSummaries` (computed), `isLoading`
- methods: `addTransaction`, `removeTransaction`, `updateTransaction`, `importTransactions`
- storage key: `planto_transactions`

### 2. `QuickFillProvider` (`QuickFillManager.tsx`)
- expose: `quickFills`, CRUD methods, `applyQuickFill`
- `applyQuickFill(item)` → dispatch `CustomEvent('planto_apply_quick_fill')` → Zone 1 Form รับ
- storage key: `planto_quick_fills`

### 3. `SettingsProvider` (`SettingsManager.tsx`)
- expose: `privacyHideNumbers`, `privacyHideText`, `timezoneOffset`, setters, `resetAllData`
- `resetAllData()` → clear all known localStorage keys → `window.location.reload()`
- storage key: `planto_settings`
- รู้จัก storage keys ทั้งหมดของ app เพื่อ Nuke: `planto_transactions`, `planto_milestones`, `planto_followed_assets`, `planto_quick_fills`, `planto-zen-dashboard-v3`, `planto_tlog_last_category`

---

## 🔄 Data Flow

### Transaction Flow
```
[User Input — TLog Zone 1 Form]
        │ submit
        ▼
[TLogProvider.addTransaction()]   ← React Context (Global)
        │
        ├─→ [localStorage: planto_transactions]  ← via storage.ts (in-memory cache)
        │
        ├─→ transactions[]       → TLog Zone 3 (HistoryTable) + Zone 2 (Summary Cards)
        │
        └─→ assetSummaries[]     (computed via useMemo: BUY+/SELL-/DIVIDEND tracking)
```

### Quick Fill Flow
```
[Header: hover T-Log nav]
        │ แสดง QuickFill dropdown
        ▼
[User คลิก QuickFill item]
        │ applyQuickFill(item)
        ▼
[CustomEvent: 'planto_apply_quick_fill']
        │
        ▼
[TLog_zone1_Form: event listener]
        │ pre-populate form fields
        ▼
[User แก้ไขและ submit ตามปกติ]
```

### Dashboard Visualization Flow
```
[DashboardBlock.visConfig (VisConfig)]
        │
        ▼
[VisRenderer.tsx]
        │ ใช้ useVisData() hook
        ▼
[useVisData.ts]
        │  รับ config + transactions + milestones + calculateProgress
        │  ↳ dataSource: 'tlog'      → filter/group transactions → VisData
        │  ↳ dataSource: 'milestone' → calculateProgress per milestone → VisData
        │  ↳ dataSource: 'assetmart' → read followed assets localStorage → mockPriceHistory
        ▼
[VisData output]  → route ไปยัง chart component ที่ถูกต้อง
```

### Milestone Flow
```
[useMilestones] ←→ localStorage (key: planto_milestones)
      │
      ▼
[useMilestoneAnalytics.calculateProgress(linkedAssets, trackingDimension, dividendPeriod)]
      │  อ่านจาก transactions ใน TLogContext
      ▼
[MilestoneSummary / MilestoneChart / useVisData (target-bar)]
```

---

## 🧭 Page Routing

Navigation จัดการด้วย `useState<string>` ใน `App.tsx` — ไม่มี URL-based routing

| Tab Key | Component Rendered | คำอธิบาย |
|---|---|---|
| `dashboard` | `Dashboard.tsx` | Customizable grid dashboard (3 pages) |
| `asset-mart` | `AssetMart/AssetMart.tsx` | Asset browser & follow list |
| `t-log` | `TLog/TLog.tsx` | Transaction input & history |
| `goal` | `Milestones/MilestonesPage.tsx` | Milestone & goal tracking |
| `plans` | `Subscription/SubscriptionJourney.tsx` | Subscription management |
| `profile` | (inline JSX ใน App.tsx) | User profile & plan status |
| `settings` | `Settings/SettingsPage.tsx` | Global settings (Privacy, Timezone, Nuke) |

### Navigation Reset Events (CustomEvent via `window.dispatchEvent`)
| Event | ผลลัพธ์ |
|---|---|
| `planto_reset_asset_mart` | Reset AssetMart กลับ main view |
| `planto_reset_milestones` | Reset Milestones กลับ list view |
| `planto_reset_subscription` | Reset Subscription กลับ step 1 |
| `planto_apply_quick_fill` | TLog Zone 1 Form: pre-populate fields (detail = QuickFillItem) |
| `planto_open_quickfill_setup` | เปิด QuickFillSetup modal (detail = QuickFillItem หรือ null = new) |

---

## 🗃️ localStorage Keys Registry

| Key | Owner | เนื้อหา |
|---|---|---|
| `planto_transactions` | `storage.ts` + `TLogManager` | `Transaction[]` |
| `planto_milestones` | `useMilestones` | `Milestone[]` |
| `planto_followed_assets` | `AssetMart/FollowList` | Asset objects `{id, symbol, name, price, roi, category}[]` |
| `planto_quick_fills` | `QuickFillManager` | `QuickFillItem[]` |
| `planto_settings` | `SettingsManager` | `{privacyHideNumbers, privacyHideText, timezoneOffset}` |
| `planto-zen-dashboard-v3` | `useDashboard` | `{columns, rows, blocks: DashboardBlock[]}` |
| `planto_tlog_last_category` | `TLog_zone1_Form` | string — category ล่าสุดที่ใช้ (UX memory) |

---

## ⭐ Key Architectural Decisions

### 1. Three-Provider Global State
`App.tsx` ครอบด้วย 3 Context Providers เรียงลำดับ: `SettingsProvider > TLogProvider > QuickFillProvider` — ทุก component เข้าถึงผ่าน hooks: `useSettings()`, `useTLog()`, `useQuickFill()`

### 2. CustomEvent Bus สำหรับ Cross-Component Communication
Component ที่ไม่มี parent-child relationship ใช้ `window.dispatchEvent(new CustomEvent(...))` แทน prop-drilling ยาว เช่น Header → TLog Zone 1, Header → QuickFillSetup modal

### 3. Per-Module CSS Files
แต่ละ feature module มี `.css` ของตัวเอง (Milestones.css, AssetMart.css, Vis.css ฯลฯ) เพื่อ isolation — global tokens อยู่ใน `index.css`

### 4. Computed Summaries via useMemo
`assetSummaries` ใน TLogProvider คำนวณแบบ real-time จาก `transactions[]` ผ่าน `useMemo` — ไม่มี denormalized data ใน localStorage

### 5. useVisData — Unified Data Pipeline
Hook เดียว (`useVisData.ts`) รับ `VisConfig` และ raw data แล้ว output `VisData` ที่ type-safe — แยก logic ออกจาก chart components ทั้งหมด รองรับ 3 data sources และ 7+ chart types

### 6. Fee 3-Dimension Structure
`Transaction.fee` = สุทธิรวม, `fee_vat` = VAT 7%, `fee_discount` = ส่วนลด — Zone 1 Form auto-sum VAT+Discount→Total แต่ถ้า user แก้ Total โดยตรง จะ override (`isTotalOverridden` flag)

### 7. Dashboard Multi-Page (3 Pages)
Dashboard มี 3 หน้าแยกกัน ใช้ CSS `translateX` sliding — blocks ถูก store พร้อม `page: number` field, storage key ใช้ `-v3` suffix เพื่อ schema versioning

### 8. Privacy Mode (Settings)
`SettingsProvider` expose `privacyHideNumbers` และ `privacyHideText` — TLog Zone 2, 3 อ่าน context นี้เพื่อ mask ข้อมูลก่อน render (ไม่กระทบ data ใน localStorage)

---

## ⚖️ Coding Rules ("Iron Laws")

1. **Functional Only:** ห้ามใช้ Class Components. ใช้ React Hooks เท่านั้น
2. **Tailwind-First + Module CSS:** ใช้ Tailwind CSS v4 เป็นหลัก, ใช้ per-module `.css` สำหรับ animations/glassmorphism ซับซ้อน
3. **Strict Design Tokens:**
   - Primary highlight: `#10b981` (Emerald-500)
   - Foundation: "Obsidian Zen" dark mode (`#0D0D0D` base, `#121214` surface)
   - Font: ใช้ font stack ที่กำหนดใน `index.css`
4. **Component Isolation:** แต่ละ component อ่านข้อมูลผ่าน Context/Hook ไม่รับ raw data ผ่าน props ที่ซับซ้อน
5. **No Lib Edits:** ห้ามแก้ไขไฟล์ใน `node_modules`
6. **Snap-to-Grid Precision:** Dashboard layout ต้องใช้ math จาก `gridUtils.ts` เสมอ
7. **Privacy by Default:** ห้าม introduce external cloud/analytics โดยไม่ได้รับ approval
8. **Read Before Write:** อ่านไฟล์ที่เกี่ยวข้องก่อนเขียน code เสมอ โดยเฉพาะ `types.ts`

---

## 📋 Agent Working Rules

- **อ่านไฟล์ก่อนเขียน code เสมอ** โดยเฉพาะ `types.ts` และ component ที่เกี่ยวข้อง
- **แก้เฉพาะจุด** — ห้าม rewrite ไฟล์ทั้งหมดถ้าแก้ได้ด้วย targeted edit
- **ถามก่อนถ้าไม่แน่ใจ** — อย่าคาดเดา assumption ที่ส่งผลต่อ data model
- **ภาษาไทย 100%** ในการสื่อสารและ document (ยกเว้น Technical Term / Code)
- **อย่าเพิ่ม feature เกินกว่าที่ถูกขอ** — ทุกบรรทัดต้อง trace กลับไปหา request ของ user ได้

---

> [!IMPORTANT]
> This file is the **Source of Truth** for the project architecture. Before initiating any task, the Agent must review this document to ensure alignment with the overarching design philosophy and actual file structure.

# 🗺️ FEATURE LINEAGE — PLANTO
**Feature Traceability & Impact Map**
**Last Updated:** 2026-05-02

> เอกสารนี้บันทึกว่าแต่ละ Feature มีโค้ดอยู่ที่ไหน และถ้าแก้ไขที่ใดจะกระทบอะไรบ้าง

---

## คำศัพท์ที่ใช้
- **Feature Lineage** = แผนที่ความเชื่อมโยงของ Feature ↔ ไฟล์โค้ด
- **Impact Map** = เมื่อแก้ไขจุดใด จุดใดบ้างที่ได้รับผลกระทบ
- `[R]` = อ่านข้อมูล (Read)
- `[W]` = เขียน/แก้ไขข้อมูล (Write)
- `[UI]` = แสดงผล UI
- `[TYPE]` = ใช้ TypeScript Type

---

## 📦 F01 — Transaction (Core Data Model)

**คำอธิบาย:** ข้อมูลหลักทุก Financial Event — BUY / SELL / DIVIDEND

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `[TYPE]` นิยาม `Transaction` interface |
| `src/utils/storage.ts` | `[W][R]` CRUD ใน localStorage (`planto_transactions`) |
| `src/hooks/TLogManager.tsx` | `[W][R]` Context Provider — expose `transactions[]`, methods |
| `src/components/TLog/TLog_zone1_Form.tsx` | `[W][UI]` Form กรอกข้อมูล Transaction ใหม่ |
| `src/components/TLog/HistoryTable.tsx` | `[R][UI]` แสดงตารางประวัติ + Inline Edit/Delete |
| `src/components/TLog/TLog_zone2_Summary.tsx` | `[R][UI]` Summary Cards ต่อ Asset |
| `src/components/TLog/TLog_zone3_History.tsx` | `[R][UI]` Wrapper History + Tabs + Pagination |
| `src/components/TLog/HistoryPagination.tsx` | `[R][UI]` Logic Pagination |
| `src/utils/csvUtils.ts` | `[W][R]` CSV Export/Import (`Transaction[]`) |
| `src/hooks/useVisData.ts` | `[R]` pipeline ข้อมูลไปยัง Dashboard Charts |
| `src/hooks/useInsightData.ts` | `[R]` คำนวณ metrics สำหรับ InsightPort |
| `src/hooks/useMilestoneAnalytics.ts` | `[R]` คำนวณ progress ของ Milestone จาก transactions |

### Impact เมื่อแก้ไข `Transaction` type ใน `types.ts`
```
types.ts (Transaction)
  ├── TLogManager.tsx      — ต้องอัพเดท addTransaction(), updateTransaction()
  ├── TLog_zone1_Form.tsx  — ต้องอัพเดท formData state + handleSubmit()
  ├── HistoryTable.tsx     — ต้องอัพเดท columns + editValues state
  ├── csvUtils.ts          — ต้องอัพเดท CSV_HEADERS + export/parse logic
  ├── useVisData.ts        — อาจกระทบ VisTableRow mapping
  └── useInsightData.ts    — อาจกระทบ assetStats calculation
```

### Fields ปัจจุบันและที่มา
| Field | เพิ่มเมื่อ | ใช้ที่ |
|---|---|---|
| `id, date, type, asset, category, amount, price, currency, fee, notes` | Initial | ทุกที่ |
| `fee_vat, fee_discount` | Fee 3D feature | Zone1Form, HistoryTable |
| `frequency` | DIVIDEND sub-type | Zone1Form, HistoryTable |
| `broker` | Broker feature (May 2026) | Zone1Form, HistoryTable, csvUtils, QuickFillSetup, QuickFillItem |

---

## 📦 F02 — Quick Fill (Transaction Templates)

**คำอธิบาย:** Shortcut สำหรับกรอก Transaction ซ้ำๆ — เก็บ Template ไว้ใช้ซ้ำ

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `[TYPE]` นิยาม `QuickFillItem` interface |
| `src/hooks/QuickFillManager.tsx` | `[W][R]` Context Provider + `applyQuickFill()` → CustomEvent |
| `src/components/TLog/QuickFillSetup.tsx` | `[W][UI]` Modal Create/Edit QuickFill |
| `src/components/Header.tsx` | `[R][UI]` Hover dropdown บน T-Log nav → แสดง QuickFill list |
| `src/components/TLog/TLog_zone1_Form.tsx` | `[R]` Listener `planto_apply_quick_fill` → pre-populate form |
| `src/App.tsx` | `[UI]` Render `<QuickFillSetup />` as Global Modal |

### Impact เมื่อแก้ไข
```
QuickFillItem (types.ts)
  ├── QuickFillManager.tsx   — storage schema เปลี่ยน (planto_quick_fills)
  ├── QuickFillSetup.tsx     — form fields + handleSave() ต้องอัพเดท
  ├── TLog_zone1_Form.tsx    — handleQuickFill() event handler ต้องอัพเดท
  └── Header.tsx             — UI dropdown (ถ้าเพิ่ม field ที่แสดงผล)

CustomEvent 'planto_apply_quick_fill'
  ├── QuickFillManager.tsx   — dispatch (ฝั่ง sender)
  └── TLog_zone1_Form.tsx    — listener (ฝั่ง receiver)

CustomEvent 'planto_open_quickfill_setup'
  ├── Header.tsx             — dispatch (เปิด modal)
  └── QuickFillSetup.tsx     — listener (รับและเปิด modal)
```

---

## 📦 F03 — Dashboard (Customizable Grid)

**คำอธิบาย:** Grid Dashboard 3 หน้า, drag/resize Blocks, หลาย Chart types

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `[TYPE]` `DashboardBlock`, `VisConfig`, `VisType` |
| `src/hooks/useDashboard.ts` | `[W][R]` Block layout state + localStorage (`planto-zen-dashboard-v3`) |
| `src/hooks/useBlockInteraction.ts` | drag/resize/snap logic |
| `src/hooks/useVisData.ts` | `[R]` data pipeline: VisConfig → VisData (ทุก chart types) |
| `src/components/Dashboard.tsx` | Entry point |
| `src/components/Dashboard/BlocksLayer.tsx` | Render DashboardBlocks |
| `src/components/Dashboard/DashboardBlock.tsx` | Single block: interaction + VisRenderer |
| `src/components/Dashboard/VisConfigPopup.tsx` | Config modal |
| `src/components/Dashboard/Vis/VisRenderer.tsx` | Router: VisConfig → Chart component |
| `src/components/Dashboard/Vis/charts/*` | Chart components (7 types) |
| `src/utils/gridUtils.ts` | Math helpers สำหรับ grid layout |

### Impact เมื่อแก้ไข
```
DashboardBlock / VisConfig (types.ts)
  ├── useDashboard.ts        — schema ใน localStorage เปลี่ยน → ต้อง bump storage key
  ├── VisConfigPopup.tsx     — UI config fields
  ├── VisRenderer.tsx        — routing logic
  └── useVisData.ts          — data processing

VisType เพิ่ม/ลด
  ├── types.ts               — เพิ่มใน union type
  ├── VisRenderer.tsx        — เพิ่ม case
  ├── VisConfigPopup.tsx     — เพิ่ม option
  └── สร้าง chart component ใหม่ใน charts/

useVisData.ts (data pipeline)
  ├── VisRenderer.tsx        — consume output
  └── ทุก chart component    — consume VisData
```

### localStorage Key: `planto-zen-dashboard-v3`
> ⚠️ ถ้าเปลี่ยน `DashboardBlock` schema → **ต้อง bump version** เป็น `-v4` และ clear เดิม

---

## 📦 F04 — Asset Mart (Asset Browser)

**คำอธิบาย:** Browser สำรวจ Asset แต่ละ category, ดู detail, Follow Asset

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/components/AssetMart/AssetMart.tsx` | Entry + routing ภายใน |
| `src/components/AssetMart/BentoGrid.tsx` | หน้า category grid |
| `src/components/AssetMart/AssetInventory.tsx` | Asset list per category |
| `src/components/AssetMart/AssetDetail.tsx` | Detail page + Follow button |
| `src/components/AssetMart/FollowList.tsx` | Follow List page |
| `src/utils/mockPriceHistory.ts` | Mock price chart data |
| `src/utils/translations.ts` | localized strings สำหรับ AssetMart |

### localStorage Key: `planto_followed_assets`
> ⚠️ FollowList เขียน `{id, symbol, name, price, roi, category}[]`
> ทั้ง `TLog_zone1_Form.tsx`, `QuickFillSetup.tsx`, `useVisData.ts` อ่าน key นี้โดยตรง

### Impact เมื่อแก้ไข
```
FollowList schema (planto_followed_assets)
  ├── TLog_zone1_Form.tsx  — Asset suggestion dropdown
  ├── QuickFillSetup.tsx   — Asset suggestion dropdown
  └── useVisData.ts        — assetmart data source (line chart)

AssetDetail (Follow button)
  └── FollowList.tsx       — sync กับ localStorage key เดียวกัน
```

---

## 📦 F05 — Insight Port (Analytics Report)

**คำอธิบาย:** หน้า Analytics ลึก — PnL, Dividend, Allocation, Trend

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/components/InsightPort/InsightPort.tsx` | Entry + UI ทั้งหมด |
| `src/hooks/useInsightData.ts` | Data hook: filter → metrics, assetStats, trendData, activityData |
| `src/data/marketData.ts` | Mock market price (`getMarketPrice()`) |

### Impact เมื่อแก้ไข
```
Transaction (types.ts) — field ใหม่
  └── useInsightData.ts  — อาจต้องอัพเดท metrics calculation

useInsightData.ts
  └── InsightPort.tsx    — consume ทุก output

marketData.ts (getMarketPrice)
  └── useInsightData.ts  — unrealizedPnL calculation
```

> **Note:** InsightPort ไม่ได้อยู่ใน `README_ARCH.md` (เพิ่งเพิ่ม) — ควร update Arch doc

---

## 📦 F06 — Milestones (Goal Tracking)

**คำอธิบาย:** ตั้งเป้าหมายการเงิน, Link Assets, ติดตาม Progress

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `[TYPE]` `Milestone`, `SubChecklistItem` |
| `src/hooks/useMilestones.ts` | `[W][R]` CRUD + localStorage (`planto_milestones`) |
| `src/hooks/useMilestoneAnalytics.ts` | `calculateProgress()` — อ่านจาก `useTLog()` |
| `src/components/Milestones/MilestonesPage.tsx` | Entry + list |
| `src/components/Milestones/MilestoneCard.tsx` | Single card |
| `src/components/Milestones/MilestoneDetailView.tsx` | Detail: analytics + tasks tabs |
| `src/components/Milestones/MilestoneSummary.tsx` | Analytics sub-view |
| `src/components/Milestones/MilestoneTasks.tsx` | Sub-checklist CRUD |
| `src/components/Milestones/MilestoneChart.tsx` | Dual-axis chart |
| `src/components/Milestones/MilestoneAnalyticsDrawer.tsx` | Slide-in analytics |

### Impact เมื่อแก้ไข
```
Milestone (types.ts)
  ├── useMilestones.ts          — CRUD + localStorage schema
  ├── useMilestoneAnalytics.ts  — calculateProgress() parameters
  └── useVisData.ts             — milestone data source (target-bar chart)

Transaction (types.ts) — ส่งผลต่อ Milestone ผ่าน
  └── useMilestoneAnalytics.ts  — อ่าน transactions เพื่อคำนวณ progress
```

---

## 📦 F07 — Settings

**คำอธิบาย:** Timezone, Privacy Mode, Language, Dark/Light Theme, Nuke

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/hooks/SettingsManager.tsx` | Context Provider — expose ทุก settings + `resetAllData()` |
| `src/components/Settings/SettingsPage.tsx` | UI Settings |

### Impact เมื่อแก้ไข
```
SettingsManager.tsx — เพิ่ม setting ใหม่
  ├── SettingsPage.tsx       — เพิ่ม UI control
  └── component ที่ consume — ต้อง useSettings() และอ่าน field ใหม่

resetAllData() — STORAGE_KEYS registry
  └── ถ้าเพิ่ม localStorage key ใหม่ → ต้องเพิ่มใน STORAGE_KEYS ใน SettingsManager.tsx

privacy (privacyHideNumbers / privacyHideText)
  ├── HistoryTable.tsx         — mask ตัวเลขและข้อความ
  └── TLog_zone2_Summary.tsx   — mask ตัวเลข

language ('th' | 'en')
  ├── translations.ts          — string dictionary
  └── ทุก component ที่ใช้ useSettings() + translations[language]

theme ('dark' | 'light')
  ├── SettingsManager.tsx      — set data-theme attribute บน document
  └── index.css / per-module .css — CSS vars ตาม [data-theme]
```

---

## 📦 F08 — Localization (i18n)

**คำอธิบาย:** รองรับ TH/EN แบบ dynamic switching

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/utils/translations.ts` | Dictionary `{th:{...}, en:{...}}` |
| `src/hooks/SettingsManager.tsx` | `language` state |

### Components ที่ consume translations
`Header.tsx`, `TLog_zone1_Form.tsx`, `HistoryTable.tsx`, `TLog_zone2_Summary.tsx`, `TLog_zone3_History.tsx`, `QuickFillSetup.tsx`, `SettingsPage.tsx`, `MilestonesPage.tsx`, `AssetMart/` (BentoGrid, AssetInventory, AssetDetail, FollowList), `App.tsx` (profile inline)

### Impact เมื่อแก้ไข
```
translations.ts — เพิ่ม key ใหม่
  └── ต้องเพิ่มทั้ง th และ en พร้อมกัน (TypeScript จะ error ถ้า key ไม่ตรงกัน)

translations.ts — เปลี่ยนชื่อ key
  └── ทุก component ที่ใช้ t.[old_key] ต้องอัพเดท
```

---

## 📦 F09 — Subscription & Plans

**คำอธิบาย:** Plan selection, Checkout, VIP code

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `[TYPE]` `SubscriptionPlan`, `BillingOption` |
| `src/components/Subscription/planData.ts` | Centralized plan configs |
| `src/components/Subscription/SubscriptionJourney.tsx` | Multi-step flow controller |
| `src/components/Subscription/SubscriptionSelector.tsx` | Plan grid + VIP reveal |
| `src/components/Subscription/PricingCard.tsx` | Single plan card |
| `src/components/Subscription/CheckoutPage.tsx` | Checkout + confirmation |
| `src/components/Subscription/SuccessPage.tsx` | Post-purchase |
| `src/components/Subscription/hooks/useSubscription.ts` | Subscription state hook |
| `src/App.tsx` | `currentPlanId` state + pass to SubscriptionJourney |

### Impact เมื่อแก้ไข
```
planData.ts — เพิ่ม/แก้ plan
  ├── SubscriptionSelector.tsx  — Grid layout (ปัจจุบัน 4 cols สำหรับ STATIC_PLANS)
  └── PricingCard.tsx           — Pricing display

currentPlanId (App.tsx state)
  ├── SubscriptionJourney.tsx   — receives as prop
  ├── SubscriptionSelector.tsx  — isCurrent logic
  └── App.tsx profile tab       — แสดงชื่อ plan
```

---

## 📦 F10 — Global Navigation (Header)

**คำอธิบาย:** Navigation bar, Theme toggle, Profile/Settings buttons, QuickFill dropdown

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/components/Header.tsx` | Navigation + QuickFill dropdown + Theme toggle |
| `src/hooks/QuickFillManager.tsx` | `[R]` quickFills list + applyQuickFill |
| `src/hooks/SettingsManager.tsx` | `[R]` language, theme, setTheme |

### Tab Keys & Components
| Tab Key | Component |
|---|---|
| `dashboard` | `Dashboard.tsx` |
| `asset-mart` | `AssetMart/AssetMart.tsx` |
| `t-log` | `TLog/TLog.tsx` |
| `insight-port` | `InsightPort/InsightPort.tsx` |
| `goal` | `Milestones/MilestonesPage.tsx` |
| `plans` | `Subscription/SubscriptionJourney.tsx` |
| `profile` | inline JSX ใน `App.tsx` |
| `settings` | `Settings/SettingsPage.tsx` |

### Impact เมื่อเพิ่ม Tab ใหม่
```
App.tsx          — เพิ่ม case ใน renderContent() switch
Header.tsx       — เพิ่มใน navItems[]
translations.ts  — เพิ่ม nav.newTab ใน th และ en
```

---

## 📦 F11 — Privacy Mode

**คำอธิบาย:** ซ่อนตัวเลข/ข้อความสำหรับ Screen Share

### Components ที่รับผลกระทบ
| Component | ซ่อน |
|---|---|
| `HistoryTable.tsx` | date, type, asset, broker, numbers, currency, notes |
| `TLog_zone2_Summary.tsx` | amount, dividend numbers |
| `InsightPort.tsx` | (ไม่แน่ใจ — ควรตรวจสอบ) |

### Impact
```
เพิ่ม privacyHideX ตัวใหม่ใน SettingsManager.tsx
  ├── SettingsPage.tsx    — เพิ่ม toggle UI
  └── ทุก component       — ต้อง consume ค่าใหม่และ mask ข้อมูล
```

---

## 📦 F12 — Fee 3-Dimension

**คำอธิบาย:** fee = สุทธิ, fee_vat = VAT 7%, fee_discount = ส่วนลด; Auto-sum logic

### ไฟล์ที่เกี่ยวข้อง
| ไฟล์ | บทบาท |
|---|---|
| `src/types.ts` | `fee`, `fee_vat?`, `fee_discount?` fields |
| `src/components/TLog/TLog_zone1_Form.tsx` | Auto-sum useEffect + `isTotalOverridden` flag |
| `src/components/TLog/HistoryTable.tsx` | Inline edit 3 fields + display sub-labels |
| `src/utils/csvUtils.ts` | Export only `fee` (net total) |

---

## 🔗 CustomEvent Bus (Cross-Component Communication)

| Event Name | Sender | Receiver | Payload |
|---|---|---|---|
| `planto_apply_quick_fill` | `QuickFillManager.tsx` | `TLog_zone1_Form.tsx` | `QuickFillItem` |
| `planto_open_quickfill_setup` | `Header.tsx`, `Header.tsx` (add btn) | `QuickFillSetup.tsx` | `QuickFillItem | null` |
| `planto_reset_asset_mart` | `Header.tsx` | `AssetMart/AssetMart.tsx` | — |
| `planto_reset_milestones` | `Header.tsx` | `MilestonesPage.tsx` | — |
| `planto_reset_subscription` | `Header.tsx` | `SubscriptionJourney.tsx` | — |

---

## 🗃️ localStorage Keys & Owners

| Key | Owner | Type | อ่านโดย |
|---|---|---|---|
| `planto_transactions` | `storage.ts` + `TLogManager.tsx` | `Transaction[]` | TLogManager, HistoryTable, Zone1Form (indirect) |
| `planto_milestones` | `useMilestones.ts` | `Milestone[]` | MilestonesPage |
| `planto_followed_assets` | `AssetMart/FollowList.tsx` | `object[]` | TLog_zone1_Form, QuickFillSetup, useVisData, useInsightData (indirect) |
| `planto_quick_fills` | `QuickFillManager.tsx` | `QuickFillItem[]` | Header dropdown |
| `planto_settings` | `SettingsManager.tsx` | `object` | SettingsManager (load on mount) |
| `planto-zen-dashboard-v3` | `useDashboard.ts` | `DashboardLayout` | useDashboard |
| `planto_tlog_last_category` | `TLog_zone1_Form.tsx` | `string` | TLog_zone1_Form (UX memory) |

> ⚠️ `SettingsManager.resetAllData()` ต้องรู้ keys ทั้งหมด — ถ้าเพิ่ม key ใหม่ต้องเพิ่มใน `STORAGE_KEYS` ใน `SettingsManager.tsx` ด้วย

---

## ⚡ Impact Quick Reference

| ต้องการทำ | ไฟล์ที่ต้องแตะ |
|---|---|
| เพิ่ม field ใน Transaction | `types.ts`, `TLog_zone1_Form.tsx`, `HistoryTable.tsx`, `csvUtils.ts`, `TLogManager.tsx` (migration) |
| เพิ่ม field ใน QuickFillItem | `types.ts`, `QuickFillSetup.tsx`, `TLog_zone1_Form.tsx` (handleQuickFill) |
| เพิ่ม chart type ใหม่ | `types.ts` (VisType), `VisRenderer.tsx`, `VisConfigPopup.tsx`, สร้าง chart component ใหม่ |
| เพิ่ม localization key | `translations.ts` (th + en ทั้งคู่) |
| เพิ่ม nav tab ใหม่ | `App.tsx` (renderContent), `Header.tsx` (navItems), `translations.ts` (nav.*) |
| เพิ่ม localStorage key ใหม่ | สร้าง key, เพิ่มใน `SettingsManager.STORAGE_KEYS` เพื่อให้ Nuke ลบได้ |
| เปลี่ยน dashboard layout schema | `useDashboard.ts` (bump key `-v4`), clear old data logic |
| เพิ่ม privacy mask ที่ใหม่ | `SettingsManager.tsx` (เพิ่ม state), `SettingsPage.tsx` (UI), component ที่ต้องการ mask |
| เปลี่ยน Plan | `planData.ts`, `SubscriptionSelector.tsx` (grid cols), `App.tsx` (default plan) |

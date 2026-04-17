# 🏛️ README_ARCH - Project Architecture & Source of Truth

**Role:** Senior System Architect
**Status:** Living Document / Source of Truth
**Last Updated:** 2026-04-15

---

## 🎯 Project Purpose
**PLANTO** is a premium, privacy-focused **Portfolio Tracker** and **Data Asset Provider**. It is designed to help users track digital and traditional assets (Crypto, Stocks, Gold, etc.) with a "User Owns Data" philosophy. The application emphasizes a "Zen" aesthetic—clean, modular, and highly tactile—inspired by tools like Obsidian and macOS.

## 🛠️ Tech Stack
- **Core Framework:** React 19 (TypeScript) + Vite
- **Styling:** Tailwind CSS v4 (Modern Utility-First, Glassmorphism, Premium Gradients)
- **Icons:** Lucide React (Minimalist vector icons)
- **State & Persistence:** 
  - **Local Storage:** Primary database for transaction logs and user settings.
  - **CSV Support:** Manual Import/Export for data portability.
- **Data Sources:** 
  - *Planned:* CoinGecko API (Crypto), Alpha Vantage / Yahoo Finance (Stocks/Commodities).

## 📂 File Structure
```
root/
├── _agents/            # Agent-specific workflows and knowledge base
├── public/             # Static assets (logo, icons)
├── src/                # Main Application Source
│   ├── components/     # Modular UI logic
│   │   ├── Dashboard/  # Grid-based modular dashboard system (BlocksLayer, DashboardBlock, etc.)
│   │   ├── TLog/       # Transaction logging sub-modules
│   │   ├── AssetMart/  # Market data components
│   │   ├── Subscription/ # Multi-step subscription flow (Journey, Selector, Checkout)
│   │   │   ├── hooks/      # Custom hooks (useSubscription)
│   │   │   ├── utils/      # Billing and formatting utilities
│   │   │   └── planData.ts # Centralized plan configurations and ranking
│   │   ├── UI/         # Shared Design System components (ZenField, etc.)
│   │   └── Header.tsx  # Global glassmorphism navigation
│   ├── hooks/          # Custom Hooks (useDashboard, useBlockInteraction)
│   ├── utils/          # Pure helper functions (gridUtils)
│   ├── types.ts        # Centralized TypeScript interfaces
│   ├── index.css       # Design System (Tailwind v4 variables & Global styles)
│   └── App.tsx         # Root Router and Layout assembly
├── PRD.md              # Product Requirements Document (The "What")
├── ADD.md              # Architecture Design Document (The "How")
├── README_ARCH.md      # This file (Architectural Rules & Source of Truth)
└── package.json        # Project Manifest & Dependencies
```

## 🔄 Data Flow
1. **Input:** Users record transactions in `TLog` (Zone 1).
2. **Persistence:** Data is immediately committed to `localStorage` as a serialized JSON array.
3. **Distribution:** 
   - `TLog` components read local storage to display summaries and history.
   - `Dashboard` blocks (Vis) subscribe to the same data to calculate allocations and performance metrics.
4. **Synchronization:** Data is synced between internal state and `localStorage` using React Hooks (custom `useLocalStorage` or standard `useEffect`).

## ⚖️ Coding Rules (The "Iron Laws")
1. **Functional Only:** No Class Components. Use React Hooks (`useState`, `useEffect`, `useMemo`) for all state and lifecycle management.
2. **Tailwind-First:** Every pixel must be styled via Tailwind CSS v4. Avoid raw CSS or inline styles unless calculating dynamic layout positions (e.g., Grid coords).
3. **Strict Typography & Colors:** 
   - Use `#10b981` (Emerald) for primary highlights.
   - Foundation colors must follow the "Obsidian Zen" dark mode.
4. **Component Isolation:** UI components should be modular. A "Block" in the dashboard should be independent of the data source it visualizes.
5. **No Lib Edits:** Never modify files inside `node_modules`. If a library fix is needed, use a wrapper or patch-package.
6. **Snap-to-Grid Precision:** The Dashboard layout follows a **0px snap alignment**. Grids must be mathematically precise.
7. **Privacy by Default:** Do not introduce external cloud storage or analytics without explicit architectural approval. The user owns their data.

---
> [!IMPORTANT]
> This file is the **Source of Truth** for the project architecture. Before initiating any task, the Agent must review this document to ensure alignment with the overarching design philosophy.

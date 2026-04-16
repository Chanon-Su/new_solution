# The Alpha Solution

A modern portfolio tracker and digital asset data mart.

## Features
- **T-log (Transaction Log):** Manual and batch logging of assets.
- **Dynamic Dashboard:** Modular block system with "Drift Display" and viewport locking.
- **Asset Mart:** comprehensive data and visualization for Bitcoin, Gold, and key stocks.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS v4.
- **Icons:** Lucide React.
- **Utilities:** date-fns.
- **Python:** Scripts/Backend tooling (venv enabled).

## Getting Started
1. Install Node dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Activate Python venv: `.\venv\Scripts\activate` (Windows)
cmd /c npm run dev

- ในหน้า Asset Mart ช่วยปรับให้ หน้าตามรูป step2 fixed แบบเลื่อนขึ้นลงไม่ได้ และเอาปุ่ม w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all border border-emerald-500/20 ออก โดยทำแค่หน้า step 2 เท่านั้น ให้ step 3,4 ยังเหมือนเดิมคือเลื่อนขึ้นลงได้ ถ้ามันดูใหญ่เกินอยู่ดี ให้ ลด bento-card ลงนิดหน่อยให้ความสูงพอดี
- ต่อจากการ fixed ให้เลื่อนขึ้นลงไม่ได้ แต่ให้ ฝั่งขวาที่เป็นรายการ follow-items-wrapper flex flex-col gap-3 สามารถเลื่อนขึ้นลงได้นะ ฝั่งซ้ายที่เป็น bento bento-grid-container ไม่ต้องเลื่อนขึ้นลงได้
- ไม่ต้องปรับอะไรของ flex items-center justify-between mb-6 ที่เป็น Asset Mart และ ช่องค้นหา ทั้งนั้นคงไว้เหมือนเดิม 100%
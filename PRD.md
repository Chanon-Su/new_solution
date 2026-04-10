# Product Requirements Document (PRD)
นี่คือ แนวทางหลักในการพัฒนาโปรแกรม ฉันจะใช้ PRD นี้เป็นแนวทางในการพัฒนาโปรแกรม และจะอัปเดต PRD นี้เมื่อมีการเปลี่ยนแปลง ขอให้ทุกคนช่วยกันพัฒนาโปรแกรมตาม PRD นี้ และทุกคนมีสิทธิ์ในการเสนอแนะ และปรับปรุง PRD นี้ได้ รวมทั้ง ตั้งคำถามได้ เมื่อคิดว่ามีบางอย่างที่ไม่เหมาะสมหรือควรปรับปรุง

## Product Requirements Document (PRD) คือ เอกสารที่ระบุรายละเอียดความต้องการ คุณสมบัติ ฟังก์ชันการทำงาน และเป้าหมายของผลิตภัณฑ์ที่กำลังพัฒนา เพื่อให้ทีมผลิตภัณฑ์ นักออกแบบ และนักพัฒนาเข้าใจตรงกันว่าจะสร้างอะไร ทำไปทำไม และเพื่อใคร ทำหน้าที่เป็นพิมพ์เขียวที่ช่วยให้การพัฒนาเป็นไปในทิศทางเดียวกันและลดข้อผิดพลาด 

## องค์ประกอบสำคัญของ PRD ที่ดี:
### วัตถุประสงค์ (Objectives): ทำไมต้องทำโปรเจกต์นี้ และแก้ปัญหาอะไร
    - Portfolio tracker - เว็บไซต์สำหรับเก็บข้อมูล สินทรัพย์ ที่ลงทุนไปแล้ว เหมือนกันทำบัญชีรายรับรายจ่าย แต่เป็นสินทรัพย์ดิจิทัล ที่จะเป็นตัวช่วย ให้ทุกคนได้รู้ว่า สถานะ/ภาพรวมของ การลงทุนเป็นอย่างไร
    - Data assert provider - เว็บไซต์สำหรับรวมสินทรัพย์ทุกอย่างไว้ในที่เดียวเท่าที่จะทำได้ เป็น datamart ข้อมูลขนาดใหญ่ เพื่อช่วยให้ผู้คนที่มีความสนใจในสินทรัพย์ดิจิทัลสามารถเข้ามาศึกษา และเรียนรู้เกี่ยวกับสินทรัพย์ดิจิทัลได้อย่างเบ็ดเสร็จ
    - ชื่อโปรเจคนี้ใช้ว่า "The Alpha Solution" ไปก่อน ไว้ฉันได้ชื่อที่ดีกว่านี้จะมาแก้ PRD นี้อีกที
### กลุ่มเป้าหมาย (Personas/Users): ใครคือผู้ใช้งานผลิตภัณฑ์
    - ผู้ที่ลงทุนในสินทรัพย์ดิจิทัล ใครก็ได้ ได้ทุกคนที่ต้องการความสะดวกสบายในการจัดการสินทรัพย์ดิจิทัลของตนเอง
### ฟีเจอร์ที่ต้องมี (Features & Requirements): รายละเอียดว่าระบบต้องทำอะไรได้บ้าง
(อยากให้ คำที่แทน user ทุกคนในเอกสารและโปรเจคใช้คำว่า "ผู้ใช้งาน" และแทนคำที่แทนว่า user data ด้วย "ประวัติสินทรัพย์")
    - Log-transaction (T-log) - แหล่งรวบรวม **ประวัติสินทรัพย์** ของผู้ใช้งาน
        - **Layout Pattern (Standard for All Pages):** 
            - **Global Header (Top):** ประกอบด้วย Logo (ฝั่งซ้าย), ส่วนฝั่งขวาประกอบด้วย **Navi-bar** (มี Dashboard, Asset Mart, Log-transaction(T-log), และ เป้าหมาย) ตามด้วยเส้นขีดคั่นบางๆ และ **System Icons** (ฝั่งขวาสุด)(Plans (✨), Theme Toggle (☀️,🌙), Profile (👤), Settings (⚙️))    
            - **Bottom Right:** Floating "?" Help Circle (Z-index: 100).
        - **Add To Log (Zone 1):** การเพิ่ม **ประวัติสินทรัพย์** ของผู้ใช้งาน
            - **Manual Add To Log:** ผู้ใช้งานกรอกข้อมูลผ่าน Form
                - **Date:** วันที่ทำรายการ (Date Picker)
                - **Type:** ประเภท (ซื้อ/Buy, ขาย/Sell, ปันผล/Dividend) - Dropdown
                - **Asset:** ชื่อย่อสินทรัพย์ และการเลือกประเภทสินทรัพย์ (หุ้น, ทองคำ, Crypto, สหกรณ์, กองทุน เป็น Dropdown)
                - **Amount:** จำนวนหน่วย
                - **Price:** ราคาต่อหน่วย (แยกตามสกุลเงินที่กรอก เช่น USD, THB - ยังไม่มีการแปลงข้ามสกุลเงินอัตโนมัติ)
                - **Fee:** ค่าธรรมเนียมหรือภาษีที่เกี่ยวข้อง
                - **Notes:** บันทึกเพิ่มเติม (เหตุผล, แพลตฟอร์ม, ฯลฯ)
                - **CTA Button:** ปุ่ม "เพิ่มเข้าบันทึก" ขนาดใหญ่สี Emerald พร้อมไอคอน `+`
            - **Batch Tools:** ปุ่ม "นำเข้า (Import)" และ "ส่งออก (Export)" อยู่มุมขวาบนของ Zone 1
    - **Dashboard** - ศูนย์รวมการแสดงผลภาพรวมพอร์ตการลงทุนที่ประมวลผลจาก **ประวัติสินทรัพย์**
        - **1. Multi-Dashboard (Drift Display):** 
            - การแสดงผลหน้า Dashboard หลายชุดที่เชื่อมต่อกันในแนวราบ (Horizontal Span [1][2][3])
            - ผู้ใช้งานสามารถเลื่อน (Slide/Drift) สลับหน้าได้เหมือนหน้า Desktop ของ OS (เช่น macOS/iOS Home Screen) 
      - มี "Ghost Navigation" (ลูกศรโปร่งแสง) ปรากฏขึ้นที่ขอบจอเมื่อนำเมาส์ไปวาง (Hover) เพื่อบอกทิศทางที่เลื่อนได้
        - **2. Block System (The Modular Core):**
            - แนวคิดการออกแบบที่เน้นการปรับแต่งได้ตามใจ (Interactive Pivot Utility)
            - **Metaphor:** เปรียบเทียบเหมือน "การจัดสวน" (Garden Design) ที่ประกอบด้วย "กระถาง" และ "ต้นไม้"
            - **Block:** คือหน่วยที่เล็กที่สุดที่ประกอบด้วย 2 ส่วนคือ **BaseVis** + **Vis**
                - **BaseVis (The "Pot" - กระถาง):** ฐานสี่เหลี่ยมที่กำหนดขนาด (กว้าง x ยาว) บนระบบ Grid เพื่อกำหนดขอบเขตของพื้นที่
                - **Vis (The "Tree" - ต้นไม้):** ตัวแสดงผลข้อมูล (Charts, Tables, Indicators) ที่เติบโตและปรับขนาดตาม BaseVis
        - **3. Interactive Experience (Edit Mode):**
            - **Split View:** เมื่อเข้าโหมดแก้ไข หน้าจอจะแบ่งเป็นส่วนจัดการ Block และส่วนแสดงผลแบบ Real-time
            - **Block Management:** ผู้ใช้งานสามารถ เพิ่ม (Add), ลบ (Delete), ปรับขนาด (Resize) และย้ายตำแหน่ง (Rearrange) ได้อย่างอิสระ
        - **4. Fixed Zen Frame Philosophy (Final Design Locked - DASHBOARD ONLY):**
            - **Viewport Locking:** เฉพาะพื้นที่ Dashboard เท่านั้นที่จะถูกล็อคให้พอดีกับหน้าจอ (View-port) เสมอ โดยไม่มีการ Scroll ขึ้น-ลง
            - **Other Pages (T-log, Asset, etc.):** สามารถ Scroll ขึ้น-ลงได้ตามปกติเพื่อรองรับข้อมูลจำนวนมาก
            - **Fluid Proportions:** ใช้ระบบสัดส่วนที่ปรับตัวอัตโนมัติจากขนาดจอ (Dynamic Scaling) โดยใช้สัดส่วนทองคำในการจัดวาง เพื่อให้ดูดีทั้งบนจอ Laptop 13" และ Monitor 32"
            - **Zen Constraint:** หากจอมีขนาดกว้างพิเศษ (Ultrawide) ระบบจะรักษาสัดส่วนกลางจอไว้เพื่อไม่ให้เนื้อหากระจายเกินไปจนเสียสมาธิ
        - **5. Absolute Grid Persistence & Precision (Architecture Locked):**
            - **Edit Mode UI:** ปุ่ม "Edit Mode" อยู่เหนือปุ่ม Help (?) เมื่อกดจะเปลี่ยนเป็นสีเหลือง และมีปุ่มเพิ่มขึ้นมา 2 ปุ่มคือ "ปรับ Layout" และ "เพิ่ม Block"
            - **Dynamic Grid Configurator:** ใน Edit Mode ผู้ใช้งานสามารถปรับจำนวน Grid ได้เองทางแถบควบคุมด้านซ้าย โดยจำกัดสูงสุดที่ **20 Columns x 16 Rows** เพื่อรักษาประสิทธิภาพการประมวลผล (Performance Guardrail)
            - **3-Level Grid Visibility:**
                - **Normal:** ไม่แสดงเส้น Grid (Pure Obsidian Void)
                - **Edit Mode:** แสดงเส้น Grid จางๆ (50% Opacity) เพื่อช่วยในการเล็งตำแหน่ง
                - **Layout Mode:** แสดงเส้น Grid ชัดเจน 100% พร้อมตัวเลข Coordinates เพื่อความแม่นยำสูงสุด
            - **Visual Feedback:** เมื่อปรับ Layout ตัว Block จะโปร่งแสงลงเพื่อให้เห็น Grid ด้านหลังชัดเจน
            - **Tactile Drag & Resize (Solid Object):** ทั้งการลาก (Drag) และการปรับขนาด (Resize) จะหยุดเคลื่อนที่ทันทีเมื่อชนกับวัตถุอื่น (Solid Barrier) ไม่มีการดีดกลับหรือสลับที่ มีการแสดงผล **สีแดงจางๆ (Faint Red Overlay)** ที่ Block ปลายทางที่โดนชนเพื่อสื่อสารว่าตำแหน่งนั้นติดขัด
            - **Vis Scaling Philosophy:** ตัวแสดงผล (Vis/Tree) จะปรับตัวตามรูปทรงของ Block เสมอ หากรูปทรงที่ผู้ใช้เลือกดูไม่เหมาะสม กราฟจะแสดงผลตามนั้นเพื่อให้ผู้ใช้ได้เรียนรู้และปรับแต่งตามสุนทรียภาพของตนเอง
        - **6. Smart Overflow & Add Logic:**
            - ปุ่มเพิ่ม Block (+) จะเพิ่มขนาด 1x1 ลงในที่ว่างแรก (First available slot)
            - หากหน้า 1 เต็ม ระบบจะขยับไปหาที่ว่างในหน้า 2 และ "Drift" ผู้ใช้งานไปยังหน้านั้นโดยอัตโนมัติ
            - หากเต็มทุกหน้า ปุ่ม (+) จะเปลี่ยนเป็นสี **Rose Red** และระบุว่า Dashboard Full
        - **7. Drift Navigation:**
            - **No Indicators:** จะไม่มีระบบบอกเลขหน้าหรือจุด Pager บนหน้าจอ เพื่อรักษาความสะอาดตา (Obsidian Void)
            - **Ghost Arrows:** ปุ่มลูกศรซ้าย/ขวาเป็นแบบ **Minimal Arrows** (เรียบง่าย) จะปรากฏแบบ Ghost Hover ที่ขอบจอเมื่อเลื่อนเมาส์ไปใกล้
            - **Proportional Scaling:** รักษาเอกลักษณ์ของ Layout โดยการคงสัดส่วน (Aspect Ratio) ของ Dashboard ทั้งชุดไว้เสมอ (Scale up/down proportionally)
            - เน้นการ Slide ที่นุ่มนวลและประสิทธิภาพสูง (60 FPS Focus)
    - **Language Support (Centralized i18n):** รองรับภาษาไทย และอังกฤษ (Default)
        - **Centralization:** ข้อความทั้งหมดในระบบต้องถูกเก็บไว้ที่ไฟล์เดียว (เช่น `translation.json`) เพื่อให้คุณ Chanon สามารถตรวจสอบและปรับจูนคำแปล (Copywriting) ได้อย่างเบ็ดเสร็จในจุดเดียว
        - **Responsibility:** ให้ Chanon เป็นผู้พิจารณาคำศัพท์สุดท้ายเองทั้งสองภาษา
    - **Transaction Log Enhancements (Concept Locked/Finalized):**
        - **Layout:** Vertical Stack (Zone 1: Add -> Zone 2: Asset Summary -> Zone 3: History).
        - **Zone 2 (Asset Quantity Summary):** 
            - แสดงสรุปจำนวนหน่วย (Quantity/Amount) ของสินทรัพย์แต่ละรายการที่มีการบันทึกไว้ (ไม่เกี่ยวกับยอดเงิน)
            - **Format:** แสดงผลในรูปแบบการ์ดแบบไม่มีไอคอน เพื่อความเรียบง่ายและไม่สับสน
            - **Interaction:** ใช้ระบบ **Carousel (เลื่อนด้านข้าง)** เพื่อประหยัดพื้นที่
            - **Sorting Logic (Recency):** เรียงลำดับตามการอัปเดตล่าสุด สินทรัพย์ที่เพิ่งมีการซื้อ/ขายหรือเพิ่มประวัติจะอยู่ทางฝั่งซ้ายสุดเสมอ สินทรัพย์ที่ไม่มีการเคลื่อนไหวนานแล้วจะอยู่ลึกไปทางขวา เพื่อให้ผู้ใช้งานตรวจสอบความถูกต้อง (Re-check) กับยอดถือครองจริงได้สะดวก
        - **Zone 3 (History Table):** แสดงข้อมูลที่สอดคล้องกับ CSV Schema ทั้งหมด
            - **Columns (Visible):** วันที่, ประเภท (Badge), ประเภท (Category), สินทรัพย์ (Icon + Symbol), จำนวน, ราคา (ระบุสกุลเงิน), ค่าธรรมเนียม, มูลค่ารวม (Calculated), โน้ต (Icon), การจัดการ (Edit/Delete icons)
            - **Hidden Column:** id (Unique ID สำหรับอ้างอิงข้อมูล)
            - **CTA:** ปุ่ม "ดูประวัติทั้งหมด" ด้านล่างของตาราง
        - **Pagination:** จำกัดการแสดงผล 10, 25, 50, 100 row ต่อหน้า (เพื่อประสิทธิภาพการโหลดข้อมูล)
        - **CSV Data Schema (Export/Import):** สอดคล้องกับ ZONE 3 100%
            | Column | Name | Format | Description |
            | :--- | :--- | :--- | :--- |
            | 1 | id | Timestamp-Random | Unique ID (Hidden from UI) |
            | 2 | date | YYYY-MM-DD | วันที่ทำรายการ |
            | 3 | type | BUY / SELL / DIVIDEND | ประเภทธุรกรรม |
            | 4 | asset | Asset Symbol | ชื่อย่อสินทรัพย์ |
            | 5 | category | Category Name | ประเภทสินทรัพย์ (หุ้น, ทองคำ, ฯลฯ) |
            | 6 | amount | Number | จำนวนหน่วย |
            | 7 | price | Number | ราคาต่อหน่วย |
            | 8 | currency | THB / USD | สกุลเงิน |
            | 9 | fee | Number | ค่าธรรมเนียม |
            | 10 | notes | String | บันทึกเพิ่มเติม |
    - Profile & setting - จัดการข้อมูลส่วนตัว และตั้งค่าต่างๆ
        - **Plans & Subscription:** หน้ารายละเอียดแผนการใช้งาน (Placeholder)
        - **Terms of Service:** ลิงก์นโยบายการใช้งาน
        - **Navigation Structure (Global Top Header):**
            - **Right-Aligned Navi-bar (Next to Utilities):**
                1. Dashboard (แผงควบคุม)
                2. Asset Mart
                3. Transaction-Log (T-log)
                4. เป้าหมาย (Goal) - *Project Milestone Tracker*
            - **Utility Icons (Right):** Plans (✨), Theme Toggle (☀️,🌙), Profile (👤), Settings (⚙️)
        - เก็บข้อมูลส่วนตัว 
            - user name
            - email
            - password
            - profile picture (เก็บเป็น Base64 String ใน Local Storage ตามคอนเซปต์ User Owns Data)
            - add/edit friend
        - ตั้งค่าต่างๆ
            - Theme
            - Language
            - Notification
    - **Asset Mart -** แหล่งรวมข้อมูลราคาและรายละเอียดของสินทรัพย์จากโลกภายนอก (External Data) 
        - **Vision:** ให้ผู้ใช้งานสามารถติดตามข้อมูลสินทรัพย์ทุกประเภท (Crypto, หุ้น, ทองคำ, อสังหาฯ) ได้ในที่เดียวโดยไม่ต้องเปิดหลายเว็บไซต์
        - **Workflow:**
            1. **Mart Entry:** เข้าสู่หน้าหลัก Asset Mart ผ่าน Navi-bar
            2. **Category Selection:** แสดงหมวดหมู่สินทรัพย์ (หุ้น, ทองคำ, Crypto, สหกรณ์, กองทุน, อื่นๆ) ในรูปแบบ **Bento Grid** (การ์ดขนาดใหญ่ที่มีสัดส่วนต่างกันเพื่อความสวยงามและความชัดเจน)
            3. **Asset Inventory:** เมื่อเลือกหมวดหมู่ จะแสดงรายการสินทรัพย์ทั้งหมดในหมวดนั้นๆ (เช่น รายชื่อเหรียญ Crypto พร้อมราคา Real-time)
            4. **Deep Dive Detail:** เมื่อเลือกสินทรัพย์รายตัว จะแสดงข้อมูลเชิงลึกและการวิเคราะห์การลงทุน
        - **Detail View Components (The Portfolio Intelligence):**
            - **Identity:** ชื่อสินทรัพย์ และ Logo (Branding)
            - **Core Metrics:** จำนวน (Quantity), ราคาปัจจุบัน, ราคาทุน, มูลค่ารวม (Total Value)
            - **Cost Analysis:** ค่าธรรมเนียม + Vat, ต้นทุนเฉลี่ย (คิดลดจากเงินปันผล/Dividend Adjusted)
            - **Performance:** ผลตอบแทนจากการลงทุน (ROI) แสดงผลแบบเน้นสี Emerald Gradient
            - **Visualizer:** กราฟแสดงราคาในช่วงเวลาที่ผ่านมา (Historical Price Chart) แบบปรับแต่งช่วงเวลาได้ (1D, 1W, 1M, 1Y, ALL)
### ตัวชี้วัดความสำเร็จ (Metrics/KPIs): จะวัดผลได้อย่างไรว่าผลิตภัณฑ์ประสบความสำเร็จ   
    - การเก็บ feedback จะผู้ใช้งาน
    - ผู้ใช้งานสามารถใช้งานโปรแกรมได้จริง ครบ 1 สัปดาห์
    - 100 transaction log -> Dashboard
    - ความลื่นไหลของระบบ Dash-Drift และความสนุกในการจัดแต่ง (Tactile Satisfaction)
    - **Development Strategy:** เริ่มต้นด้วยการพัฒนา **T-log** เป็นอันดับแรก ตามด้วยระบบจัดการข้อมูล (CSV/LocalStorage) และจบด้วยการสร้าง Dashboard ที่เน้น Visual คุณภาพสูง

### ขอบเขต (Scope): สิ่งที่ต้องทำ และสิ่งที่ไม่ทำ (Out of scope) ในเวอร์ชันนั้นๆ
    - Alpha verison 0.0.1 - 0.1
        - Transaction log
            - Buy asset
            - Sell asset
            - ปันผล asset
        - Dashboard
            - Custom dashboard (Max Grid: 20 Columns x 16 Rows)
            - Vis Types: Asset Allocation (Pie Chart), Recent Transactions (List)
    - Demo version 0.1 - 1.0 (ฉันไม่แน่ใจว่าเราจะเวิอร์ชั่น โปรเจคยังไงดี)
        - Asset Mart 3 ตัว
            - Bitcoin (เหมือนหุ้น)
            - ทองคำ 99 96.9 เก็บเป็น ออนไลน์หรือทองก้อน
            - หุ้นตัวสำคัญ 1 ตัว
                - S&P 500
                - หุ้นไทย 1 ตัว คือ SET50
            - อัตราแลกเปลี่ยน THB USD
        - Transaction log
            - Buy asset
            - Sell asset
            - Dividend asset
        - Dashboard
            - Custom dashboard
            - Multi dashboard
        - Profile & setting
            - เก็บข้อมูลส่วนตัว 
                - user name
                - email
                - password
                - profile picture
                - add/edit friend
            - ตั้งค่าต่างๆ
                - Theme
                - Language
                - Notification
    - Beta version 1.0 - 2.0
        - Asset Mart - asset ทุกชนิด ชนิดละ 1-2 ตัว
            - คริปโต เช่น Bitcoin, Ethereum, 
            - ทองคำ
            - หุ้นตัวสำคัญ 3 ตัว เช่น S&P 500, SET50, 
            - กองทุนรวม
            - พันธบัตร
            - หุ้นกู้
            - ตราสารหนี้
            - อสังหาริมทรัพย์
        - Transaction log
            - Buy asset
            - Sell asset
            - Dividend asset
        - Dashboard
            - Custom dashboard
            - Multi dashboard
        - Profile & setting
            - เก็บข้อมูลส่วนตัว 
                - user name
                - email
                - password
                - profile picture
                - add/edit friend
            - ตั้งค่าต่างๆ
                - Theme
                - Language
                - Notification
    - **เป้าหมาย (Goal):** หน้าจอสำหรับติดตามความคืบหน้าของโปรเจค (Project Milestones)
        - **Format:** แสดงผลในรูปแบบ Checklist ของฟีเจอร์ที่ต้องทำในแต่ละเฟส (Alpha, Beta, Demo) เพื่อให้เห็นความก้าวหน้าของโปรเจคแบบรวมศูนย์
    - **GO live หลังเลย**
### Theme & art concept
    - สบายตา 
    - เข้าใจง่าย 
    - Friendly-user
    - เรียบง่าย ลึกซึ้ง ละเอียดอ่อน เหมือนกับปรัชญา Zen
    - **The Alpha Green Brand Identity:** 
        - สีเขียวหลักของงานคือ Vibrant Emerald Gradient (`#10b981` ถึง `#34d399`)
        - **Constraint:** ห้ามลดค่าความโปร่งแสง (Opacity) ของสีเขียวที่เป็นอัตลักษณ์ เช่น โโลโก้ หรือตัวเลขระบุตำแหน่งพิกัด ต้องเป็น 100% Opacity เสมอ เพื่อให้ความสดใส (Vibrancy) ตัดกับพื้นหลังสีดำได้อย่างสมบูรณ์แบบ
    - reference
        - https://www.settrade.com/th/services-and-tools/trading-program/basic/aomwise/introduction
        - https://obsidian.md/

### Tech Stack
    - Full Stack
        - TypeScript
        - Tailwind CSS
        - React
        - Node.js
    - Database
        - **Local Storage + CSV Strategy:** ข้อมูลถูกเก็บไว้ใน Browser ของผู้ใช้งาน (`localStorage`) เพื่อความเป็นส่วนตัวสูงสุด 
        - **Manual Backup:** ผู้ใช้งานเป็นผู้รับผิดชอบการสำรองข้อมูลผ่านปุ่ม **ส่งออก (Export CSV)** และสามารถนำกลับมาใช้ใหม่ผ่านปุ่ม **นำเข้า (Import CSV)**
        - **External Data APIs:** 
            - **CoinGecko API:** สำหรับราคา Crypto (Public/Free tier)
            - **Alpha Vantage / Yahoo Finance:** สำหรับราคาหุ้น, ทองคำ และอัตราแลกเปลี่ยน
    - Deployment
        - Git page (Alpha - Demo)
### การสร้างรายได้
    - ใช้คอนเซปต์ เหมือนกับ obsidain
        - ใช้ได้ทุกฟีเจอร์ฟรี
        - แต่ถ้าต้องการความสะดวกสบายมากขึ้น ใช้การ subscription
            - sync ข้อมูลระหว่างอุปกรณ์ (Cloud Sync)
            - เก็บข้อมูลบน cloud ไม่ต้อง import - export ข้ามอุปกรณ์เอง
            - มีระบบ Login (Username/Password) เพื่อระบุตัวตนและเข้าถึงข้อมูลที่ Sync ไว้
 
### Product Team - agents
- Chanon - Product Owner (it's me)
- UX/UI Designer
- Full Stack Developer
- Tester/QA

### the passion project
- เป็นโปรเจคที่ทำเพื่อการเรียนรู้ และพัฒนาทักษะของทีม
- สร้างสิ่งที่มีคุณค่าและเป็นประโยชน์ต่อผู้คน
- อำนวยความสะดวกให้ผู้คนสามารถจัดการพอร์ตการลงทุนของตัวเองได้อย่างครบวงจร
- ถ้าผู้คนรักในสิ่งที่เราทำ ก็จะสนับสนุนเรา
- เมตตาทุนนิยม(Compassionate Capitalism) + You first, Me second

### ข้อจำกัด
- ฉันเริ่มโปรเจคนี้คนเดียว และฉันไม่มีประสบการณ์ในการพัฒนาโปรแกรมมาก่อน แนะนำฉันได้เต็มที่ และให้ฉันเป็นคนตัดสินใจ และรับผิดชอบ
- ฉันยังไม่มีงบประมาณในการพัฒนาโปรแกรม และไม่มีประสบการณ์ในการระดมทุน เริ่มต้นที่อย่างด้วยวิชาตัวเบา
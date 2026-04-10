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
            - **Left:** Collapsible Modern Sidebar (Navigation).
            - **Top:** Global Header (Title, Plans, Account, Settings).
            - **Bottom Right:** Floating "?" Help Circle (Z-index: 100).
        - **Add To Log:** การเพิ่ม **ประวัติสินทรัพย์** ของผู้ใช้งาน
            - **Manual Add To Log:** ผู้ใช้งานกรอกข้อมูลด้วยตนเองผ่าน Form
                - **Date:** วันที่ทำรายการ
                - **Type:** ประเภท (ซื้อ/Buy, ขาย/Sell, ปันผล/Dividend)
                - **Asset:** ชื่อย่อสินทรัพย์
                - **Amount:** จำนวนหน่วย
                - **Price:** ราคาต่อหน่วย
                - **Fee:** ค่าธรรมเนียมหรือภาษีที่เกี่ยวข้อง
                - **Notes:** บันทึกเพิ่มเติมสำหรับรายการนั้นๆ
            - **Import & Export:** จัดการข้อมูลแบบ Batch ผ่านไฟล์ CSV
                - **Import:** นำเข้าข้อมูลจากไฟล์ CSV สู่ระบบ
                - **Export:** ส่งออกข้อมูลทั้งหมดเป็นไฟล์ CSV
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
            - **Vis Inventory (Attache Case):** พื้นที่เก็บพัก Block ชั่วคราว (Parking Area) เพื่อให้ผู้ใช้งานปรับผัง Layout ได้สะดวกโดยไม่ติดสถานะ Deadlock (ไม่มีที่วาง)
        - **4. Fixed Zen Frame Philosophy (Final Design Locked):**
            - **Viewport Locking:** พื้นที่ Dashboard จะถูกล็อคให้พอดีกับหน้าจอ (View-port) เสมอ โดย **ไม่มีการ Scroll ขึ้น-ลง** (Zero Vertical Scroll) เพื่อรักษาความนิ่งและพรีเมียม
            - **Fluid Proportions:** ใช้ระบบสัดส่วนที่ปรับตัวอัตโนมัติตามขนาดจอ (Dynamic Scaling) โดยใช้สัดส่วนทองคำในการจัดวาง เพื่อให้ดูดีทั้งบนจอ Laptop 13" และ Monitor 32"
            - **Zen Constraint:** หากจอมีขนาดกว้างพิเศษ (Ultrawide) ระบบจะรักษาสัดส่วนกลางจอไว้เพื่อไม่ให้เนื้อหากระจายเกินไปจนเสียสมาธิ
        - **5. Absolute Grid Persistence & Precision (Architecture Locked):**
            - **Explicit Positioning:** ทุก Block ต้องยึดตามพิกัด `(x, y)` แบบเบ็ดเสร็จ (Explicit Grid Positioning) เพื่อไม่ให้ Block ขยับตำแหน่งเองเมื่อมีการลบ Block อื่นออก รักษาสถานะความนิ่งของผัง Layout เสมอ
            - **Zero-Gap Alignment:** ระบบ Grid ต้องใช้ `gap: 0px` เท่านั้น เพื่อให้พิกัดเส้นตารางและเครื่องหมายจุดพิกัด (`+`) ตรงกับขอบของ Block เป๊ะ 100% (ห้ามใช้ CSS Grid Gap ในการเว้นระยะห่างระหว่าง Block)
            - **Visual Spacing:** การเว้นระยะห่างเพื่อความสวยงาม (Padding) ให้จัดการภายในตัว Block เอง แทนการใช้ Gap ของระบบ Grid เพื่อรักษาความแม่นยำของพิกัด
            - **Race Condition Prevention:** การเพิ่ม Block ต้องใช้วิธี Functional State Update เพื่อคำนวณหาที่ว่างล่าสุดเสมอ ป้องกันการวางซ้อนกัน (Overlap) เมื่อมีการกดเพิ่มรัวๆ ในเวลาอันสั้น
            - **Defensive Integrity:** ระบบตรวจสอบที่ว่างต้องรองรับการจัดการข้อมูลที่พิกัดไม่สมบูรณ์ (Missing x/y coordinates) โดยใช้ระบบ Fallback เพื่อให้การตรวจสอบความทับซ้อนทำงานได้อย่างแม่นยำเสมอ
            - **Live Interaction Standard:** เมื่ออยู่ใน Edit Mode ผู้ใช้ต้องสามารถลาก (Drag) และปรับขนาด (Resize) ได้ทันที โดยตัว Block ต้องเปลี่ยนเป็นกึ่งโปร่งใส (`opacity-50`) เพื่อให้เห็น Grid และเครื่องหมาย `+` ด้านหลัง ช่วยในการเล็งพิกัด
            - **High-Visibility Handles:** มุมขวาล่างของ Block ต้องมีสัญลักษณ์ Resize ที่ชัดเจน (Corner Triangle + Icon) เพื่อแจ้งให้ผู้ใช้ทราบว่าสามารถปรับขนาดได้ (Discoverability)
        - **6. Smart Block Overflow Logic:**
            - ระบบเพิ่ม Block จะต้องค้นหาพื้นที่ว่าง (findFirstAvailableSlot) ในหน้าปัจจุบันก่อน หากหน้าปัจจุบันเต็ม ระบบจะทำการค้นหาในหน้า Desktop ถัดไป (Drift Search) และสลับหน้าผู้ใช้งานไปยังหน้าที่มีการเพิ่ม Block ให้โดยอัตโนมัติ
            - **Capacity Warning:** หากทุกหน้าเต็ม ปุ่มเพิ่ม (+) จะต้องเปลี่ยนเป็น **สีแดง (Rose Red)** และแสดงข้อความเตือนว่า Dashboard Full เพื่อสื่อสารสถานะความจุของระบบ
    - **Language Support (i18n):** รองรับภาษาไทย และอังกฤษ (Default)
        - ให้ Chanon เป็นผู้รับผิดชอบ รวมไว้ที่ไฟล์เดียวก็พอเดี๋ยวฉันเข้าไปแก้ไขเอง
    - **Transaction Log Enhancements (Concept Locked/Finalized):**
        - **Layout:** Vertical Stack (Zone 1: Add -> Zone 2: Overview -> Zone 3: History).
        - **Data Manipulation:** Import/Export consolidated in Zone 1.
        - **Formatting:** Concise English abbreviations in history table.
        - **Pagination:** จำกัดการแสดงผล 25, 50, 100 row ต่อหน้า
    - Profile & setting - จัดการข้อมูลส่วนตัว และตั้งค่าต่างๆ
        - **Plans & Subscription:** หน้ารายละเอียดแผนการใช้งาน (Placeholder)
        - **Terms of Service:** ลิงก์นโยบายการใช้งาน
        - **Navigation Structure (Collapsible Sidebar):**
            1. Asset History (ประวัติสินทรัพย์) - รากฐานข้อมูล
            2. Dashboard (แผงควบคุม) - การแสดงผลภาพรวม (สวน/ผลผลิต)
            3. Asset-mart - แหล่งข้อมูลสินทรัพย์
            4. Asset Comparison - ระบบเปรียบเทียบ (TBD)
            5. Profile & Login
            6. Setting
            7. User Manual
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
    - Datamart - เก็บข้อมูลทุกสินทรัพย์ที่เป็นที่นิยม
        - asset info
        - asset price
        - asset chart
        - compare asset
### ตัวชี้วัดความสำเร็จ (Metrics/KPIs): จะวัดผลได้อย่างไรว่าผลิตภัณฑ์ประสบความสำเร็จ   
    - การเก็บ feedback จะผู้ใช้งาน
    - ผู้ใช้งานสามารถใช้งานโปรแกรมได้จริง ครบ 1 สัปดาห์
    - 100 transaction log -> Dashboard
    - ความลื่นไหลของระบบ Dash-Drift และความสนุกในการจัดแต่ง (Tactile Satisfaction)

### ขอบเขต (Scope): สิ่งที่ต้องทำ และสิ่งที่ไม่ทำ (Out of scope) ในเวอร์ชันนั้นๆ
    - Alpha verison 0.0.1 - 0.1
        - Transaction log
            - Buy asset
            - Sell asset
            - ปันผล asset
        - Dashboard
            - Custom dashboard
    - Demo version 0.1 - 1.0 (ฉันไม่แน่ใจว่าเราจะเวิอร์ชั่น โปรเจคยังไงดี)
        - Datamart Asset 3 ตัว
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
        - Datamart Asset - asset ทุกชนิด ชนิดละ 1-2 ตัว
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
    - GO live หลังเลย
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
        - CSV (Alpha - Demo)
        - PostgreSQL (Beta - Production)
    - Deployment
        - Git page (Alpha - Demo)
### การสร้างรายได้
    - ใช้คอนเซปต์ เหมือนกับ obsidain
        - ใช้ได้ทุกฟีเจอร์ฟรี
        - แต่ถ้าต้องการความสะดวกสบายมากขึ้น ใช้การ subscription
            - sync ข้อมูลระหว่างอุปกรณ์
            - เก็บข้อมูลบน cloud ไม่ต้อง import - export ข้ามอุปกรณ์เอง
 
### Product Team
- Chanon - Product Owner (it's me)
- Mira - UX/UI Designer
- Keal - Full Stack Developer
- Nara - Tester/QA

### the passion project
- เป็นโปรเจคที่ทำเพื่อการเรียนรู้ และพัฒนาทักษะของทีม
- สร้างสิ่งที่มีคุณค่าและเป็นประโยชน์ต่อผู้คน
- อำนวยความสะดวกให้ผู้คนสามารถจัดการพอร์ตการลงทุนของตัวเองได้อย่างครบวงจร
- ถ้าผู้คนรักในสิ่งที่เราทำ ก็จะสนับสนุนเรา
- เมตตาทุนนิยม(Compassionate Capitalism) + You first, Me second

### ข้อจำกัด
    - ฉันเริ่มโปรเจคนี้คนเดียว และฉันไม่มีประสบการณ์ในการพัฒนาโปรแกรมมาก่อน แนะนำฉันได้เต็มที่ และให้ฉันเป็นคนตัดสินใจ และรับผิดชอบ
    - ฉันยังไม่มีงบประมาณในการพัฒนาโปรแกรม และไม่มีประสบการณ์ในการระดมทุน เริ่มต้นที่อย่างด้วยวิชาตัวเบา
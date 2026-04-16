# Product Requirements Document (PRD)
นี่คือ แนวทางหลักในการพัฒนาโปรแกรม ฉันจะใช้ PRD นี้เป็นแนวทางในการพัฒนาโปรแกรม และจะอัปเดต PRD นี้เมื่อมีการเปลี่ยนแปลง ขอให้ทุกคนช่วยกันพัฒนาโปรแกรมตาม PRD นี้ และทุกคนมีสิทธิ์ในการเสนอแนะ และปรับปรุง PRD นี้ได้ รวมทั้ง ตั้งคำถามได้ เมื่อคิดว่ามีบางอย่างที่ไม่เหมาะสมหรือควรปรับปรุง

## Product Requirements Document (PRD) คือ เอกสารที่ระบุรายละเอียดความต้องการ คุณสมบัติ ฟังก์ชันการทำงาน และเป้าหมายของผลิตภัณฑ์ที่กำลังพัฒนา เพื่อให้ทีมผลิตภัณฑ์ นักออกแบบ และนักพัฒนาเข้าใจตรงกันว่าจะสร้างอะไร ทำไปทำไม และเพื่อใคร ทำหน้าที่เป็นพิมพ์เขียวที่ช่วยให้การพัฒนาเป็นไปในทิศทางเดียวกันและลดข้อผิดพลาด 

## องค์ประกอบสำคัญของ PRD ที่ดี:
### วัตถุประสงค์ (Objectives): ทำไมต้องทำโปรเจกต์นี้ และแก้ปัญหาอะไร
    - Portfolio tracker - เว็บไซต์สำหรับเก็บข้อมูล สินทรัพย์ ที่ลงทุนไปแล้ว เหมือนกันทำบัญชีรายรับรายจ่าย แต่เป็นสินทรัพย์ดิจิทัล ที่จะเป็นตัวช่วย ให้ทุกคนได้รู้ว่า สถานะ/ภาพรวมของ การลงทุนเป็นอย่างไร
    - Data assert provider - เ�        - **Add To Log (Zone 1): [GOLDEN MASTER - รูปที่ 1]**
            - **โครงสร้าง:** แบ่งเป็น 3 แถวหลัก
                - แถวที่ 1-2: แบ่งเป็น 3 คอลัมน์เท่าๆ กัน (วันที่, ประเภท, สินทรัพย์ / จำนวน, ราคา, ค่าธรรมเนียม)
                - แถวที่ 3 (ล่างสุด): บันทึกช่วยจำ (กว้าง) และปุ่ม "เพิ่มเข้าบันทึก" (กะทัดรัด วางไว้ขวาสุด)
            - **จุดเน้น:** 
                - ปุ่มนำเข้า/ส่งออก (บนขวา) มีไอคอนสีมรกตและเส้นขอบสีเข้ม
                - ช่องสินทรัพย์ต้องมีเส้นแบ่งแนวตั้งแยกป้าย "หุ้น" ออกมาชัดเจน
                - ปุ่มกดต้องมีความ Vibrant และมีไอคอน `+` ในวงกลมตามรูป 1
        - **Asset Summary (Zone 2): [SYNC WITH PRD CONCEPT]**
            - **Layout:** Horizontal Carousel (เลื่อนข้าง) แสดงข้อมูลสินทรัพย์แบบการ์ดเรียงต่อกัน
        - **Asset History (Zone 3): [GOLDEN MASTER - รูปที่ 2 & 3]**
            - **Header:** "ประวัติสินทรัพย์ (Asset History)" พร้อม Subtitle เฉพาะตามรูป 2
            - **Table Layout:** 
                - **สินทรัพย์:** ต้องแสดง (Icon + ชื่อจริง + ตัวย่อในวงเล็บ) ทั้งหมดอยู่ในบรรทัดเดียวกัน ห้ามตัดบรรทัดเด็ดขาด
                - **มูลค่ารวม:** ใช้ตัวหนาสีขาวเด่นชัด
                - **การจัดการ:** ไอคอน Pencil และ Trash แบบเรียบง่าย
            - **Pagination (ล่างสุด):**
                - ฝั่งซ้าย: "Rows per page:" พร้อมปุ่มเลือก 10, 25, 50 (เลขที่เลือกต้องมีพื้นหลังสี Emerald ตามรูป 3)
                - ฝั่งขวา: แสดงยอดรายการ และปุ่มลูกศร < > แบบมีกรอบสี่เหลี่ยมสีเข้ม
        - **Global Header (Top Frame): [FINALIZED - DESIGN LOCKED]**
            - **Logo (ซ้าย):** แสดงข้อความ "PLANTO" แบบพรีเมียม (Main brand identity)
            - **Navi-bar (ขวา):** Dashboard, Asset Mart, Transaction-Log (Active: Underline + Emerald Color), เป้าหมาย และไอคอน ✨ (Plans)
            - **System Icons (ขวาสุด):** Theme Toggle (🌙), Profile (👤), Settings (⚙️) กั้นด้วยเส้นคั่นบางๆ (Vertical Divider)
            - **Style:** Glassmorphism ชั้นสูงเบลอระดับพรีเมียม ขอบละเอียด 1px และเงาสะท้อนนุ่มนวล
        - **Bottom Right:** Floating "?" Help Circle (Z-index: 100).
        - **Add To Log (Zone 1): [FINALIZED - DESIGN LOCKED]** (เป๊ะตามรูปที่ 1)
            - **Header:** "เพิ่มเข้าบันทึก" พร้อมเส้น Emerald แนวตั้งทางซ้าย (Glow Effect)
            - **Card Style:** พื้นหลัง Obsidian ทึบแสง (98%) ขอบละเอียด 1px (rgba 255,255,255,0.1)
            - **Utility Buttons (บนขวา):** 
                - "นำเข้า (Import)" และ "ส่งออก (Export)" แบบ Outline Border
                - **Icon Check:** ไอคอนต้องเป็นสี Emerald เพื่อความพรีเมียม
            - **Form Layout:** 3 คอลัมน์สมมาตร (Perfect Grid)
                - **Asset Input:** เส้นแบ่งแนวตั้งกลางฟิลด์ แยก "หุ้น" ออกมาชัดเจน
                - **Price Input:** ป้าย "USD" ด้านซ้าย กั้นด้วยเส้นคั่นบาง
                - **Labels:** ตัวหนังสือ "วันที่," "ประเภท," ฯลฯ ใช้สี Light Grey ที่อ่านง่าย (ไม่จางเกินไป)
            - **Submit Button:** ขนาด Compact (พอดีคำ) อยู่มุมขวาล่าง มีไอคอน `+` ในวงกลม และสี Emerald Vibrant
        - **Asset Summary (Zone 2): [FINALIZED - DESIGN LOCKED]** (เป๊ะตามรูปที่ 3)
            - **Layout:** Horizontal Carousel (สไลด์แนวนอนเท่านั้น) ห้ามแสดงผลแบบ Grid
            - **Card Details:** 
                - Top Left: Symbol (เช่น BTC)
                - Top Right: Last Update (เช่น 1 hr ago) ตัวหนังสือจาง
                - Center/Bottom: Amount (เช่น 0.0520 units) ตัวหนาขาว
            - **Behavior:** ซ่อน Scrollbar เพื่อความสวยงามพรีเมียม
        - **Asset History (Zone 3): [FINALIZED - DESIGN LOCKED]** (เป๊ะตามรูปที่ 2 และ 3)
            - **Header:** "ประวัติสินทรัพย์ (Asset History)" พร้อม Subtitle "ทุกรายการคือเมล็ดพันธุ์..."
            - **Unified Frame:** ใช้กรอบ Obsidian คลุมทั้ง Section (Header + Table + Pagination)
            - **Table Style:** 9 คอลัมน์ พร้อมไอคอนสินทรัพย์ที่มีสีสันตามประเภท
            - **Visual Rules:** 
                - "มูลค่ารวม" (White Bold) / "วันที่/หมวดหมู่" (Soft Grey)
                - โน้ต (ไอคอน 💬) / การจัดการ (ไอคอน ✏️ 🗑️ แบบ Minimal)
            - **Pagination Header/Footer (รูปที่ 3):**
                - **Left Side:** "Rows per page:" ตามด้วยปุ่มเลือก (10, 25, 50) กั้นด้วยกรอบมน (Active Emerald)
                - **Right Side:** แสดงข้อความ "Showing X-Y of Z" ตามด้วยปุ่มลูกศร < > ที่มีกรอบสี่เหลี่ยมสีเข้มขรึม
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
        - **3. Interactive Experience (Edit Mode): [FINALIZED - รูปที่ 2 & 5]**
            - **Split View:** เมื่อเข้าโหมดแก้ไข หน้าจอจะโชว์ Grid และปุ่มควบคุมเพิ่มขึ้นมา
            - **Edit UI:** ปุ่ม Edit (Pencil) จะเรืองแสงสีเหลือง (Glow) พร้อมปรากฏปุ่ม Plus และ Layout ขึ้นมาด้านบนในแนวตั้ง
            - **Block Actions:** เมื่ออยู่ใน Edit Mode ทุก Block จะแสดงไอคอน **Settings (Gear)** และ **Delete (Trash)** แบบถาวร (ตลอดเวลา) พร้อมจุด Resize handle ที่มุมขวาล่าง
            - **Block Management:** ผู้ใช้งานสามารถ เพิ่ม (Add), ลบ (Delete - กดแล้วลบทันทีไม่มีการถามยืนยัน), ปรับขนาด (Resize) และย้ายตำแหน่ง (Rearrange) ได้
        - **4. Fixed Zen Frame Philosophy (Final Design Locked - DASHBOARD ONLY):**
            - **Viewport Locking:** พื้นที่ Dashboard จะถูกล็อคให้พอดีกับหน้าจอ (View-port) เสมอ โดยไม่มีการ Scroll ขึ้น-ลง
            - **Fluid Proportions:** ใช้ระบบสัดส่วนที่ปรับตัวอัตโนมัติจากขนาดจอ (Dynamic Scaling) โดยใช้สัดส่วนทองคำ
            - **Zen Constraint:** หากจอมีขนาดกว้างพิเศษ (Ultrawide) ระบบจะรักษาสัดส่วนกลางจอไว้
        - **5. Absolute Grid Persistence & Precision (Architecture Locked): [FINALIZED - ZERO GAP SYSTEM]**
            - **Dynamic Grid Configurator:** ในโหมด Layout จะปรากฏ **"แผงควบคุม Grid" (Floating Panel)** ด้านขวาล่างเพื่อปรับจำนวน Column/Row (จำกัดสูงสุด 20x16)
            - **3-Level Grid Visibility:**
                - **Normal:** ไม่แสดงเส้น Grid (Pure Obsidian Void)
                - **Edit Mode:** แสดงเครื่องหมายจุดตัด **"Plus Grid" (`+`)** จางๆ 30% Opacity เพื่อช่วยสำหรับการจัดวาง
                - **Layout Mode:** แสดงเครื่องหมาย `+` ชัดเจน 90% (สีขาวเรืองแสง) พร้อม **ตัวเลขพิกัด (Coordinates)** เป็นวงกลมสีเขียวมรกตที่ขอบบนและซ้าย
            - **0px Snap Alignment Rule:**
                - บล็อกทุกประเภท (Vis) จะต้อง Snap เข้ากับเครื่องหมาย `+` โดยตรง
                - **มุมทั้ง 4 มุม** ของบล็อกจะต้องตรงกับจุดกึ่งกลางของเครื่องหมาย `+` ทั้ง 4 จุดแบบพอดี (0px gap) เพื่อให้บล็อกครอบคลุมพื้นที่ Grid Cell ได้อย่างสมบูรณ์แบบ
            - **Coordinate Logic:**
                - วงกลมพิกัดสีเขียวจะนับลำดับช่อง (Cells) เริ่มจาก 1
                - ตำแหน่งของวงกลมพิกัดจะอยู่ **กึ่งกลางช่อง** (ระหว่างเครื่องหมาย `+`) เสมอ เพื่อความชัดเจนในการระบุตำแหน่งช่อง
            - **Tactile Drag & Resize (Solid Object):**
                - ระบบการลากและปรับขนาดจะเป็น **"Snap-to-Grid" 100%** เสมอ
                - วัตถุหยุดเคลื่อนที่ทันทีเมื่อชนกัน (Solid Barrier) และโชว์สีแดงจางๆ ที่จุดที่ชน
        - **6. Smart Overflow & Add Logic:**
            - ปุ่มเพิ่ม Block (+) จะเพิ่มขนาด 1x1 ลงใน **"ที่ว่างแรกสุดที่พบในหน้าปัจจุบัน"** (First available slot of the current page)
            - หากหน้าปัจจุบันเต็ม ระบบจะ Drift ไปหาที่ว่างในหน้าถัดไปโดยอัตโนมัติ
            - **Limit:** รองรับสูงสุดที่ **3 หน้า Dashboard** เท่านั้น หากเต็มทุกหน้าปุ่ม (+) จะเปลี่ยนเป็นสี Rose Red และระบุว่า Dashboard Full
        - **7. Drift Navigation:**
            - **Navigation:** ปุ่มลูกศรซ้าย/ขวา (Minimal Arrows) จะล่องหน (Ghost Hover) และปรากฏขึ้นที่ขอบจอเมื่อนำเมาส์ไปวางใกล้ๆ เท่านั้น
            - **Proportional Scaling:** รักษา Aspect Ratio ของ Dashboard ทั้งชุด
            - เน้นการ Slide ที่นุ่มนวล (60 FPS Focus)
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
        - **Zone 3 (History Table):** (ดีไซน์ตามรูปต้นแบบล่าสุด - Zen History Table 10/10)
            - **Header:** "ประวัติสินทรัพย์ (Asset History)" พร้อมเส้น Emerald แนวตั้ง
            - **Subtitle:** "ทุกรายการคือเมล็ดพันธุ์ ทุกบันทึกคือรากฐาน"
            - **Table 9 Columns:** 
                1. **วันที่:** 08-Apr-2026 (จาง)
                2. **ประเภท:** Badge สี (BUY = สีเขียว)
                3. **ประเภท (CATEGORY):** ข้อความ (เช่น Crypto, Stock)
                4. **สินทรัพย์:** ไอคอนสีจริง + Bitcoin (BTC)
                5. **จำนวน:** ตัวเลขปกติ
                6. **ราคา (USD):** $64,250.00
                7. **มูลค่ารวม:** **$3,341.00 (ตัวหนาเข้ม)**
                8. **โน้ต:** ไอคอน 💬
                9. **การจัดการ:** ไอคอนแก้ไข ✏️ และ ลบ 🗑️
            - **Pagination Footer:** Rows per page (10, 25, 50) | Showing 1-3 of 25 | ปุ่มลูกศร < >
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
        - **Navigation Structure (Global Top Header): [FINALIZED - DESIGN LOCKED]**
            - **Right-Aligned Navi-bar (Next to Utilities):**
                1. Dashboard
                2. Asset Mart
                3. Transaction-Log (T-log)
                4. เป้าหมาย (Goal)
                5. Plans (Icon ✨)
            - **Utility Icons (Right):** Theme Toggle (🌙), Profile (👤), Settings (⚙️) - กั้นด้วย Divider แนวตั้งถาวร
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
    - **Asset Mart** แหล่งรวมข้อมูลราคาและรายละเอียดของสินทรัพย์ (External Data) **[FINALIZED - DESIGN LOCKED]**
        - **Vision:** แหล่งข้อมูลศูนย์กลางที่พรีเมียมและลึกซึ้ง เพื่อช่วยในการตัดสินใจลงทุนโดยไม่ต้องสลับแพลตฟอร์ม
        - **Workflow & Layout Logic:**
            1. **Step 1: Mart Entry:** เข้าสู่หน้าหลัก Asset Mart ผ่าน Navi-bar
            2. **Step 2: Category Selection:** แสดงหมวดหมู่สินทรัพย์ 7 ประเภทในรูปแบบ **Bento Grid**
                - **Layout (60/40 Split):** 
                    - **Zone 1 (60%):** Bento Grid (3-3-1) ประกอบด้วย หุ้น, ตราสารหนี้, กองทุน (แถว 1) | Crypto, สินค้าโภคภัณฑ์, อสังหาฯ (แถว 2) | อื่นๆ (แถว 3 - กว้างเท่ากับ 3 การ์ดบนรวมกัน)
                    - **Zone 2 (40%):** Follow List (Persistent Sidebar) สำหรับติดตามราคาสินทรัพย์ตัวโปรด
                - **Interaction:** ทุกการ์ดใน Bento จะมีเอฟเฟกต์ **Emerald Glow** และเรืองแสงเมื่อ Hover
            3. **Step 3: Asset Inventory:** แสดงรายการสินทรัพย์ทั้งหมดในหมวดที่เลือกแบบ Detailed List
                - **Layout (Full-width Focus):** ซ่อน Follow List เพื่อขยายพื้นที่แสดงข้อมูลตารางสินทรัพย์ให้สะอาดตาและชัดเจนที่สุด
            4. **Step 4: Deep Dive Detail:** หน้าจอ **"The Portfolio Intelligence"** สำหรับวิเคราะห์เชิงลึก
                - **Layout (Full-width Center):** ดีไซน์แบบ Zen เน้นความสมมาตรและข้อมูลที่ทรงพลัง
        - **Detail View Components:**
            - **Identity:** ชื่อสินทรัพย์, Logo ขนาดใหญ่ และ Branding Tag
            - **Core Metrics Grid:** Current Price, Market Cap, Cost Basis (Adj), และ Total ROI
            - **Visualizer Card:** พื้นที่กราฟราคาเทคนิค (Price Visualizer) พร้อมระบบเลือก Time-range (1D, 1W, 1M, 1Y, ALL)
            - **Intelligence Insights:** ส่วนวิเคราะห์ Fundamental และ Market Sentiment (Fear & Greed Index)
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
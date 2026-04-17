# 🏛️ UI Component Glossary (PLANTO)

เอกสารรวบรวมคำศัพท์เฉพาะ (Technical Terms) ที่ใช้ในการระบุองค์ประกอบของ UI ภายใต้อาร์คิเทคเจอร์ของโปรเจค PLANTO เพื่อความเข้าใจที่ตรงกันระหว่าง User และ Agent

---

## 💎 Common UI Tokens (พื้นฐาน)

| คำศัพท์ (Term) | คำอธิบาย | ตัวอย่างการใช้งาน |
| :--- | :--- | :--- |
| **ZenField** | ช่อง Input ที่มีดีไซน์แบบ Minimalist และ Tactile | ฟอร์มกรอกราคาสินทรัพย์ |
| **GlassContainer** | คอนเทนเนอร์ที่มีเอฟเฟกต์โปร่งแสง (Frosted Glass) | บล็อกบน Dashboard, Header |
| **EmeraldGlow** | เอฟเฟกต์แสงฟุ้งสีเขียวมรกต (`#10b981`) | ปุ่ม Hover, สถานะ Active |

---

## 💳 Subscription & Pricing Components (หน้าแผนราคา)

อ้างอิงจากดีไซน์ Subscription Plans:

| คำศัพท์ (Term) | ส่วนประกอบใน UI | หน้าที่/ความรับผิดชอบ |
| :--- | :--- | :--- |
| **PricingGrid** | Layout Container | จัดการการวาง Card แบบ Responsive (Grid/Flex) |
| **PricingCard** | Plan Wrapper | กล่องสี่เหลี่ยมที่ห่อหุ้มข้อมูลทั้งหมดของหนึ่งแผน |
| **PlanTitle** | Header Text | ชื่อของแผน เช่น *Sync*, *Publish*, *Standard* |
| **PriceTag** | Typography | แสดงราคาหลักและสกุลเงิน (เด่นที่สุดใน Card) |
| **BillingCycle** | Muted Text | บอกเงื่อนไขการเก็บเงิน เช่น *per month, billed annually* |
| **PrimaryAction** | High-Priority Button | ปุ่ม Call-to-Action หลัก (เช่น *Sign up*) |
| **SecondaryAction** | Ghost/Ghost-like Button | ปุ่มทางเลือกเสริม (เช่น *Learn more*) |
| **FeatureList** | List Wrapper | กลุ่มของรายการฟีเจอร์ที่อยู่ในแผนนั้นๆ |
| **FeatureItem** | Icon + Text | ตัวฟีเจอร์แต่ละบรรทัด (Checkmark + Description) |

---

## 📊 Dashboard Modules (หน้าแดชบอร์ด)

| คำศัพท์ (Term) | คำอธิบาย |
| :--- | :--- |
| **DriftDisplay** | ระบบการแสดงผลที่ดูลื่นไหลและมีการเคลื่อนไหวเบาๆ |
| **BlocksLayer** | เลเยอร์ที่จัดการการวางบล็อกทั้งหมดบน Grid |
| **DashboardBlock** | วิดเจ็ตหรือบล็อกอิสระที่แสดงข้อมูลเฉพาะอย่าง (เช่น Allocation Pie) |

---

> [!TIP]
> **การสื่อสาร:** เมื่อต้องการปรับแต่ง UI คุณสามารถระบุชื่อ Component เหล่านี้ได้เลย เช่น *"ช่วยเปลี่ยนสีพื้นหลังของ PricingCard"* หรือ *"ย้าย PrimaryAction ไปไว้ข้างล่าง FeatureList"*

---
description: "ช่วยแยก (Refactor) Logic หน่อย"
---

ตอนนี้ไฟล์ [ระบุชื่อไฟล์] เริ่มมีความซับซ้อนสูงเกินไป (High Cognitive Load)
ช่วยทำ 'Modular Refactoring' ตามแนวทางดังนี้:

1. แยก Logic ที่เป็น Business Logic ออกไปเป็น Custom Hook หรือ Utility Function
2. แยก UI ส่วนย่อยๆ ออกเป็น Sub-components
3. ตรวจสอบให้มั่นใจว่า Props ที่ส่งต่อกันมีความชัดเจน (Clean Interface)
4. อัปเดต README_ARCH.md หากมีการเปลี่ยนแปลงโครงสร้างไฟล์ที่สำคัญ"
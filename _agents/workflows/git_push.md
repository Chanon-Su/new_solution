---
description: "ตรวจเช็คความปลอดภัย (Gitignore) และ Push งานขึ้น GitHub"
---

1. **ตรวจสอบความปลอดภัย (Security Check):**
   - ตรวจสอบไฟล์ที่ไม่ได้ถูก Track (`git status --porcelain`)
   - ค้นหาไฟล์สุ่มเสี่ยงที่อาจหลุดรอดจาก `.gitignore` (เช่น `.env`, `*.key`, `*.pem`)
   - หากพบไฟล์เหล่านี้ที่ไม่ได้อยู่ใน `.gitignore` ให้หยุดงานและแจ้งเตือนผู้ใช้ทันที

2. **เตรียมการ Commit:**
   - รัน `git add .`
   - สรุปการเปลี่ยนแปลงในรูปแบบ Semantic Commit

3. **ดำเนินการ Push:**
   // turbo
   - รันคำสั่ง `git commit -m "[message]"`
   // turbo
   - รันคำสั่ง `git push origin [current-branch]`

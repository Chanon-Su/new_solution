---
description: "Workflow สำหรับ Push งานขึ้น GitHub และ Publish ขึ้น GitHub Pages (Production)"
---

1. **ตรวจสอบความปลอดภัย (Security Check):**
   - ตรวจสอบไฟล์ที่ไม่ได้ถูก Track (`git status --porcelain`)
   - ค้นหาไฟล์สุ่มเสี่ยงที่อาจหลุดรอดจาก `.gitignore` (เช่น `.env`, `*.key`, `*.pem`)
   - หากพบไฟล์เหล่านี้ที่ไม่ได้อยู่ใน `.gitignore` ให้หยุดงานและแจ้งเตือนผู้ใช้ทันที

2. **Source Control Sync:**
   - สรุปการเปลี่ยนแปลงที่เกิดขึ้นในรอบนี้
   // turbo
   - รัน `git add .`
   // turbo
   - รัน `git commit -m "chore: update and deploy [brief description]"`
   // turbo
   - รัน `git push origin main` (หรือ branch ปัจจุบัน)

3. **Production Deployment:**
   - แจ้งผู้ใช้ว่ากำลังเริ่มกระบวนการ Build และ Deploy ขึ้น GitHub Pages
   // turbo
   - รันคำสั่ง `cmd /c "npm run deploy"` เพื่อ Publish งานขึ้น Production
   - เมื่อเสร็จสิ้น ให้แจ้ง URL ของเว็บไซต์ [https://Chanon-Su.github.io/new_solution/](https://Chanon-Su.github.io/new_solution/) ให้ผู้ใช้ทราบ

# Error Log & Wisdom 

สมุดบันทึกปัญหาที่พบบ่อยและแนวทางการแก้ไข เพื่อลดเวลาในการ Debug ในอนาคต

## 1. Vite White Screen (Silent Fail)
- **อาการ:** หน้าจอขาวสนิท (Empty DOM) และไม่มี Error ปรากฏใน Console ของ Browser
- **สาเหตุ:**
    - **Circular Dependency:** การดึงไฟล์วนลูป (เช่น App -> CompA -> App) ทำให้ Bundler ไม่สามารถ Resolve โมดูลได้อย่างถูกต้อง ใน React/Vite เคสที่พบบ่อยคือการ export interface จาก App.tsx แล้ว Component ย่อย import กลับไปใช้
    - **Unsafe Parse:** การใช้ `JSON.parse(localStorage.getItem(...))` โดยไม่มี try-catch เมื่อข้อมูลใน LocalStorage เสียหายหรือรูปแบบเปลี่ยนไป (Schema Mismatch)
- **แนวทางแก้ไข:**
    - **Decouple Types:** แยก Shared Types/Interfaces ออกมาไว้ที่ไฟล์กลาง (เช่น `src/types.ts`)
    - **Safe Loading:** ใช้ `try-catch` ครอบการ `JSON.parse` เสมอ
    - **Route Check:** หากหน้าจอยังขาว ให้เช็คว่า `index.html` เรียกใช้ `main.tsx` ถูกต้องหรือไม่ หรือ Server มีการ Shadow ไฟล์ `index.html` หรือไม่

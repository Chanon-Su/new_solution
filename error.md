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

## 2. ESM Import SyntaxError (TypeScript Types)
- **อาการ:** `SyntaxError: The requested module ... does not provide an export named 'Transaction'`
- **สาเหตุ:** Browser (ESM) ไม่รองรับการ Import "Type" เป็น "Value" ในขณะรันไทม์ หากเรา `import { Type }` โดยไม่มีคำว่า `type` เครื่องมือ Build บางตัวอาจพยายามหาตัวแปรจริงทำให้พัง
- **แนวทางแก้ไข:** ใช้ `import type { ... }` เสมอเมื่อต้องการใช้เฉพาะ Interface หรือ Type Definition

## 3. Hook ReferenceError (Missing Imports)
- **อาการ:** หน้าจอขาว/ดำ และพบ Error `ReferenceError: useEffect is not defined` ใน Console
- **สาเหตุ:** มีการใช้ Hook (เช่น useEffect, useState) ใน React Component แต่ลืม Import มาจาก `react`
- **แนวทางแก้ไข:** ตรวจสอบการ Import ในบรรทัดแรกของไฟล์เสมอ มั่นใจว่า Hook ทุกตัวที่ใช้ถูกประกาศไว้แล้ว

## 4. React Context Mismatch (Runtime Black Screen)
- **อาการ:** แอปไม่ Crash แต่แสดงผลผิดพลาด หรือทำงานไม่ได้ในบางส่วน โดยเฉพาะเมื่อใช้ Context
- **สาเหตุ:** มีการสร้างไฟล์ Bridge (เช่น .ts ครอบ .tsx) ทำให้ React มองว่ามี Provider 2 ตัวแยกจากกัน (Instance Mismatch) ส่งผลให้ Component ลูกหา Provider ที่ตรงกันไม่เจอ
- **แนวทางแก้ไข:** รวมศูนย์ Provider และ Hook ไว้ในไฟล์เดียวกัน (เช่น `TLogManager.tsx`) และเลี่ยงการสร้างไฟล์ที่มีชื่อซ้ำกันแต่คนละนามสกุลในโฟลเดอร์เดียวกัน

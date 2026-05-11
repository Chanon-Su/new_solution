# 🌐 PLANTO Market Data API - Project Blueprint

**Project Name:** PLANTO Market Data Service (PMDS)  
**Role:** Centralized Asset Information & Real-time Market Data Provider  
**Status:** Architecture Draft v1.0 (Commercial Ready)

---

## 🎯 Project Purpose
ทำหน้าที่เป็น "Data Hub" รวบรวมข้อมูลสินทรัพย์ทั่วโลก (Stocks, Crypto, Gold, Forex, Funds) มาไว้ที่จุดเดียว เพื่อลดภาระการประมวลผลของ Frontend และบริหารจัดการข้อมูลเชิงสากล (Global Data) ให้พร้อมใช้งานสำหรับผู้ใช้ Planto ทุกคนแบบ Real-time หรือ Near Real-time

---

## 🛠️ Recommended Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Language** | TypeScript (Node.js) หรือ Python (FastAPI) | TS เพื่อให้สอดคล้องกับ Planto หรือ Python หากเน้นการจัดการข้อมูลการเงินที่มี Library เยอะ |
| **Framework** | **NestJS** (ถ้าใช้ Node.js) หรือ **FastAPI** (ถ้าใช้ Python) | ทั้งคู่รองรับการทำ Scalable API และมีประสิทธิภาพสูงในเชิงพาณิชย์ |
| **Primary Database** | **PostgreSQL** | สำหรับเก็บ Metadata ของสินทรัพย์ (ชื่อ, สัญลักษณ์, ประเภท) |
| **Caching Layer** | **Redis** | **(สำคัญมาก)** ใช้เก็บราคาล่าสุด (Live Price) เพื่อลดการเรียก External API ซ้ำซ้อน |
| **Background Job** | **BullMQ** (Node) หรือ **Celery** (Python) | สำหรับทำ Cron Jobs วิ่งไปดึงข้อมูลจากแหล่งต่างๆ ตามรอบเวลา |
| **API Style** | **REST API** (เริ่มต้น) หรือ **GraphQL** | REST เข้าใจง่ายและ Implement ได้เร็วสำหรับ Phase แรก |

---

## 🏗️ Core Architecture (Data Flow)
1. **Aggregator Layer:** ระบบ Worker วิ่งไปดึงข้อมูลจากแหล่งต่างๆ (CoinGecko, SET, Yahoo Finance, etc.)
2. **Normalization Layer:** แปลงข้อมูลจากทุกแหล่งให้มาอยู่ใน "Schema เดียวกัน" ที่ Planto เข้าใจ
3. **Storage/Cache Layer:** เก็บ Metadata ลง Postgres และเก็บราคาที่เปลี่ยนบ่อยลง Redis
4. **Delivery Layer:** ส่งข้อมูลผ่าน REST API ให้กับ Planto Frontend

---

## 📋 API Requirement & Fields

### 1. Asset Entity Schema (สิ่งที่ Planto ต้องการ)
ทุกสินทรัพย์ที่ส่งออกไปต้องมีโครงสร้างขั้นต่ำดังนี้:
```typescript
{
  "id": "uuid-string",           // ID ภายในระบบของเรา
  "symbol": "BTC",               // ชื่อย่อ
  "name": "Bitcoin",             // ชื่อเต็ม
  "category": "CRYPTO",          // [STOCK, CRYPTO, COMMODITY, FOREX, BOND, FUND]
  "price": {
    "current": 64250.00,
    "currency": "USD",
    "change24h": 1240.50,
    "percent24h": 2.4,
    "isUp": true
  },
  "metrics": {
    "marketCap": 1240000000000,
    "volume24h": 35000000000,
    "high24h": 65000.00,
    "low24h": 63000.00,
    "rank": 1
  },
  "lastUpdated": "2026-05-08T12:00:00Z"
}
```

### 2. Required Endpoints
- `GET /v1/assets`: รายการสินทรัพย์ทั้งหมด (รองรับ Query: `?category=`, `?search=`, `?page=`)
- `GET /v1/assets/{id}`: รายละเอียดเจาะลึกรายตัว
- `GET /v1/assets/{id}/history?range=1M`: ข้อมูลกราฟย้อนหลัง (1D, 1W, 1M, 1Y, ALL)
- `GET /v1/market/sentiment`: ข้อมูล Fear & Greed Index หรือสภาวะตลาดรวม

---

## ⚖️ Commercial & Operational Strategy

1. **API Key Management:** เตรียมระบบ Auth สำหรับ Planto เพื่อป้องกันการดึงข้อมูลจากคนภายนอก
2. **Rate Limiting:** จำกัดจำนวน Request ต่อนาทีเพื่อรักษาเสถียรภาพของ Server
3. **TTL (Time To Live):** กำหนดระยะเวลาการ Cache ข้อมูลราคา (เช่น 1-5 นาที) เพื่อให้ประหยัดค่า API ต้นทาง
4. **CORS Policy:** กำหนดให้เฉพาะ Domain ของ Planto เท่านั้นที่เรียกใช้ได้
5. **Circuit Breaker:** ถ้าระบบดึงข้อมูลจาก SET หรือ CoinGecko ล่ม ต้องมีระบบ Fail-safe (เช่น ใช้ราคาสุดท้ายที่มีใน Cache)

---

## 🔄 Integration with Planto (Frontend)
- **Phase 1:** เปลี่ยนจาก `mockData.ts` มาเป็นการ `fetch()` จาก API ใหม่นี้
- **Phase 2:** Implement ระบบ **Follow List** ให้ Sync กับ ID จาก API
- **Phase 3:** ใช้ข้อมูลราคาสดมาคำนวณกำไร/ขาดทุน (Real-time ROI) ในหน้า Dashboard

---

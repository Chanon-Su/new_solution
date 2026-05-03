# ⚡ PLANTO Performance & Code Quality Guidelines

> **อ่านก่อนเขียนโค้ดทุกครั้ง** — เอกสารนี้คือมาตรฐานการเขียน JavaScript/TypeScript ที่มีคุณภาพสูง  
> เป้าหมาย: โค้ดที่รันเร็ว ไม่กระตุก ใช้ memory ถูกต้อง และไม่สร้างปัญหาซ้อนทับกันในอนาคต

---

## 1. หลักการสำคัญ (ต้องจำ 3 ข้อนี้)

```
1. วัดก่อนแก้   — อย่าเดาว่าอะไรช้า ใช้ DevTools Profiler วัดจริงก่อนเสมอ
2. Stable Ref   — function/object ที่ส่งเป็น prop หรือ dep ต้องมี reference เสถียร
3. แยก Context  — ข้อมูลที่เปลี่ยนบ่อย ไม่ควรอยู่ Context เดียวกับข้อมูลที่ไม่เปลี่ยน
```

---

## 2. React Rendering Rules

### 2.1 ใช้ `useCallback` กับทุก function ที่ส่งเป็น prop

```tsx
/* ❌ ผิด — function ถูกสร้างใหม่ทุก render → child re-render โดยไม่จำเป็น */
const handleDelete = (id: string) => {
  setItems(prev => prev.filter(i => i.id !== id));
};

/* ✅ ถูก — reference stable → child ที่ใช้ React.memo จะไม่ re-render */
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []); // empty deps ได้เพราะใช้ functional update
```

**กฎ:** ทุก function ที่ส่งเป็น prop หรืออยู่ใน `useEffect` deps ต้องใช้ `useCallback`

---

### 2.2 ใช้ `useMemo` เฉพาะเมื่อคำนวณหนักจริง

```tsx
/* ❌ ไม่จำเป็น — useMemo overhead มากกว่าการคำนวณ */
const doubled = useMemo(() => count * 2, [count]);

/* ✅ ใช้เมื่อต้องวนซ้ำ array หรือ aggregate หลาย field */
const summaryByCategory = useMemo(() => {
  return transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount * tx.price;
    return acc;
  }, {} as Record<string, number>);
}, [transactions]);
```

**กฎ:** ใช้ `useMemo` เมื่อ:
- วน loop array ขนาดใหญ่ (>50 items)
- Aggregate / Group / Sort ที่มีหลาย pass
- Object ที่ถูกส่งเป็น Context value

---

### 2.3 `React.memo` กับ custom comparator

```tsx
/* ❌ ผิด — memo โดยไม่มี comparator อาจไม่ช่วยเลยถ้า object props เปลี่ยน reference */
export default React.memo(MyCard);

/* ✅ ถูก — ระบุ fields ที่ควรเช็คจริง */
export default React.memo(MyCard, (prev, next) => {
  return (
    prev.item     === next.item     && // object reference
    prev.isActive === next.isActive &&
    prev.onClick  === next.onClick     // ต้องเป็น stable ref (useCallback)
  );
});
```

**กฎ:** ใช้ `React.memo` กับ:
- Component ที่ถูก render ซ้ำๆ ใน list (map)
- Component ที่ render cost สูง (มี chart หรือ DOM node เยอะ)
- Component ใน Dashboard blocks ทั้งหมด

---

### 2.4 หลีกเลี่ยง Object/Array Literal ใน JSX

```tsx
/* ❌ ผิด — object ใหม่ทุก render → child re-render ทุกครั้ง */
<MyComponent style={{ color: 'red' }} items={['a', 'b']} />

/* ✅ ถูก — ย้ายออกไป define นอก component */
const ITEMS = ['a', 'b']; // constant นอก component (ไม่ขึ้นกับ state)

// หรือถ้าขึ้นกับ state:
const style = useMemo(() => ({ color: isError ? 'red' : 'white' }), [isError]);
```

---

## 3. Context Pattern

### 3.1 แยก Data Context กับ Action Context เสมอ

**ปัญหาของ Context เดียว:**
```tsx
/* ❌ ปัญหา — ทุก consumer re-render เมื่อ transactions เปลี่ยน
   แม้ว่า consumer นั้นต้องการแค่ addTransaction */
const { transactions, addTransaction } = useTLog();
```

**Pattern ที่ถูกต้อง:**
```tsx
/* ✅ แยก context */
// Component ที่แสดงผล — subscribe เฉพาะ data
const { transactions } = useTLogData();

// Component ที่รับ input — subscribe เฉพาะ actions (ไม่ re-render เมื่อ data เปลี่ยน)
const { addTransaction } = useTLogActions();
```

**กฎ:** ถ้า Context มีทั้ง "state ที่เปลี่ยนบ่อย" และ "function" ให้แยกออกเป็น 2 Context เสมอ

---

### 3.2 Context value ต้องใช้ `useMemo`

```tsx
/* ❌ ผิด — object ใหม่ทุก render → consumer ทั้งหมด re-render */
<MyContext.Provider value={{ data, loading, refresh }}>

/* ✅ ถูก */
const contextValue = useMemo(() => ({ data, loading, refresh }), [data, loading, refresh]);
<MyContext.Provider value={contextValue}>
```

---

## 4. Event Listener Rules

### 4.1 ห้าม DOM Layout Operation ใน event handler ที่ยิงบ่อย

```tsx
/* ❌ ผิด — getBoundingClientRect() ทุก mousemove = layout reflow ที่ 60fps */
window.addEventListener('mousemove', (e) => {
  const rect = element.getBoundingClientRect(); // layout reflow ทุก frame
  const x = (e.clientX - rect.left) / rect.width;
});

/* ✅ ถูก — cache ไว้ใน ref ตอน mousedown ครั้งเดียว */
const metrics = useRef({ left: 0, width: 0 });

element.addEventListener('mousedown', () => {
  const rect = element.getBoundingClientRect(); // อ่านครั้งเดียว
  metrics.current = { left: rect.left, width: rect.width };
});

window.addEventListener('mousemove', (e) => {
  // ใช้ cache — ไม่มี layout reflow
  const x = (e.clientX - metrics.current.left) / metrics.current.width;
});
```

**DOM Operations ที่ trigger Layout Reflow (ห้ามใช้ใน event handler ที่ยิงบ่อย):**

| Property / Method | ทำให้เกิดอะไร |
|---|---|
| `getBoundingClientRect()` | Force layout |
| `offsetWidth`, `offsetHeight` | Force layout |
| `scrollTop`, `scrollLeft` | Force layout |
| `clientWidth`, `clientHeight` | Force layout |
| `getComputedStyle()` | Force style recalc |

---

### 4.2 Cleanup event listener เสมอ

```tsx
/* ❌ ผิด — memory leak */
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

/* ✅ ถูก */
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [handleResize]); // handleResize ต้องเป็น stable ref (useCallback)
```

---

### 4.3 Attach listener เฉพาะช่วงที่ต้องการ

```tsx
/* ❌ ผิด — listener active ตลอดเวลา ทั้งที่ใช้เฉพาะช่วง drag */
useEffect(() => {
  window.addEventListener('mousemove', handleMove);
  return () => window.removeEventListener('mousemove', handleMove);
}, []);

/* ✅ ถูก — attach เฉพาะช่วง isDragging */
useEffect(() => {
  if (!isDragging) return;
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleUp);
  return () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
  };
}, [isDragging, handleMove, handleUp]);
```

---

## 5. State Management Rules

### 5.1 ใช้ Functional Update เสมอเมื่อ state ขึ้นกับ state เดิม

```tsx
/* ❌ ผิด — อาจอ่าน stale state ถ้ามี batch update */
const add = () => setCount(count + 1);

/* ✅ ถูก — functional update รับ state ล่าสุดเสมอ */
const add = () => setCount(prev => prev + 1);
```

**กฎ:** ใช้ `setState(prev => ...)` ทุกครั้งที่ค่าใหม่คำนวณจากค่าเดิม

---

### 5.2 ไม่แชร์ state ที่ไม่เกี่ยวกันใน useState เดียว

```tsx
/* ❌ ผิด — เปลี่ยน isLoading ก็ต้อง spread ทั้ง object */
const [uiState, setUiState] = useState({ isLoading: false, isOpen: false, count: 0 });

/* ✅ ถูก — แยก state ที่ update ด้วยเหตุผลต่างกัน */
const [isLoading, setIsLoading] = useState(false);
const [isOpen, setIsOpen]       = useState(false);
const [count, setCount]         = useState(0);
```

---

### 5.3 ห้าม Derive State จาก Props ใน useState

```tsx
/* ❌ ผิด — state ไม่ sync กับ prop เมื่อ prop เปลี่ยน */
const [name, setName] = useState(props.user.name);

/* ✅ ถูก — ใช้ useMemo หรืออ่าน prop โดยตรง */
const displayName = useMemo(() => props.user.name.toUpperCase(), [props.user.name]);
```

---

## 6. localStorage Rules

### 6.1 อ่าน localStorage ครั้งเดียวต่อ session

```ts
/* ❌ ผิด — parse JSON ซ้ำหลายรอบสำหรับ key เดียว */
const columns = JSON.parse(localStorage.getItem('key'))?.columns;
const rows    = JSON.parse(localStorage.getItem('key'))?.rows;
const blocks  = JSON.parse(localStorage.getItem('key'))?.blocks;

/* ✅ ถูก — parse ครั้งเดียว ดึงทุก field */
function loadState() {
  try {
    const raw = localStorage.getItem('key');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
const saved   = loadState();
const columns = saved?.columns ?? DEFAULT_COLUMNS;
const rows    = saved?.rows    ?? DEFAULT_ROWS;
const blocks  = saved?.blocks  ?? DEFAULT_BLOCKS;
```

---

### 6.2 ใช้ in-memory cache สำหรับ data ที่ read บ่อย

```ts
/* Pattern ที่โปรเจคนี้ใช้ใน storage.ts */
let cache: Transaction[] | null = null;

export const loadTransactions = (): Transaction[] => {
  if (cache) return cache; // return cache ทันที ไม่อ่าน localStorage
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : [];
    return cache!;
  } catch { return []; }
};

export const saveTransactions = (data: Transaction[]): void => {
  localStorage.setItem(KEY, JSON.stringify(data));
  cache = data; // update cache พร้อมกัน
};
```

---

### 6.3 ห้ามอ่าน localStorage ใน render path (ใน component โดยตรง)

```tsx
/* ❌ ผิด — อ่าน localStorage ทุกครั้งที่ component render */
const MyComponent = () => {
  const rate = JSON.parse(localStorage.getItem('rate') || '35');
  return <div>{rate}</div>;
};

/* ✅ ถูก — อ่านใน useMemo([]) หรือ useState initializer (รันครั้งเดียว) */
const MyComponent = () => {
  const rate = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('rate') || '35'); }
    catch { return 35; }
  }, []); // deps ว่าง = คำนวณครั้งเดียวตอน mount
  return <div>{rate}</div>;
};
```

---

## 7. TypeScript Quality Rules

### 7.1 ห้ามใช้ `any` — ใช้ `unknown` แทน

```ts
/* ❌ ห้ามทำ */
const data: any = JSON.parse(raw);
function process(input: any) { }

/* ✅ ถ้าไม่รู้ type ให้ใช้ unknown แล้ว narrow */
const data: unknown = JSON.parse(raw);
if (Array.isArray(data)) {
  // TypeScript รู้แล้วว่าเป็น array
}

/* ✅ หรือ type guard */
function isTransaction(obj: unknown): obj is Transaction {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}
```

---

### 7.2 ใช้ `type` กับ `interface` ให้ถูกวัตถุประสงค์

```ts
/* type — union, intersection, alias */
type Status    = 'pending' | 'success' | 'error';
type Nullable<T> = T | null;
type VisData   = SeriesData | TimeSeriesData | EmptyData;

/* interface — object shape ที่ต้องการ extend ได้ */
interface Transaction {
  id: string;
  date: string;
  asset: string;
  amount: number;
}

interface TransactionWithBroker extends Transaction {
  broker: string;
}
```

---

### 7.3 ระบุ return type ทุก function

```ts
/* ❌ ขาด type */
const calculate = (txs, rate) => txs.reduce((acc, tx) => acc + tx.amount * rate, 0);

/* ✅ ครบ */
const calculate = (txs: Transaction[], rate: number): number =>
  txs.reduce((acc, tx) => acc + tx.amount * rate, 0);
```

---

### 7.4 ตรวจ types.ts ก่อนสร้าง interface ใหม่เสมอ

ก่อนสร้าง interface ใหม่ ให้เปิด `src/types.ts` ดูก่อนว่ามีอยู่แล้วหรือเปล่า  
Type ที่มีอยู่แล้วในโปรเจค:

```
Transaction     DashboardBlock    VisConfig         VisType
VisCurrency     VisFilter         VisDateRange      Milestone
SubChecklist    QuickFillEntry    FollowedAsset     UserSettings
```

---

## 8. Hook Design Rules

### 8.1 1 Hook = 1 Responsibility

```ts
/* ❌ Hook ที่ทำหลายอย่างเกินไป */
function useEverything() {
  // โหลด data, จัดการ UI state, handle form, format output
}

/* ✅ แยก responsibility ให้ชัด */
function useTLogData()      { /* โหลดและ derive data เท่านั้น */ }
function useTLogActions()   { /* mutations เท่านั้น */ }
function useHistoryFilter() { /* filter/sort UI state เท่านั้น */ }
```

---

### 8.2 Custom Hook ต้องมี JSDoc

```ts
/**
 * อ่านข้อมูล transaction และ derived data (read-only)
 * @returns transactions (sorted desc), assetSummaries, isLoading
 * ใช้ useTLogActions() สำหรับ mutations — จะไม่ re-render เมื่อ action ถูกเรียก
 */
export const useTLogData = (): TLogDataContextType => { ... };
```

---

### 8.3 ระวัง `useMemo` chain ลึกเกิน 3 ระดับ

```
ถ้า: A → B → C → D → E  (chain 5 ระดับ)
การเปลี่ยน A = invalidate ทั้ง chain พร้อมกัน = CPU spike

แก้ด้วย:
1. แยก chain ออกถ้า D, E ไม่ได้ขึ้นกับ A จริงๆ
2. ใช้ startTransition() เพื่อ mark การคำนวณเป็น low priority
3. พิจารณา debounce input ก่อน trigger chain
```

---

## 9. Performance Anti-Patterns (ห้ามทำ)

```
❌ getBoundingClientRect() ใน mousemove/scroll handler
❌ JSON.parse() ใน render function โดยตรง
❌ ส่ง inline object/array เป็น prop: value={{ a: 1 }} หรือ items={[]}
❌ สร้าง function ใน render แล้วส่งเป็น prop โดยไม่ใช้ useCallback
❌ อ่าน localStorage หลายครั้งสำหรับ key เดียวใน function เดียว
❌ useMemo chain ลึกกว่า 3 ระดับโดยไม่มีเหตุผล
❌ useEffect deps ที่เป็น object/function ที่ไม่ stable
❌ Context value ที่ไม่ได้ wrap ด้วย useMemo
❌ addEventListener โดยไม่มี removeEventListener ใน cleanup
❌ setState จาก state เดิม โดยไม่ใช้ functional update
❌ any type ใน TypeScript
❌ Derive state จาก prop ใน useState
```

---

## 10. Checklist ก่อน Commit

```
Performance:
□ function ที่ส่งเป็น prop ใช้ useCallback ครบ
□ Context value ใช้ useMemo ครบ
□ ไม่มี DOM layout operation ใน event handler ที่ยิงบ่อย
□ Event listener มี cleanup ทุกตัว
□ localStorage อ่านครั้งเดียวต่อ key ต่อ session

Code Quality:
□ ไม่มี any type (ยกเว้น third-party ที่จำเป็นจริงๆ)
□ ทุก function มี return type ระบุชัดเจน
□ ไม่มี variable ที่ประกาศแต่ไม่ได้ใช้ (TS warning)
□ ไม่มี console.log() ที่ลืมลบ
□ Custom hook มี JSDoc comment

State:
□ useState ที่ขึ้นกับค่าเดิมใช้ functional update
□ State ที่ derive ได้จาก existing state ใช้ useMemo แทน useState ใหม่
□ ไม่มี Derived State จาก Props ใน useState
```

---

## 11. เครื่องมือวัด Performance

### Chrome DevTools

```
Performance Tab:
  1. กด Record
  2. ทำ action ที่สงสัยว่าช้า (drag, scroll, type)
  3. กด Stop
  4. ดู "Scripting" และ "Layout" time ใน flame chart

React DevTools Profiler:
  1. ติดตั้ง React DevTools extension
  2. ไปที่ Profiler tab → กด Record
  3. ทำ action → Stop
  4. Flamegraph แสดงว่า component ไหน render นานที่สุด
  5. ดู "Why did this render?" เพื่อหาสาเหตุ
```

### เกณฑ์ตัดสิน

| ตัวชี้วัด | ปกติ | ต้องแก้ |
|---|---|---|
| Scripting per frame | < 16ms | > 50ms |
| Layout per frame | < 5ms | > 10ms |
| Component re-render | ตาม data จริง | re-render โดยไม่มี data เปลี่ยน |

---

## 12. เมื่อไม่แน่ใจ

1. **ดู Chrome DevTools ก่อนเสมอ** — อย่าเดาว่าอะไรช้า
2. **ถามว่า "component นี้ render บ่อยแค่ไหน?"** — ถ้าบ่อย → `React.memo`
3. **ถามว่า "function นี้ส่งเป็น prop ไหม?"** — ถ้าใช่ → `useCallback`
4. **ถามว่า "คำนวณนี้ใช้เวลาไหม?"** — ถ้าวน loop → `useMemo`
5. **อ่าน `README_ARCH.md`** เสมอก่อนเริ่มงานใหม่

> [!IMPORTANT]
> เอกสารนี้ไม่ใช่ข้อเสนอแนะ — เป็นมาตรฐานที่ต้องปฏิบัติตาม  
> ถ้าต้องการยกเว้นกฎข้อใด ให้อธิบายเหตุผลใน code comment ก่อนทำเสมอ

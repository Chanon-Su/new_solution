// ─── mockPriceHistory.ts ─────────────────────────────────────────────────────
// สร้าง price series จำลองสำหรับ AssetMart Line Chart
// ใช้ deterministic random (seed จาก symbol) → graph ไม่เปลี่ยนทุก render

export interface PricePoint {
  date: string;   // ISO date string
  price: number;
}

/** Simple seeded pseudo-random number generator (Mulberry32) */
function createRng(seed: number) {
  return () => {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** แปลง symbol string เป็น seed number */
function symbolToSeed(symbol: string): number {
  return symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

/** แปลง roi string (เช่น '+12.5%' หรือ '-3.2%') เป็น number */
function parseRoi(roi: string): number {
  const num = parseFloat(roi.replace(/[^0-9.\-]/g, ''));
  return isNaN(num) ? 0 : num / 100;
}

const PRESET_CONFIG: Record<string, { points: number; labelFn: (i: number, now: Date) => string }> = {
  '1D': {
    points: 24,
    labelFn: (i, now) => {
      const d = new Date(now);
      d.setHours(now.getHours() - (24 - i));
      return `${d.getHours().toString().padStart(2, '0')}:00`;
    },
  },
  '1W': {
    points: 7,
    labelFn: (i, now) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (7 - i));
      return d.toLocaleDateString('th-TH', { weekday: 'short' });
    },
  },
  '1M': {
    points: 30,
    labelFn: (i, now) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (30 - i));
      return `${d.getDate()}/${d.getMonth() + 1}`;
    },
  },
  '1Y': {
    points: 12,
    labelFn: (i, now) => {
      const d = new Date(now);
      d.setMonth(now.getMonth() - (12 - i));
      return d.toLocaleDateString('th-TH', { month: 'short' });
    },
  },
  'ALL': {
    points: 36,
    labelFn: (i, now) => {
      const d = new Date(now);
      d.setMonth(now.getMonth() - (36 - i));
      return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`;
    },
  },
};

/**
 * สร้าง mock price series
 * @param symbol  - ชื่อ asset เพื่อใช้เป็น seed (deterministic)
 * @param currentPrice - ราคาปัจจุบัน
 * @param roi - string เช่น '+12.5%' หรือ '-3.2%'
 * @param preset - '1D' | '1W' | '1M' | '1Y' | 'ALL'
 */
export function generateMockPriceHistory(
  symbol: string,
  currentPrice: number,
  roi: string,
  preset: '1D' | '1W' | '1M' | '1Y' | 'ALL' = '1M'
): PricePoint[] {
  const config = PRESET_CONFIG[preset] ?? PRESET_CONFIG['1M'];
  const rng = createRng(symbolToSeed(symbol) + preset.charCodeAt(0));
  const roiFraction = parseRoi(roi);
  const now = new Date();

  // คำนวณราคาเริ่มต้น (ย้อนกลับจากราคาปัจจุบัน)
  const startPrice = currentPrice / (1 + roiFraction);
  const totalChange = currentPrice - startPrice;

  const points: PricePoint[] = [];

  for (let i = 0; i < config.points; i++) {
    // trend component: เพิ่มขึ้นเชิงเส้นตาม roi
    const trend = startPrice + (totalChange * (i / (config.points - 1)));
    // noise component: ±3% random walk
    const noise = (rng() - 0.5) * 2 * 0.03 * currentPrice;
    const price = Math.max(0.01, trend + noise);

    points.push({
      date: config.labelFn(i, now),
      price: Math.round(price * 100) / 100,
    });
  }

  // ทำให้จุดสุดท้ายเป็น currentPrice จริงๆ เสมอ
  if (points.length > 0) {
    points[points.length - 1].price = currentPrice;
  }

  return points;
}

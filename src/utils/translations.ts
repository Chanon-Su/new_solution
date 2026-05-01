export type Language = 'th' | 'en';

export const translations = {
  th: {
    common: {
      loading: 'กำลังโหลด...',
      noData: 'ยังไม่มีข้อมูล',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      save: 'บันทึก',
      delete: 'ลบ',
      edit: 'แก้ไข',
    },
    nav: {
      dashboard: 'Dashboard',
      assetMart: 'Asset-Mart',
      tlog: 'Transaction-Log',
      insight: 'Insight',
      goal: 'Goals',
      settings: 'ตั้งค่า',
      profile: 'โปรไฟล์',
    },
    profile: {
      title: 'โปรไฟล์ผู้ใช้',
      subtitle: 'สมาชิก Premium Alpha ✨',
      plan: 'แผนปัจจุบัน',
      status: 'สถานะ',
      active: 'ใช้งานอยู่',
      inactive: 'ไม่ได้เป็นสมาชิก',
    },
    settings: {
      title: 'ตั้งค่า',
      subtitle: 'จัดการความพึงพอใจและระบบความเป็นส่วนตัวของคุณ',
      sections: {
        localization: 'บัญชีและการระบุตำแหน่ง',
        privacy: 'ความปลอดภัยและความเป็นส่วนตัว',
        danger: 'โซนอันตราย',
      },
      language: {
        label: 'ภาษา (Language)',
        desc: 'เลือกภาษาที่คุณต้องการใช้งานในแอปพลิเคชัน',
      },
      timezone: {
        label: 'Timezone Offset',
        desc: 'กำหนดเขตเวลาท้องถิ่นสำหรับการแสดงผลประวัติธุรกรรม',
      },
      privacy: {
        hideNumbers: {
          label: 'ซ่อนตัวเลข (Hide Numbers)',
          desc: 'แทนที่จำนวนเงิน ราคา และค่าธรรมเนียมด้วย ********',
        },
        hideText: {
          label: 'ซ่อนรายละเอียดข้อความ (Hide Text)',
          desc: 'แทนที่ชื่อสินทรัพย์ วันที่ สกุลเงิน และโน้ตด้วย ********',
        },
      },
      nuke: {
        label: 'ล้างข้อมูลทั้งหมด (Nuke)',
        desc: 'ลบธุรกรรม เป้าหมาย และการตั้งค่าทั้งหมดถาวร ไม่สามารถย้อนกลับได้',
        btn: 'รีเซ็ตทุกอย่าง',
        confirm: 'ยืนยันการล้างข้อมูล',
      }
    },
    tlog: {
      form: {
        title: 'บันทึกธุรกรรม',
        asset: 'ชื่อสินทรัพย์',
        type: 'ประเภท',
        category: 'หมวดหมู่',
        amount: 'จำนวน',
        price: 'ราคาหน่วย',
        currency: 'สกุลเงิน',
        fee: 'ค่าธรรมเนียม (สุทธิ)',
        notes: 'โน้ตเพิ่มเติม',
        submit: 'บันทึกรายการ',
        update: 'อัปเดตรายการ',
      },
      summary: {
        title: 'สรุปสินทรัพย์',
        units: 'หน่วย',
        divPerShare: 'ปันผล/หุ้น',
        avgDiv: 'ปันผลเฉลี่ย:',
      },
      history: {
        title: 'ประวัติธุรกรรม',
        tabs: {
          all: 'ทั้งหมด',
          buy: 'ซื้อ',
          sell: 'ขาย',
          dividend: 'ปันผล',
        },
        table: {
          date: 'วันที่',
          type: 'ประเภท',
          asset: 'สินทรัพย์',
          category: 'หมวดหมู่',
          amount: 'จำนวน',
          price: 'ราคาหน่วย',
          fee: 'ค่าธรรมเนียม',
          total: 'รวมสุทธิ',
          currency: 'สกุลเงิน',
          notes: 'โน้ต',
          actions: 'จัดการ',
        }
      }
    },
    goals: {
      title: 'เป้าหมาย',
      addBtn: 'เพิ่มเป้าหมาย',
      tabs: {
        active: 'กำลังดำเนินการ',
        completed: 'สำเร็จแล้ว',
      },
      card: {
        progress: 'ความคืบหน้า',
        target: 'เป้าหมาย:',
        remaining: 'ขาดอีก:',
      }
    },
    assetMart: {
      categories: {
        stocks: { name: 'หุ้น', desc: 'หุ้นไทย และตลาดโลก' },
        fixedincome: { name: 'ตราสารหนี้', desc: 'พันธบัตรและหุ้นกู้' },
        funds: { name: 'กองทุนรวม', desc: 'การออมผ่านผู้เชี่ยวชาญ' },
        crypto: { name: 'สินทรัพย์ดิจิทัล', desc: 'Bitcoin และเหรียญทางเลือก' },
        commodities: { name: 'สินค้าโภคภัณฑ์', desc: 'ทองคำ, น้ำมัน, แร่ธาตุ' },
        realestate: { name: 'อสังหาริมทรัพย์', desc: 'ที่ดิน, อาคาร, REITs' },
        others: { name: 'อื่นๆ', desc: 'ทรัพย์สินทางเลือกและหมวดหมู่เพิ่มเติม' },
      },
      search: 'ค้นหาสินทรัพย์...',
      inventory: {
        back: 'ย้อนกลับ',
        directory: 'สารบัญสินทรัพย์',
        marketStatus: 'สถานะตลาด: เปิดทำการ',
        synced: 'เชื่อมต่อข้อมูลเรียลไทม์',
        table: {
          asset: 'ชื่อสินทรัพย์ / สัญลักษณ์',
          price: 'ราคาปัจจุบัน',
          change: 'เปลี่ยนแปลง (24H)',
          roi: 'ผลตอบแทน (ROI)',
          actions: 'จัดการ',
        },
        allAssets: 'สำรวจสินทรัพย์ทั้งหมด',
      },
      detail: {
        back: 'ย้อนกลับไปรายการ',
        tags: 'สินทรัพย์ดิจิทัล • ตลาดโลก • ข้อมูลยืนยันแล้ว',
        follow: 'ติดตาม',
        following: 'ติดตามแล้ว',
        metrics: {
          price: 'ราคาปัจจุบัน',
          marketCap: 'มูลค่าตลาด',
          high24h: 'สูงสุด 24 ชม.',
          low24h: 'ต่ำสุด 24 ชม.',
          costBasis: 'ต้นทุนเฉลี่ย (ปรับปรุง)',
          totalRoi: 'ROI รวม',
          peak: 'ราคาสูงสุดรอบวัน',
          floor: 'ราคาต่ำสุดรอบวัน',
          rank: 'อันดับที่ #1 ในตลาด',
          divAdj: 'ปรับปรุงตามเงินปันผล',
          historical: 'ผลประกอบการย้อนหลัง',
        },
        visualizer: {
          title: 'Price Visualizer',
          analysis: 'การวิเคราะห์ปัจจัยพื้นฐาน',
          sentiment: 'Market Sentiment',
          fearGreed: 'Fear & Greed',
          volatility: 'ความผันผวน',
          volMedium: 'ปานกลาง',
          forexDesc: 'อัตราแลกเปลี่ยนดอลลาร์สหรัฐต่อบาทไทย ได้รับอิทธิพลโดยตรงจากนโยบายทางการเงินของ Fed และ ธปท. รวมถึงทิศทางของ Fund Flow ในตลาดเกิดใหม่ (Emerging Markets)',
          defaultDesc: 'สินทรัพย์นี้มีแนวโน้มเชิงบวกเนื่องจากการรับรองในระดับสถาบันและความต้องการใช้งานในอุตสาหกรรมเทรดดิ้งที่เพิ่มสูงขึ้น ข้อมูลพื้นฐานยังคงแข็งแกร่งด้วยอัตราการเติบโตของ Network Hashrate',
        }
      },
      followList: {
        title: 'Follow List',
        desc: 'สินทรัพย์ที่คุณกำลังติดตามความเคลื่อนไหว',
        empty: 'ยังไม่มีสินทรัพย์ที่ติดตาม',
        emptySub: 'กดหัวใจที่หน้ารายละเอียดเพื่อติดตาม',
        explore: 'ค้นหาสินทรัพย์เพิ่มเติม',
      }
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      noData: 'No data available',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
    nav: {
      dashboard: 'Dashboard',
      assetMart: 'Asset-Mart',
      tlog: 'Transaction-Log',
      insight: 'Insight',
      goal: 'Goals',
      settings: 'Settings',
      profile: 'Profile',
    },
    profile: {
      title: 'User Profile',
      subtitle: 'Premium Alpha Member ✨',
      plan: 'Current Plan',
      status: 'Status',
      active: 'Active',
      inactive: 'Unsubscribed',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your system preferences and privacy',
      sections: {
        localization: 'Account & Localization',
        privacy: 'Security & Privacy',
        danger: 'Danger Zone',
      },
      language: {
        label: 'Language',
        desc: 'Choose your preferred language for the application',
      },
      timezone: {
        label: 'Timezone Offset',
        desc: 'Set your local timezone for transaction history',
      },
      privacy: {
        hideNumbers: {
          label: 'Hide Numbers',
          desc: 'Replace amounts, prices, and fees with ********',
        },
        hideText: {
          label: 'Hide Text Details',
          desc: 'Replace asset names, date, currency, and notes with ********',
        },
      },
      nuke: {
        label: 'Reset All Data (Nuke)',
        desc: 'Permanently delete all transactions, milestones, and settings. This cannot be undone.',
        btn: 'Reset Everything',
        confirm: 'Confirm Reset',
      }
    },
    tlog: {
      form: {
        title: 'Transaction Entry',
        asset: 'Asset Symbol',
        type: 'Type',
        category: 'Category',
        amount: 'Amount',
        price: 'Unit Price',
        currency: 'Currency',
        fee: 'Total Fee',
        notes: 'Notes',
        submit: 'Add Transaction',
        update: 'Update Transaction',
      },
      summary: {
        title: 'Asset Summary',
        units: 'units',
        divPerShare: 'div/sh',
        avgDiv: 'Avg Div:',
      },
      history: {
        title: 'History',
        tabs: {
          all: 'All',
          buy: 'Buy',
          sell: 'Sell',
          dividend: 'Dividend',
        },
        table: {
          date: 'Date',
          type: 'Type',
          asset: 'Asset',
          category: 'Category',
          amount: 'Amount',
          price: 'Price',
          fee: 'Fee',
          total: 'Total',
          currency: 'Currency',
          notes: 'Notes',
          actions: 'Manage',
        }
      }
    },
    goals: {
      title: 'Milestones',
      addBtn: 'Add Milestone',
      tabs: {
        active: 'Active',
        completed: 'Completed',
      },
      card: {
        progress: 'Progress',
        target: 'Target:',
        remaining: 'Remaining:',
      }
    },
    assetMart: {
      categories: {
        stocks: { name: 'Stocks', desc: 'Domestic and global markets' },
        fixedincome: { name: 'Fixed Income', desc: 'Bonds and debentures' },
        funds: { name: 'Mutual Funds', desc: 'Savings through experts' },
        crypto: { name: 'Digital Assets', desc: 'Bitcoin and Altcoins' },
        commodities: { name: 'Commodities', desc: 'Gold, Oil, Minerals' },
        realestate: { name: 'Real Estate', desc: 'Land, Buildings, REITs' },
        others: { name: 'Others', desc: 'Alternative assets and more' },
      },
      search: 'Search assets...',
      inventory: {
        back: 'Back',
        directory: 'Asset Directory',
        marketStatus: 'Market Status: Open',
        synced: 'Synced with Real-time Feeds',
        table: {
          asset: 'Asset / Symbol',
          price: 'Current Price',
          change: 'Change (24H)',
          roi: 'ROI %',
          actions: 'Manage',
        },
        allAssets: 'Explore All Assets',
      },
      detail: {
        back: 'Back to List',
        tags: 'Digital Asset • Global Market • Trusted Data Source',
        follow: 'Follow',
        following: 'Following',
        metrics: {
          price: 'Current Price',
          marketCap: 'Market Cap',
          high24h: '24h High',
          low24h: '24h Low',
          costBasis: 'Cost Basis (Adj)',
          totalRoi: 'Total ROI',
          peak: 'Daily Peak',
          floor: 'Daily Floor',
          rank: 'Rank #1 in Market',
          divAdj: 'Dividend Adjusted',
          historical: 'Historical Performance',
        },
        visualizer: {
          title: 'Price Visualizer',
          analysis: 'Fundamental Analysis',
          sentiment: 'Market Sentiment',
          fearGreed: 'Fear & Greed',
          volatility: 'Volatility',
          volMedium: 'Medium',
          forexDesc: 'USD/THB exchange rate is directly influenced by Fed and BOT monetary policies, as well as Fund Flow directions in Emerging Markets.',
          defaultDesc: 'This asset shows a positive trend due to institutional adoption and rising trading industry demand. Fundamentals remain strong with growing Network Hashrate.',
        }
      },
      followList: {
        title: 'Follow List',
        desc: 'Assets you are currently tracking',
        empty: 'No assets followed yet',
        emptySub: 'Click the heart in detail to follow',
        explore: 'Explore more assets',
      }
    }
  }
};

export type TranslationKeys = typeof translations.en;

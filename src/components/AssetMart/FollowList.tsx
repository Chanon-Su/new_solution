import React from 'react';
import { Bookmark, TrendingUp, TrendingDown } from 'lucide-react';

interface FollowItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

const FollowList: React.FC = () => {
  const followedAssets: FollowItem[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: '$64,250.00', change: '+2.4%', isUp: true },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: '$3,450.12', change: '+1.8%', isUp: true },
    { id: '3', name: 'S&P 500', symbol: 'SPX', price: '$5,210.50', change: '-0.4%', isUp: false },
    { id: '4', name: 'Gold Spot', symbol: 'XAU', price: '$2,350.20', change: '+0.1%', isUp: true },
    { id: '5', name: 'NVIDIA', symbol: 'NVDA', price: '$880.15', change: '+4.2%', isUp: true },
  ];

  return (
    <div className="follow-list-container h-full">
      <div className="follow-card-persistent glass-panel h-full">
        <div className="section-header flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-xl font-bold">Follow List</h2>
          </div>
          <Bookmark className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-xs text-gray-400 mb-4">สินทรัพย์ที่คุณกำลังติดตามความเคลื่อนไหว</p>

        <div className="follow-items-wrapper flex flex-col gap-3">
          {followedAssets.map((item) => (
            <div key={item.id} className="follow-item">
              <div className="follow-item-left">
                <div className="follow-item-icon">
                  {item.symbol[0]}
                </div>
                <div className="follow-item-info">
                  <span className="text-white">{item.name}</span>
                  <span className="text-gray-500">{item.symbol}</span>
                </div>
              </div>
              <div className="follow-item-right">
                <span className="follow-item-price text-white font-medium">{item.price}</span>
                <div className={`follow-item-change flex items-center justify-end gap-1 ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-xs font-semibold">{item.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
            + เพิ่มสินทรัพย์ติดตาม
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowList;

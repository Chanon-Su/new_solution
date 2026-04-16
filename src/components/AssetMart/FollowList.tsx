import React from 'react';
import { Bookmark, TrendingUp, TrendingDown, Heart } from 'lucide-react';

interface FollowItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  roi: string;
  isUp: boolean;
}

interface FollowListProps {
  onSelectAsset?: (asset: any) => void;
  onExplore?: () => void;
}

const FollowList: React.FC<FollowListProps> = ({ onSelectAsset, onExplore }) => {
  const [followedAssets, setFollowedAssets] = React.useState<FollowItem[]>([]);

  const loadFollowedAssets = () => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    if (followedStr) {
      setFollowedAssets(JSON.parse(followedStr));
    } else {
      setFollowedAssets([]);
    }
  };

  React.useEffect(() => {
    loadFollowedAssets();
    
    // Listen for changes from other components
    window.addEventListener('followStateChanged', loadFollowedAssets);
    return () => window.removeEventListener('followStateChanged', loadFollowedAssets);
  }, []);

  return (
    <div className="follow-list-container h-full">
      <div className="follow-card-persistent glass-panel h-full flex flex-col">
        <div className="section-header flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-xl font-bold">Follow List</h2>
          </div>
          <Bookmark className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-xs text-gray-400 mb-4">สินทรัพย์ที่คุณกำลังติดตามความเคลื่อนไหว</p>

        <div className="follow-items-wrapper flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
          {followedAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <Heart className="w-8 h-8 text-gray-600 mb-3 opacity-20" />
              <p className="text-sm text-gray-500">ยังไม่มีสินทรัพย์ที่ติดตาม</p>
              <p className="text-xs text-gray-600 mt-1">กดหัวใจที่หน้ารายละเอียดเพื่อติดตาม</p>
            </div>
          ) : (
            followedAssets.map((item) => (
              <div 
                key={item.id} 
                className="follow-item group cursor-pointer active:scale-[0.98] transition-all"
                onClick={() => onSelectAsset?.(item)}
              >
                <div className="follow-item-left">
                  <div className="follow-item-icon group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                    {item.symbol[0]}
                  </div>
                  <div className="follow-item-info">
                    <span className="text-white group-hover:text-emerald-400 transition-colors">{item.name}</span>
                    <span className="text-gray-500">{item.symbol}</span>
                  </div>
                </div>
                <div className="follow-item-right">
                  <span className="follow-item-price text-white font-medium">{item.price}</span>
                  <div className={`follow-item-change flex items-center justify-end gap-1 ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-xs font-semibold">{item.roi}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <button 
            onClick={onExplore}
            className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all border border-emerald-500/20 active:scale-95"
          >
            + ค้นหาสินทรัพย์เพิ่มเติม
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowList;

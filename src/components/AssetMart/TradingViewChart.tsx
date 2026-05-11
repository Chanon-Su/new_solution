import React, { useEffect, useRef, useState } from 'react';
import ChartSkeleton from './ChartSkeleton';

interface TradingViewChartProps {
  tvSymbol: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ tvSymbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "container_id": "tradingview_widget",
      "backgroundColor": "#121214",
      "gridColor": "rgba(30, 30, 32, 1)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com"
    });

    const timeout = setTimeout(() => {
      containerRef.current?.appendChild(script);
      // Give it a bit of time to render before hiding skeleton
      setTimeout(() => setIsLoading(false), 1200);
    }, 100);

    return () => clearTimeout(timeout);
  }, [tvSymbol]);

  return (
    <div className="tradingview-wrapper" style={{ height: '400px', width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      {isLoading && <ChartSkeleton />}
      <div 
        id="tradingview_widget" 
        ref={containerRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          opacity: isLoading ? 0 : 1, 
          transition: 'opacity 0.5s ease' 
        }}
      />
    </div>
  );
};

export default TradingViewChart;

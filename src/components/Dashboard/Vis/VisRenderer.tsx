import React from 'react';
import type { VisConfig } from '../../../types';
import { useVisData } from '../../../hooks/useVisData';
import { useTLog } from '../../../hooks/TLogManager';
import { useMilestones } from '../../../hooks/useMilestones';
import VisEmptyState from './VisEmptyState';
import VisTitleBlock from './charts/VisTitleBlock';
import VisPieChart from './charts/VisPieChart';
import { VisBarChart, VisTargetBarChart } from './charts/VisBarChart';
import { VisLineChartTLog, VisLineChartAsset } from './charts/VisLineChart';
import VisTreeMap from './charts/VisTreeMap';
import VisHistogram from './charts/VisHistogram';
import VisTable from './charts/VisTable';

interface VisRendererProps {
  config: VisConfig | undefined;
  editMode?: boolean;
  onConfigure?: () => void;
}

const VisRenderer: React.FC<VisRendererProps> = ({ config, editMode = false, onConfigure }) => {
  const { transactions } = useTLog();
  const { milestones, calculateProgress } = useMilestones();

  const { data, isEmpty } = useVisData({ config, transactions, milestones, calculateProgress });

  // Title block ไม่ต้องการ data
  if (config?.visType === 'title') {
    return <VisTitleBlock text={config.titleText} subtext={config.titleSubtext} />;
  }

  // Empty state
  if (!config || config.visType === 'empty' || isEmpty) {
    return <VisEmptyState editMode={editMode} onConfigure={onConfigure} />;
  }

  const currency = config.currency ?? 'THB';

  switch (data.kind) {
    case 'series':
      if (config.visType === 'pie') {
        return <VisPieChart points={data.points} currency={currency} />;
      }
      if (config.visType === 'treemap') {
        return <VisTreeMap points={data.points} currency={currency} />;
      }
      if (config.visType === 'histogram') {
        return <VisHistogram points={data.points} />;
      }
      // bar
      return <VisBarChart points={data.points} currency={currency} />;

    case 'timeseries':
      return <VisLineChartTLog points={data.points} currency={currency} />;

    case 'priceHistory':
      return <VisLineChartAsset points={data.points} symbol={data.symbol} currentPrice={data.currentPrice} />;

    case 'milestone':
      return <VisTargetBarChart points={data.points} />;

    case 'table':
      return <VisTable rows={data.rows} />;

    default:
      return <VisEmptyState editMode={editMode} onConfigure={onConfigure} />;
  }
};

export default VisRenderer;

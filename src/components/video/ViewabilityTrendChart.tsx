import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme } from '@/components/hooks';
import { formatDate } from '@/lib/date';

export interface ViewabilityData {
  date: string;
  total_starts: number;
  viewable_starts: number;
  avg_viewable_percent: number;
}

export interface ViewabilityTrendChartProps {
  data: ViewabilityData[];
  isLoading?: boolean;
  unit?: string;
}

export function ViewabilityTrendChart({
  data,
  isLoading,
  unit = 'hour'
}: ViewabilityTrendChartProps) {
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map(d => d.date);
    const viewabilityRate = data.map(d =>
      d.total_starts > 0 ? (d.viewable_starts / d.total_starts) * 100 : 0
    );
    const avgViewablePercent = data.map(d => d.avg_viewable_percent || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Viewable Start Rate (%)',
          data: viewabilityRate,
          backgroundColor: colors.chart.green,
          borderColor: colors.chart.green,
          borderWidth: 2,
          type: 'line' as const,
          fill: false,
          yAxisID: 'y',
        },
        {
          label: 'Avg Viewable Pixels (%)',
          data: avgViewablePercent,
          backgroundColor: colors.chart.blue,
          borderColor: colors.chart.blue,
          borderWidth: 2,
          type: 'line' as const,
          fill: false,
          yAxisID: 'y',
        },
      ],
    };
  }, [data, colors]);

  const renderYLabel = (value: string) => {
    return `${value}%`;
  };

  return (
    <BarChart
      datasets={chartData.datasets}
      unit={unit}
      isLoading={isLoading}
      renderYLabel={renderYLabel}
      YAxisType="linear"
    />
  );
}

export default ViewabilityTrendChart;

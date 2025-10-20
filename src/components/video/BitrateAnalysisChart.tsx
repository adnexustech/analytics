import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme } from '@/components/hooks';

export interface BitrateData {
  date: string;
  avg_bitrate: number;
  min_bitrate: number;
  max_bitrate: number;
  avg_duration: number;
}

export interface BitrateAnalysisChartProps {
  data: BitrateData[];
  isLoading?: boolean;
  unit?: string;
}

export function BitrateAnalysisChart({
  data,
  isLoading,
  unit = 'hour'
}: BitrateAnalysisChartProps) {
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map(d => d.date);

    return {
      labels,
      datasets: [
        {
          label: 'Avg Bitrate (kbps)',
          data: data.map(d => d.avg_bitrate || 0),
          backgroundColor: colors.chart.blue,
          borderColor: colors.chart.blue,
          borderWidth: 2,
          type: 'line' as const,
          fill: false,
          yAxisID: 'y',
        },
        {
          label: 'Min Bitrate (kbps)',
          data: data.map(d => d.min_bitrate || 0),
          backgroundColor: colors.chart.orange,
          borderColor: colors.chart.orange,
          borderWidth: 1,
          type: 'line' as const,
          fill: false,
          borderDash: [5, 5],
          yAxisID: 'y',
        },
        {
          label: 'Max Bitrate (kbps)',
          data: data.map(d => d.max_bitrate || 0),
          backgroundColor: colors.chart.green,
          borderColor: colors.chart.green,
          borderWidth: 1,
          type: 'line' as const,
          fill: false,
          borderDash: [5, 5],
          yAxisID: 'y',
        },
      ],
    };
  }, [data, colors]);

  const renderYLabel = (value: string) => {
    return `${value} kbps`;
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

export default BitrateAnalysisChart;

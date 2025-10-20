import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme, useMessages } from '@/components/hooks';

export interface VideoPerformanceData {
  creative_id: string;
  creative_name: string;
  starts: number;
  q1_reached: number;
  q2_reached: number;
  q3_reached: number;
  completes: number;
}

export interface VideoPerformanceChartProps {
  data: VideoPerformanceData[];
  isLoading?: boolean;
}

export function VideoPerformanceChart({ data, isLoading }: VideoPerformanceChartProps) {
  const { colors } = useTheme();
  const { formatMessage } = useMessages();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map(d => d.creative_name || d.creative_id.substring(0, 8));

    return {
      labels,
      datasets: [
        {
          label: 'Starts',
          data: data.map(d => d.starts),
          backgroundColor: colors.chart.blue,
          borderColor: colors.chart.blue,
          borderWidth: 1,
        },
        {
          label: 'Q1 (25%)',
          data: data.map(d => d.q1_reached),
          backgroundColor: colors.chart.green,
          borderColor: colors.chart.green,
          borderWidth: 1,
        },
        {
          label: 'Q2 (50%)',
          data: data.map(d => d.q2_reached),
          backgroundColor: colors.chart.yellow,
          borderColor: colors.chart.yellow,
          borderWidth: 1,
        },
        {
          label: 'Q3 (75%)',
          data: data.map(d => d.q3_reached),
          backgroundColor: colors.chart.orange,
          borderColor: colors.chart.orange,
          borderWidth: 1,
        },
        {
          label: 'Complete (100%)',
          data: data.map(d => d.completes),
          backgroundColor: colors.chart.purple,
          borderColor: colors.chart.purple,
          borderWidth: 1,
        },
      ],
    };
  }, [data, colors]);

  return (
    <BarChart
      datasets={chartData.datasets}
      unit="day"
      XAxisType="category"
      stacked={false}
      isLoading={isLoading}
    />
  );
}

export default VideoPerformanceChart;

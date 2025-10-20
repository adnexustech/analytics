import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme } from '@/components/hooks';

export interface SlotCompletionData {
  slot_number: number;
  total_slots: number;
  completed_slots: number;
  completion_rate: number;
}

export interface PodCompletionChartProps {
  data: SlotCompletionData[];
  isLoading?: boolean;
}

export function PodCompletionChart({ data, isLoading }: PodCompletionChartProps) {
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort by slot number
    const sortedData = [...data].sort((a, b) => a.slot_number - b.slot_number);
    const labels = sortedData.map(d => `Slot ${d.slot_number}`);

    return {
      labels,
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: sortedData.map(d => d.completion_rate * 100),
          backgroundColor: sortedData.map((d, i) => {
            // Gradient from green to yellow to red as position increases
            const rate = d.completion_rate * 100;
            if (rate >= 80) return colors.chart.green;
            if (rate >= 60) return colors.chart.yellow;
            if (rate >= 40) return colors.chart.orange;
            return colors.chart.red;
          }),
          borderWidth: 1,
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
      unit="day"
      XAxisType="category"
      isLoading={isLoading}
      renderYLabel={renderYLabel}
      YAxisType="linear"
    />
  );
}

export default PodCompletionChart;

import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme } from '@/components/hooks';

export interface PodFillData {
  date: string;
  total_slots: number;
  filled_slots: number;
  empty_slots: number;
  fill_rate: number;
}

export interface PodFillRateChartProps {
  data: PodFillData[];
  isLoading?: boolean;
  unit?: string;
}

export function PodFillRateChart({
  data,
  isLoading,
  unit = 'hour'
}: PodFillRateChartProps) {
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
          label: 'Filled Slots',
          data: data.map(d => d.filled_slots),
          backgroundColor: colors.chart.green,
          borderColor: colors.chart.green,
          borderWidth: 1,
        },
        {
          label: 'Empty Slots',
          data: data.map(d => d.empty_slots),
          backgroundColor: colors.chart.red,
          borderColor: colors.chart.red,
          borderWidth: 1,
        },
      ],
    };
  }, [data, colors]);

  return (
    <div>
      <BarChart
        datasets={chartData.datasets}
        unit={unit}
        isLoading={isLoading}
        stacked={true}
        YAxisType="linear"
      />
      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: '#666' }}>
        {data && data.length > 0 && (
          <div>
            Average Fill Rate: {' '}
            <strong style={{ color: colors.chart.green }}>
              {(
                (data.reduce((sum, d) => sum + d.filled_slots, 0) /
                  data.reduce((sum, d) => sum + d.total_slots, 0)) *
                100
              ).toFixed(2)}%
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default PodFillRateChart;

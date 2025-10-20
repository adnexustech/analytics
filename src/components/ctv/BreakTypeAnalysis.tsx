import { useMemo } from 'react';
import BarChart from '@/components/charts/BarChart';
import { useTheme } from '@/components/hooks';

export interface BreakTypeData {
  pod_position: string; // pre-roll, mid-roll, post-roll
  total_pods: number;
  avg_fill_rate: number;
  avg_completion_rate: number;
  total_revenue?: number;
}

export interface BreakTypeAnalysisProps {
  data: BreakTypeData[];
  isLoading?: boolean;
}

export function BreakTypeAnalysis({ data, isLoading }: BreakTypeAnalysisProps) {
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Define order for break types
    const order = ['pre-roll', 'mid-roll', 'post-roll'];
    const sortedData = [...data].sort(
      (a, b) => order.indexOf(a.pod_position) - order.indexOf(b.pod_position)
    );

    const labels = sortedData.map(d => {
      const formatted = d.pod_position
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return formatted;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Fill Rate (%)',
          data: sortedData.map(d => d.avg_fill_rate * 100),
          backgroundColor: colors.chart.blue,
          borderColor: colors.chart.blue,
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Completion Rate (%)',
          data: sortedData.map(d => d.avg_completion_rate * 100),
          backgroundColor: colors.chart.green,
          borderColor: colors.chart.green,
          borderWidth: 1,
          yAxisID: 'y',
        },
      ],
    };
  }, [data, colors]);

  const renderYLabel = (value: string) => {
    return `${value}%`;
  };

  return (
    <div>
      <BarChart
        datasets={chartData.datasets}
        unit="day"
        XAxisType="category"
        isLoading={isLoading}
        renderYLabel={renderYLabel}
        YAxisType="linear"
        stacked={false}
      />
      <div style={{ marginTop: 16 }}>
        {data?.map((item) => (
          <div
            key={item.pod_position}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
            }}
          >
            <div style={{ fontWeight: 500 }}>
              {item.pod_position
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
              <span>
                {item.total_pods.toLocaleString()} pods
              </span>
              <span style={{ color: colors.chart.blue }}>
                {(item.avg_fill_rate * 100).toFixed(1)}% fill
              </span>
              <span style={{ color: colors.chart.green }}>
                {(item.avg_completion_rate * 100).toFixed(1)}% complete
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BreakTypeAnalysis;

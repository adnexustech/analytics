import { useMemo } from 'react';
import PieChart from '@/components/charts/PieChart';
import { useTheme } from '@/components/hooks';

export interface PlayerTypeData {
  player_type: string;
  starts: number;
  completes: number;
  completion_rate: number;
}

export interface PlayerTypeBreakdownProps {
  data: PlayerTypeData[];
  isLoading?: boolean;
}

export function PlayerTypeBreakdown({ data, isLoading }: PlayerTypeBreakdownProps) {
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map(d => d.player_type || 'Unknown');
    const starts = data.map(d => d.starts);

    const colorPalette = [
      colors.chart.blue,
      colors.chart.green,
      colors.chart.orange,
      colors.chart.purple,
      colors.chart.yellow,
      colors.chart.red,
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Video Starts',
          data: starts,
          backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
          borderWidth: 1,
        },
      ],
    };
  }, [data, colors]);

  return (
    <div>
      <PieChart datasets={chartData.datasets} />
      <div style={{ marginTop: 16 }}>
        {data?.map((item, index) => (
          <div key={item.player_type} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: [
                  colors.chart.blue,
                  colors.chart.green,
                  colors.chart.orange,
                  colors.chart.purple,
                  colors.chart.yellow,
                  colors.chart.red,
                ][index % 6]
              }} />
              <span>{item.player_type}</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>{item.starts.toLocaleString()} starts</span>
              <span>{item.completion_rate.toFixed(1)}% CR</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerTypeBreakdown;

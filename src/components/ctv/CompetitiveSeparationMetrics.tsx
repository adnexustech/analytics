import { GridTable, GridColumn } from 'react-basics';

export interface CompetitiveSeparationData {
  brand_id: string;
  brand_name?: string;
  total_slots: number;
  separation_violations: number;
  violation_rate: number;
  avg_separation_seconds: number;
  min_separation_seconds: number;
}

export interface CompetitiveSeparationMetricsProps {
  data: CompetitiveSeparationData[];
  isLoading?: boolean;
}

export function CompetitiveSeparationMetrics({
  data,
  isLoading,
}: CompetitiveSeparationMetricsProps) {
  const renderPercentage = (value: number) => {
    const color = value < 0.05 ? '#22c55e' : value < 0.15 ? '#eab308' : '#ef4444';
    return <span style={{ color }}>{(value * 100).toFixed(2)}%</span>;
  };

  const renderSeparation = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toFixed(0)}s`;
  };

  const renderViolationStatus = (row: CompetitiveSeparationData) => {
    const rate = row.violation_rate;
    if (rate < 0.05) {
      return <span style={{ color: '#22c55e' }}>✓ Good</span>;
    } else if (rate < 0.15) {
      return <span style={{ color: '#eab308' }}>⚠ Warning</span>;
    } else {
      return <span style={{ color: '#ef4444' }}>✗ High Risk</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8 }}>
        <h4 style={{ margin: 0, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Competitive Separation Rules
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#666' }}>
          <li>Same brand ads should be separated by at least 60 seconds</li>
          <li>Violation Rate {'<'} 5%: Good | 5-15%: Warning | {'>'} 15%: High Risk</li>
          <li>Industry best practice: maintain 90+ seconds between same-brand ads</li>
        </ul>
      </div>

      <GridTable data={data} isLoading={isLoading}>
        <GridColumn name="brand_name" label="Brand">
          {(row: CompetitiveSeparationData) =>
            row.brand_name || row.brand_id.substring(0, 12)
          }
        </GridColumn>
        <GridColumn name="total_slots" label="Total Slots" alignment="end">
          {(row: CompetitiveSeparationData) => row.total_slots.toLocaleString()}
        </GridColumn>
        <GridColumn name="separation_violations" label="Violations" alignment="end">
          {(row: CompetitiveSeparationData) => (
            <span style={{ color: row.separation_violations > 0 ? '#ef4444' : '#666' }}>
              {row.separation_violations.toLocaleString()}
            </span>
          )}
        </GridColumn>
        <GridColumn name="violation_rate" label="Violation Rate" alignment="end">
          {(row: CompetitiveSeparationData) => renderPercentage(row.violation_rate)}
        </GridColumn>
        <GridColumn name="avg_separation_seconds" label="Avg Separation" alignment="end">
          {(row: CompetitiveSeparationData) =>
            renderSeparation(row.avg_separation_seconds)
          }
        </GridColumn>
        <GridColumn name="min_separation_seconds" label="Min Separation" alignment="end">
          {(row: CompetitiveSeparationData) =>
            renderSeparation(row.min_separation_seconds)
          }
        </GridColumn>
        <GridColumn name="status" label="Status" alignment="center">
          {renderViolationStatus}
        </GridColumn>
      </GridTable>
    </div>
  );
}

export default CompetitiveSeparationMetrics;

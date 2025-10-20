import { GridTable, GridColumn } from 'react-basics';

export interface SlotPerformance {
  slot_number: number;
  total_slots: number;
  filled_slots: number;
  completed_slots: number;
  fill_rate: number;
  completion_rate: number;
  avg_separation_seconds: number;
}

export interface SlotPerformanceTableProps {
  data: SlotPerformance[];
  isLoading?: boolean;
}

export function SlotPerformanceTable({ data, isLoading }: SlotPerformanceTableProps) {
  const renderPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const renderSeparation = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toFixed(0)}s`;
  };

  const sortedData = data ? [...data].sort((a, b) => a.slot_number - b.slot_number) : [];

  return (
    <GridTable data={sortedData} isLoading={isLoading}>
      <GridColumn name="slot_number" label="Slot Position" alignment="center">
        {(row: SlotPerformance) => `#${row.slot_number}`}
      </GridColumn>
      <GridColumn name="total_slots" label="Total Impressions" alignment="end">
        {(row: SlotPerformance) => row.total_slots.toLocaleString()}
      </GridColumn>
      <GridColumn name="filled_slots" label="Filled" alignment="end">
        {(row: SlotPerformance) => row.filled_slots.toLocaleString()}
      </GridColumn>
      <GridColumn name="fill_rate" label="Fill Rate" alignment="end">
        {(row: SlotPerformance) => renderPercentage(row.fill_rate)}
      </GridColumn>
      <GridColumn name="completed_slots" label="Completed" alignment="end">
        {(row: SlotPerformance) => row.completed_slots.toLocaleString()}
      </GridColumn>
      <GridColumn name="completion_rate" label="Completion Rate" alignment="end">
        {(row: SlotPerformance) => renderPercentage(row.completion_rate)}
      </GridColumn>
      <GridColumn name="avg_separation_seconds" label="Avg Separation" alignment="end">
        {(row: SlotPerformance) => renderSeparation(row.avg_separation_seconds)}
      </GridColumn>
    </GridTable>
  );
}

export default SlotPerformanceTable;

import { GridTable, GridColumn } from 'react-basics';
import { useMessages } from '@/components/hooks';
import { MetricsTable } from '@/components/metrics/MetricsTable';

export interface VASTError {
  creative_id: string;
  creative_name?: string;
  error_code: string;
  error_message: string;
  error_count: number;
  total_attempts: number;
  error_rate: number;
}

export interface VASTErrorTableProps {
  data: VASTError[];
  isLoading?: boolean;
}

export function VASTErrorTable({ data, isLoading }: VASTErrorTableProps) {
  const { formatMessage } = useMessages();

  const renderErrorRate = (row: VASTError) => {
    const rate = ((row.error_count / row.total_attempts) * 100).toFixed(2);
    return `${rate}%`;
  };

  return (
    <GridTable data={data} isLoading={isLoading}>
      <GridColumn name="creative_name" label="Creative">
        {(row: VASTError) => row.creative_name || row.creative_id.substring(0, 12)}
      </GridColumn>
      <GridColumn name="error_code" label="Error Code" />
      <GridColumn name="error_message" label="Error Message">
        {(row: VASTError) => (
          <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.error_message}
          </div>
        )}
      </GridColumn>
      <GridColumn name="error_count" label="Errors" alignment="end">
        {(row: VASTError) => row.error_count.toLocaleString()}
      </GridColumn>
      <GridColumn name="total_attempts" label="Total Attempts" alignment="end">
        {(row: VASTError) => row.total_attempts.toLocaleString()}
      </GridColumn>
      <GridColumn name="error_rate" label="Error Rate" alignment="end">
        {renderErrorRate}
      </GridColumn>
    </GridTable>
  );
}

export default VASTErrorTable;

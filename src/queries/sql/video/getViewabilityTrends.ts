import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface ViewabilityTrendResult {
  date: string;
  total_starts: number;
  viewable_starts: number;
  avg_viewable_percent: number;
}

export async function getViewabilityTrends(
  websiteId: string,
  filters: QueryFilters
): Promise<ViewabilityTrendResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<ViewabilityTrendResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate, unit = 'hour' } = filters;

  const timeGroup = unit === 'day' ? 'toStartOfDay' : 'toStartOfHour';

  const sql = `
    SELECT
      ${timeGroup}(created_at) as date,
      countIf(event_type = 'start') as total_starts,
      countIf(event_type = 'start' AND is_viewable = 1) as viewable_starts,
      avgIf(viewable_percent, is_viewable = 1) as avg_viewable_percent
    FROM analytics.video_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
    GROUP BY date
    ORDER BY date ASC
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

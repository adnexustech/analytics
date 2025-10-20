import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface PodFillRateResult {
  date: string;
  total_slots: number;
  filled_slots: number;
  empty_slots: number;
  fill_rate: number;
}

export async function getPodFillRate(
  websiteId: string,
  filters: QueryFilters
): Promise<PodFillRateResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<PodFillRateResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate, unit = 'hour' } = filters;

  const timeGroup = unit === 'day' ? 'toStartOfDay' : 'toStartOfHour';

  const sql = `
    SELECT
      ${timeGroup}(created_at) as date,
      count(*) as total_slots,
      countIf(is_filled = 1) as filled_slots,
      countIf(is_filled = 0) as empty_slots,
      if(total_slots > 0, filled_slots / total_slots, 0) as fill_rate
    FROM analytics.pod_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND event_type IN ('slot_start', 'slot_complete', 'slot_skipped')
    GROUP BY date
    ORDER BY date ASC
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

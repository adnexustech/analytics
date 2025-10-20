import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface SlotPerformanceResult {
  slot_number: number;
  total_slots: number;
  filled_slots: number;
  completed_slots: number;
  fill_rate: number;
  completion_rate: number;
  avg_separation_seconds: number;
}

export async function getSlotPerformance(
  websiteId: string,
  filters: QueryFilters
): Promise<SlotPerformanceResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<SlotPerformanceResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      slot_number,
      count(*) as total_slots,
      countIf(is_filled = 1) as filled_slots,
      countIf(event_type = 'slot_complete') as completed_slots,
      if(total_slots > 0, filled_slots / total_slots, 0) as fill_rate,
      if(filled_slots > 0, completed_slots / filled_slots, 0) as completion_rate,
      avgIf(separation_seconds, separation_seconds > 0) as avg_separation_seconds
    FROM analytics.pod_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND slot_number > 0
    GROUP BY slot_number
    ORDER BY slot_number ASC
    LIMIT 8
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

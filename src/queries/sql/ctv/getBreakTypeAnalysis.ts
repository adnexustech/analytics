import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface BreakTypeResult {
  pod_position: string;
  total_pods: number;
  avg_fill_rate: number;
  avg_completion_rate: number;
  total_revenue?: number;
}

export async function getBreakTypeAnalysis(
  websiteId: string,
  filters: QueryFilters
): Promise<BreakTypeResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<BreakTypeResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      pod_position,
      countDistinct(pod_id) as total_pods,
      avg(if(total_slots > 0, filled_slots / total_slots, 0)) as avg_fill_rate,
      avg(if(filled_slots > 0, completed_slots / filled_slots, 0)) as avg_completion_rate
    FROM (
      SELECT
        pod_id,
        pod_position,
        count(*) as total_slots,
        countIf(is_filled = 1) as filled_slots,
        countIf(event_type = 'slot_complete') as completed_slots
      FROM analytics.pod_events
      WHERE website_id = {websiteId:UUID}
        AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      GROUP BY pod_id, pod_position
    )
    GROUP BY pod_position
    ORDER BY
      CASE pod_position
        WHEN 'pre-roll' THEN 1
        WHEN 'mid-roll' THEN 2
        WHEN 'post-roll' THEN 3
        ELSE 4
      END
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

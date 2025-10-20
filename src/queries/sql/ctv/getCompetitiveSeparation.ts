import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface CompetitiveSeparationResult {
  brand_id: string;
  brand_name?: string;
  total_slots: number;
  separation_violations: number;
  violation_rate: number;
  avg_separation_seconds: number;
  min_separation_seconds: number;
}

export async function getCompetitiveSeparation(
  websiteId: string,
  filters: QueryFilters
): Promise<CompetitiveSeparationResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<CompetitiveSeparationResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      brand_id,
      count(*) as total_slots,
      countIf(separation_seconds < 60 AND previous_brand_id = brand_id AND previous_brand_id != '') as separation_violations,
      if(total_slots > 0, separation_violations / total_slots, 0) as violation_rate,
      avgIf(separation_seconds, separation_seconds > 0) as avg_separation_seconds,
      minIf(separation_seconds, separation_seconds > 0) as min_separation_seconds
    FROM analytics.pod_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND brand_id != ''
      AND is_filled = 1
    GROUP BY brand_id
    HAVING total_slots >= 10
    ORDER BY violation_rate DESC, total_slots DESC
    LIMIT 50
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

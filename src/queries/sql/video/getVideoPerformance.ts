import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface VideoPerformanceResult {
  creative_id: string;
  creative_name?: string;
  starts: number;
  q1_reached: number;
  q2_reached: number;
  q3_reached: number;
  completes: number;
  errors: number;
  completion_rate: number;
}

export async function getVideoPerformance(
  websiteId: string,
  filters: QueryFilters
): Promise<VideoPerformanceResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<VideoPerformanceResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      creative_id,
      countIf(event_type = 'start') as starts,
      countIf(quartile = 25) as q1_reached,
      countIf(quartile = 50) as q2_reached,
      countIf(quartile = 75) as q3_reached,
      countIf(quartile = 100) as completes,
      countIf(error_code != '') as errors,
      if(starts > 0, completes / starts, 0) as completion_rate
    FROM analytics.video_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
    GROUP BY creative_id
    ORDER BY starts DESC
    LIMIT 100
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

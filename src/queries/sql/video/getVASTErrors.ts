import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface VASTErrorResult {
  creative_id: string;
  creative_name?: string;
  error_code: string;
  error_message: string;
  error_count: number;
  total_attempts: number;
  error_rate: number;
}

export async function getVASTErrors(
  websiteId: string,
  filters: QueryFilters
): Promise<VASTErrorResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<VASTErrorResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      creative_id,
      error_code,
      any(error_message) as error_message,
      count(*) as error_count,
      (SELECT countIf(event_type = 'start' AND ve2.creative_id = ve1.creative_id)
       FROM analytics.video_events ve2
       WHERE ve2.website_id = {websiteId:UUID}
         AND ve2.created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      ) as total_attempts,
      if(total_attempts > 0, error_count / total_attempts, 0) as error_rate
    FROM analytics.video_events ve1
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND error_code != ''
    GROUP BY creative_id, error_code
    ORDER BY error_count DESC
    LIMIT 100
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

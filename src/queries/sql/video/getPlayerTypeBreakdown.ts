import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface PlayerTypeResult {
  player_type: string;
  starts: number;
  completes: number;
  completion_rate: number;
  avg_bitrate: number;
}

export async function getPlayerTypeBreakdown(
  websiteId: string,
  filters: QueryFilters
): Promise<PlayerTypeResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<PlayerTypeResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate } = filters;

  const sql = `
    SELECT
      player_type,
      countIf(event_type = 'start') as starts,
      countIf(quartile = 100) as completes,
      if(starts > 0, completes / starts, 0) as completion_rate,
      avg(video_bitrate) as avg_bitrate
    FROM analytics.video_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND player_type != ''
    GROUP BY player_type
    ORDER BY starts DESC
    LIMIT 20
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

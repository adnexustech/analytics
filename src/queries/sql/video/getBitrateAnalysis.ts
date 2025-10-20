import clickhouse from '@/lib/clickhouse';
import { CLICKHOUSE, runQuery } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export interface BitrateAnalysisResult {
  date: string;
  avg_bitrate: number;
  min_bitrate: number;
  max_bitrate: number;
  avg_duration: number;
}

export async function getBitrateAnalysis(
  websiteId: string,
  filters: QueryFilters
): Promise<BitrateAnalysisResult[]> {
  return runQuery({
    [CLICKHOUSE]: () => clickhouseQuery(websiteId, filters),
  });
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters
): Promise<BitrateAnalysisResult[]> {
  const { rawQuery } = clickhouse;
  const { startDate, endDate, unit = 'hour' } = filters;

  const timeGroup = unit === 'day' ? 'toStartOfDay' : 'toStartOfHour';

  const sql = `
    SELECT
      ${timeGroup}(created_at) as date,
      avg(video_bitrate) as avg_bitrate,
      min(video_bitrate) as min_bitrate,
      max(video_bitrate) as max_bitrate,
      avg(video_duration) as avg_duration
    FROM analytics.video_events
    WHERE website_id = {websiteId:UUID}
      AND created_at BETWEEN {startDate:DateTime64} AND {endDate:DateTime64}
      AND video_bitrate > 0
    GROUP BY date
    ORDER BY date ASC
  `;

  return rawQuery(sql, { websiteId, startDate, endDate });
}

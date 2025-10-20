import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { canViewWebsite } from '@/lib/auth';
import { unauthorized, json } from '@/lib/response';
import { getViewabilityTrends } from '@/queries/sql/video/getViewabilityTrends';
import { dateRangeParam } from '@/lib/schema';

export async function GET(request: Request) {
  const schema = z.object({
    websiteId: z.string().uuid(),
    unit: z.enum(['hour', 'day']).optional(),
    ...dateRangeParam,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId, startDate, endDate, unit = 'hour' } = query;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const data = await getViewabilityTrends(websiteId, {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    unit,
  });

  return json(data);
}

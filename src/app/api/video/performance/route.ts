import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { canViewWebsite } from '@/lib/auth';
import { unauthorized, json } from '@/lib/response';
import { getVideoPerformance } from '@/queries/sql/video/getVideoPerformance';
import { dateRangeParam } from '@/lib/schema';

export async function GET(request: Request) {
  const schema = z.object({
    websiteId: z.string().uuid(),
    ...dateRangeParam,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId, startDate, endDate } = query;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const data = await getVideoPerformance(websiteId, {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  return json(data);
}

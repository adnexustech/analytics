import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { canViewWebsite } from '@/lib/auth';
import { unauthorized, json } from '@/lib/response';
import { getPodFillRate } from '@/queries/sql/ctv/getPodFillRate';
import { getSlotPerformance } from '@/queries/sql/ctv/getSlotPerformance';
import { getBreakTypeAnalysis } from '@/queries/sql/ctv/getBreakTypeAnalysis';
import { dateRangeParam } from '@/lib/schema';

export async function GET(request: Request) {
  const schema = z.object({
    websiteId: z.string().uuid(),
    metric: z.enum(['fill-rate', 'slots', 'breaks']).optional(),
    unit: z.enum(['hour', 'day']).optional(),
    ...dateRangeParam,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId, startDate, endDate, metric = 'fill-rate', unit = 'hour' } = query;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const filters = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    unit,
  };

  let data;
  switch (metric) {
    case 'fill-rate':
      data = await getPodFillRate(websiteId, filters);
      break;
    case 'slots':
      data = await getSlotPerformance(websiteId, filters);
      break;
    case 'breaks':
      data = await getBreakTypeAnalysis(websiteId, filters);
      break;
    default:
      data = await getPodFillRate(websiteId, filters);
  }

  return json(data);
}

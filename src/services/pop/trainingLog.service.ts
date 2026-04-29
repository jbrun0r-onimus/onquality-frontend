import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  TrainingLogForm,
  TrainingLogListItem,
  TrainingLogListRequest,
  TrainingLogDetail,
  TrainingLogParticipant,
} from 'src/schemas/pop/trainingLog.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

/** DateField sends DD/MM/YYYY → convert to ISO for backend */
function toIsoDate(ddmmyyyy: string | null | undefined): string | null {
  if (!ddmmyyyy) return null;
  try {
    const parsed = parse(ddmmyyyy, 'dd/MM/yyyy', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    return ddmmyyyy;
  }
}

/** API returns DD-MM-YYYY → convert to DD/MM/YYYY for DateField */
export function fromIsoDate(apiDate: string | null | undefined): string {
  if (!apiDate) return '';
  try {
    return format(parse(apiDate, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy');
  } catch {
    return apiDate;
  }
}

function toApiPagination(params: Partial<TrainingLogListRequest>) {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 10;
  return { offset: (pageNumber - 1) * pageSize, limit: pageSize };
}

function fromApiPagination<T>(
  items: T[],
  total: number,
  offset: number,
  limit: number
): PaginationResponse<T> {
  return {
    records: items,
    pageNumber: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalElements: total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

function preparePayload(data: TrainingLogForm, participants: TrainingLogParticipant[]) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
    participants,
  };
}

export async function getTrainingLogs(
  params: Partial<TrainingLogListRequest>
): Promise<PaginationResponse<TrainingLogListItem>> {
  const response = await api.get('/onquality/training_log/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<TrainingLogListItem>(items, total, offset, limit);
}

export async function getTrainingLog(id: number): Promise<TrainingLogDetail> {
  const response = await api.get(`/onquality/training_log/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createTrainingLog(
  data: TrainingLogForm,
  participants: TrainingLogParticipant[]
) {
  await api.post('/onquality/training_log/', preparePayload(data, participants));
}

export async function updateTrainingLog(
  id: number,
  data: TrainingLogForm,
  participants: TrainingLogParticipant[]
) {
  await api.put(`/onquality/training_log/${id}`, preparePayload(data, participants));
}

export async function deleteTrainingLog(id: number) {
  await api.delete(`/onquality/training_log/${id}`);
}

export const trainingLogsQuery = definePaginatedQuery(
  'training-logs',
  getTrainingLogs
);

export const trainingLogDetailQuery = defineQuery(
  'training-log-detail',
  getTrainingLog
);

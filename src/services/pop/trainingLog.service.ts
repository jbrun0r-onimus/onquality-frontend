import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  TrainingLogForm,
  TrainingLogListItem,
  TrainingLogListRequest,
  TrainingLogDetail,
} from 'src/schemas/pop/trainingLog.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

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
  return response.data;
}

export async function createTrainingLog(data: TrainingLogForm) {
  await api.post('/onquality/training_log/', data);
}

export async function updateTrainingLog(id: number, data: TrainingLogForm) {
  await api.put(`/onquality/training_log/${id}`, data);
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

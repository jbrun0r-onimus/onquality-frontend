import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  MonitoringRoomForm,
  MonitoringRoomListItem,
  MonitoringRoomListRequest,
  MonitoringRoomDetail,
  MonitoringRoomMonthlyResponse,
} from 'src/schemas/pop/monitoringRoom.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

/** Converts from DD/MM/YYYY (DateField output) to ISO datetime string */
function toIsoDate(ddmmyyyy: string): string {
  try {
    const parsed = parse(ddmmyyyy, 'dd/MM/yyyy', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    return ddmmyyyy;
  }
}

/** Converts from ISO datetime to DD/MM/YYYY (for filling the form) */
function fromIsoDate(isoDate: string): string {
  try {
    return format(parse(isoDate, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy');
  } catch {
    return isoDate;
  }
}

function preparePayload(data: MonitoringRoomForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<MonitoringRoomListRequest>) {
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

export async function getMonitoringRooms(
  params: Partial<MonitoringRoomListRequest>
): Promise<PaginationResponse<MonitoringRoomListItem>> {
  const response = await api.get('/onquality/monitoring_room_area/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<MonitoringRoomListItem>(items, total, offset, limit);
}

export async function getMonitoringRoom(id: number): Promise<MonitoringRoomDetail> {
  const response = await api.get(`/onquality/monitoring_room_area/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createMonitoringRoom(data: MonitoringRoomForm) {
  await api.post('/onquality/monitoring_room_area/', preparePayload(data));
}

export async function updateMonitoringRoom(id: number, data: MonitoringRoomForm) {
  await api.put(`/onquality/monitoring_room_area/${id}`, preparePayload(data));
}

export async function deleteMonitoringRoom(id: number) {
  await api.delete(`/onquality/monitoring_room_area/${id}`);
}

export const monitoringRoomsQuery = definePaginatedQuery(
  'monitoring-rooms',
  getMonitoringRooms
);

export const monitoringRoomDetailQuery = defineQuery(
  'monitoring-room-detail',
  getMonitoringRoom
);

export async function getMonitoringRoomMonthly(
  month: number,
  year: number
): Promise<MonitoringRoomMonthlyResponse> {
  const response = await api.get('/onquality/monitoring_room_area/monthly', {
    params: { month, year },
  });
  return response.data;
}

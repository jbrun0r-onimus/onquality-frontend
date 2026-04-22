import { api } from 'src/services/api.service';

export interface PopEvidence {
  id: number;
  pop_type: string;
  pop_id: number;
  file_key: string;
  file_name: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export async function getPopEvidences(popType: string, popId: number): Promise<PopEvidence[]> {
  const response = await api.get(`/onquality/evidences/${popType}/${popId}`);
  return response.data;
}

export async function uploadPopEvidences(popType: string, popId: number, files: File[]): Promise<PopEvidence[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await api.post(`/onquality/evidences/${popType}/${popId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deletePopEvidence(evidenceId: number): Promise<void> {
  await api.delete(`/onquality/evidences/${evidenceId}`);
}

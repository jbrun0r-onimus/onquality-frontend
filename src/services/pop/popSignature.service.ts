import { api } from 'src/services/api.service';

export interface PopSignature {
  id: number;
  pop_type: string;
  pop_id: number;
  field_name: string;
  signer_name: string | null;
  file_key: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export async function getPopSignatures(popType: string, popId: number): Promise<PopSignature[]> {
  const response = await api.get(`/onquality/signatures/${popType}/${popId}`);
  return response.data;
}

export async function uploadPopSignature(
  popType: string,
  popId: number,
  fieldName: string,
  signatureBlob: Blob,
  signerName?: string
): Promise<PopSignature> {
  const formData = new FormData();
  formData.append('file', signatureBlob, 'signature.png');
  if (signerName) formData.append('signer_name', signerName);
  const response = await api.post(
    `/onquality/signatures/${popType}/${popId}/${fieldName}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export async function deletePopSignature(signatureId: number): Promise<void> {
  await api.delete(`/onquality/signatures/${signatureId}`);
}

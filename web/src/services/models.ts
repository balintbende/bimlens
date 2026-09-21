import { apiFetch } from './api';

export type ModelDto = {
  id: string;
  name: string;
  fileSize: number;
  createdAt: string;
  blobName: string;
};

export function storeModel(file: File): Promise<ModelDto> {
  const body = new FormData();
  body.append('file', file);
  return apiFetch<ModelDto>('/store', { method: 'POST', body });
}

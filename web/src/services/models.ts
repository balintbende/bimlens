import { apiFetch } from './api';

export type StoreModelRequest = {
  name: string;
  wallCount: number;
  beamCount: number;
  columnCount: number;
  slabCount: number;
  doorCount: number;
  windowCount: number;
};

export type ModelDto = StoreModelRequest & {
  id: string;
  fileSize: number;
  createdAt: string;
};

export function storeModel(
  request: StoreModelRequest,
  file: File,
): Promise<ModelDto> {
  const body = new FormData();
  for (const [key, value] of Object.entries(request)) {
    body.append(key, String(value));
  }
  body.append('file', file);
  return apiFetch<ModelDto>('/store', { method: 'POST', body });
}

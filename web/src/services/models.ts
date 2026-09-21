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
  createdAt: string;
};

export function storeModel(request: StoreModelRequest): Promise<ModelDto> {
  return apiFetch<ModelDto>('/store', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

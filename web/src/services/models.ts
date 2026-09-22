import { apiFetch, apiFetchBlob } from './api';

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

export function fetchModels(): Promise<ModelDto[]> {
  return apiFetch<ModelDto[]>('/models');
}

/** Downloads a stored model's IFC file, named after the original upload. */
export async function fetchModelFile(model: ModelDto): Promise<File> {
  const blob = await apiFetchBlob(`/models/${model.id}/file`);
  return new File([blob], model.name);
}

export function fetchModel(id: string): Promise<ModelDto> {
  return apiFetch<ModelDto>(`/models/${id}`);
}

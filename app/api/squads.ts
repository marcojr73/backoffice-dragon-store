import apiService from '@/app/api/index';
import { TSquad } from '@/app/schemas/squads.zod';

async function list(): Promise<TSquad[]> {
  const response = await apiService.get('/squads');
  return response.data;
}

async function create(data: TSquad): Promise<TSquad[]> {
  const response = await apiService.post('/squads');
  return response.data;
}

async function update(data: TSquad, id: number): Promise<TSquad[]> {
  const response = await apiService.put('/squads');
  return response.data;
}

async function deleteSquad(id: number): Promise<TSquad[]> {
  const response = await apiService.delete('/squads');
  return response.data;
}

export const squadsApi = {
  list,
  update,
  create,
  deleteSquad,
};

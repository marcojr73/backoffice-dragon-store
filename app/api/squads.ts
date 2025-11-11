import apiService from '@/app/api/index';
import { TSquad, TUserSquads, TUsersSquad } from '@/app/schemas/squads.zod';

async function list(): Promise<TSquad[]> {
  const response = await apiService.get('/squads');
  return response.data;
}

async function create(data: TSquad): Promise<TSquad[]> {
  const response = await apiService.post('/squads', data);
  return response.data;
}

async function patch(data: Partial<TSquad>, id: number): Promise<TSquad[]> {
  const response = await apiService.patch(`/squads/${id}`, data);
  return response.data;
}

async function deleteSquad(id: number): Promise<TSquad[]> {
  const response = await apiService.delete(`/squads/${id}`);
  return response.data;
}

async function listUsersSquad(squadId: number): Promise<TUsersSquad> {
  const response = await apiService.get(`/squads/${squadId}/users`);
  return response.data;
}

async function listUserSquads(userId: number): Promise<TUserSquads> {
  const response = await apiService.get(`/squads/users/${userId}`);
  return response.data;
}

async function addUserSquad(
  squadId: number,
  data: { id: number }
): Promise<{ id: number }> {
  const response = await apiService.put(`/squads/${squadId}/users`, data);
  return response.data;
}

async function deleteUserSquad(
  squadId: number,
  userId: number
): Promise<{ id: number }> {
  const response = await apiService.delete(
    `/squads/${squadId}/users/${userId}`
  );
  return response.data;
}

export const squadsApi = {
  list,
  patch,
  create,
  deleteSquad,
  listUsersSquad,
  listUserSquads,
  addUserSquad,
  deleteUserSquad,
};

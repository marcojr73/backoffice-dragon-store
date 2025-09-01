'use client';

import apiService from '@/app/api/index';
import { TUser } from '@/app/schemas/user.zod';

async function get(): Promise<TUser> {
  const response = await apiService.get('/user');
  return response.data;
}

async function update(userId: number, data: TUser): Promise<{ id: number }> {
  const response = await apiService.put(`/user/${userId}`, data);
  return response.data;
}

async function create(data: TUser): Promise<{ id: number }> {
  const response = await apiService.post('/user', data);
  return response.data;
}

async function deleteUser(userId: number): Promise<{ id: number }> {
  const response = await apiService.delete(`/user/${userId}`);
  return response.data;
}

export const userApi = {
  get,
  update,
  create,
  deleteUser,
};

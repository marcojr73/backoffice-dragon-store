'use client';

import apiService from '@/app/api/index';
import { TUser } from '@/app/schemas/user.zod';

async function get(): Promise<TUser> {
  const response = await apiService.get('/user');
  return response.data;
}

export const userApi = {
  get,
};

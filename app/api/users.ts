import apiService from '@/app/api/index';
import { TProduct } from '@/app/schemas/products.zod';
import { TUser } from '@/app/schemas/user.zod';

async function list(): Promise<TUser[]> {
  const response = await apiService.get('/user/backoffice');
  return response.data.users;
}

async function update(
  data: TProduct,
  productId: number
): Promise<{ id: number }> {
  const response = await apiService.put(`/user/${productId}`, data);
  return response.data;
}

async function create(data: TProduct): Promise<{ id: number }> {
  const response = await apiService.post(`/user`, data);
  return response.data;
}

export const usersApi = {
  list,
  update,
  create,
};

import apiService from '@/app/api/index';
import { TProduct } from '@/app/schemas/products.zod';

async function get(): Promise<TProduct[]> {
  const response = await apiService.get('/products');
  return response.data.products;
}

async function update(
  data: TProduct,
  productId: number
): Promise<{ id: number }> {
  const response = await apiService.put(`/products/${productId}`, data);
  return response.data;
}

async function create(data: TProduct): Promise<{ id: number }> {
  const response = await apiService.post(`/products`, data);
  return response.data;
}

async function deleteProduct(productId: number): Promise<{ id: number }> {
  const response = await apiService.delete(`/products/${productId}`);
  return response.data;
}

export const productsApi = {
  get,
  update,
  create,
  deleteProduct,
};

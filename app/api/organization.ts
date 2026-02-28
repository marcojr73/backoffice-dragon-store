import apiService from '@/app/api/index';
import { TOrganization } from '@/app/schemas/organization.zod';

async function update(
  data: TOrganization,
  id: number
): Promise<{ id: string }> {
  const response = await apiService.patch(`/organization/${id}`, data);
  return response.data;
}

async function get(): Promise<TOrganization> {
  const response = await apiService.get('/organization');
  return response.data;
}

export const organizationApi = {
  update,
  get,
};

import apiService from '@/app/api/index';

async function notify(): Promise<{ id: number }> {
  const response = await apiService.get('/claim/notify');
  return response.data;
}

export const claimsApi = {
  notify,
};

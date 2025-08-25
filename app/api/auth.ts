import apiService from '@/app/api/index';
import { TSignIn } from '@/app/page';

async function signIn(data: TSignIn): Promise<{ accessToken: string }> {
  const response = await apiService.post('/auth/sign-in/organization', data);
  return response.data;
}

export const authApi = {
  signIn,
};

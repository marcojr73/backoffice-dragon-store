import apiService, { TResponseDefault } from '@/app/api/index';
import { TBrandForm } from '@/app/backoffice/marca/page';

async function update(
  data: TBrandForm
): Promise<TResponseDefault<{ id: string } | null>> {
  try {
    const response = await apiService.put('', data);
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      message: error?.response?.data,
      status: error?.status,
      success: false,
    };
  }
}

export const organizationBrandApi = {
  update,
};

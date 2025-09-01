'use client';

import Organization from '@/app/compositions/organization';
import { useQuery } from '@/app/hooks/use-query';
import { organizationApi } from '@/app/api/organization';
import { zOrganization } from '@/app/schemas/organization.zod';
import { useUserContext } from '@/app/providers/user-provider';
import { useEffect } from 'react';

const Page = () => {
  const { user } = useUserContext();
  const { data, fetch } = useQuery({
    fetchFunction: () => organizationApi.get(),
    schema: zOrganization,
    onError: error => {
      console.log(error);
    },
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  return data && <Organization organization={data} />;
};

export default Page;

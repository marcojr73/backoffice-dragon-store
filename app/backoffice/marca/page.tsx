'use client';

import Organization from '@/app/compositions/organization';
import { useQuery } from '@/app/hooks/use-query';
import { organizationApi } from '@/app/api/organization';
import { zOrganization } from '@/app/schemas/organization.zod';
import { useUserContext } from '@/app/providers/user-provider';
import { useEffect } from 'react';
import NotFound from '@/app/compositions/not-found';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

const Page = () => {
  useUserContext();

  const { data, error, fetch } = useQuery({
    fetchFunction: () => organizationApi.get(),
    schema: zOrganization,
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  console.log(data);

  if (data) {
    return <Organization organization={data} />;
  }

  if (error) {
    return (
      <NotFound message='Ocorreu um erro buscar pelas informações da marca' />
    );
  }

  return <Spinner />;
};

export default Page;

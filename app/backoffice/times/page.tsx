'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@/app/hooks/use-query';
import { squadsApi } from '@/app/api/squads';
import { zSquads } from '@/app/schemas/squads.zod';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import Squads from '@/app/compositions/squads';

const Page = () => {
  const { data, fetch, isLoading } = useQuery({
    fetchFunction: squadsApi.list,
    schema: zSquads,
    onError: error => console.log(error),
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  if (data) {
    return <Squads squads={data} fetch={fetch} />;
  }
  if (isLoading) {
    return <Spinner />;
  }
};

export default Page;

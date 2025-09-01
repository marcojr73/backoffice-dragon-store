'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@/app/hooks/use-query';
import { usersApi } from '@/app/api/users';
import { zUsers } from '@/app/schemas/user.zod';
import Users from '@/app/compositions/users';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

const Employees = () => {
  const { data, fetch, isLoading } = useQuery({
    fetchFunction: usersApi.list,
    schema: zUsers,
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  if (data) {
    return <Users users={data} fetch={fetch} />;
  }

  if (isLoading) {
    return <Spinner variant={'circle'} />;
  }
};

export default Employees;

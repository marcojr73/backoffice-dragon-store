'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@/app/hooks/use-query';
import { productsApi } from '@/app/api/products';
import { zProducts } from '@/app/schemas/products.zod';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import Products from '@/app/compositions/products';

const Page = () => {
  const { data, fetch, isLoading } = useQuery({
    fetchFunction: productsApi.get,
    schema: zProducts,
    onError: error => console.log(error),
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  if (data !== null) {
    return <Products products={data} fetch={fetch} />;
  }
  if (isLoading) {
    return <Spinner variant={'circle'} />;
  }
};

export default Page;

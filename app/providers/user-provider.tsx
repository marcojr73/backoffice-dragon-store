'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import { TUser, zUser } from '@/app/schemas/user.zod';
import { useQuery } from '@/app/hooks/use-query';
import { userApi } from '@/app/api/user';
import useSession from '@/app/hooks/use-session';

export const UserContext = createContext<TValue>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();

  const { data, fetch } = useQuery({
    schema: zUser,
    fetchFunction: userApi.get,
    onError: error => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (!session) return;
    (async () => await fetch({ id: session.id.toString() }))();
  }, [session]);

  return (
    data && (
      <UserContext.Provider value={{ user: data }}>
        {children}
      </UserContext.Provider>
    )
  );
};

type TValue = {
  user: TUser | null;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('conxtex not defined');
  }
  if (!context.user) {
    throw new Error('conxtex not defined');
  }
  return context;
};

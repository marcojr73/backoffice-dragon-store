'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-inputs/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import dragon from '@assets/logos/dragon.png';
import { authApi } from '@/app/api/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (data: TSignIn) => {
    try {
      const response = await authApi.signIn(data);
      localStorage.setItem('accessToken', response.accessToken);
      router.push('/backoffice');
    } catch (error: any) {
      setError('email', {
        message: 'E-mail ou senhas incorretos',
      });
      setError('password', {
        message: 'E-mail ou senhas incorretos',
      });
    }
  };

  return (
    <div className='flex w-screen h-screen'>
      <Card className='w-full max-w-sm m-auto'>
        <Image
          src={dragon}
          width={100}
          height={100}
          alt={'Logo de dragão'}
          className={'m-auto'}
        />
        <CardHeader>
          <CardTitle>Entrar em sua conta</CardTitle>
          <CardDescription>
            Digite seu e-mail e senha para continuar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <CardContent>
            <div className='flex flex-col gap-6'>
              <Input
                label={'Email'}
                type='email'
                placeholder='m@example.com'
                error={errors.email?.message}
                required
                control={control}
                name={'email'}
              />

              <Input
                type='password'
                required
                label={'Senha'}
                control={control}
                name={'password'}
                error={errors.password?.message}
              />
            </div>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button type='submit' className='w-full cursor-pointer'>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export type TSignIn = {
  email: string;
  password: string;
};

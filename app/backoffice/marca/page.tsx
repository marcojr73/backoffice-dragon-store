'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { organizationBrandApi } from '@/app/api/organization-brand';

const Brand = () => {
  const { register, getValues, handleSubmit } = useForm<TBrandForm>({
    defaultValues: {
      logo: 'uai',
      name: 'zé',
      color: 'vodka',
      email: 'c energetico',
    },
  });

  const onSubmit = async (data: TBrandForm) => {
    console.log('Dados do formulário:', data);

    try {
      const response = await organizationBrandApi.update(data);
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
    }
  };

  return (
    <section className='flex flex-col gap-4'>
      <h1 className='text-xl font-bold'>Marca</h1>
      <form
        className='grid grid-cols-2 gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label={'Logo da organização'}
          type={'file'}
          placeholder='Clique para selecionar um arquivo'
          {...register('logo')}
        />
        <Input
          label={'nome da organização'}
          placeholder='Digite um nome'
          {...register('name')}
        />
        <Input
          label={'Cor de destaque da organização'}
          type='color'
          placeholder='Selecione uma cor'
          {...register('color')}
        />
        <Input
          label={'E-mail de contato'}
          placeholder='Digite o e-mail para notificações'
          {...register('email')}
        />
        <div className='col-span-2 flex w-full justify-end'>
          <Button>Salvar</Button>
        </div>
      </form>
    </section>
  );
};

export default Brand;

export type TBrandForm = {
  logo: string;
  name: string;
  color: string;
  email: string;
};

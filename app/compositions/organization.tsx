import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { TOrganization } from '@/app/schemas/organization.zod';
import { organizationApi } from '@/app/api/organization';

const Organization = ({ organization }: { organization: TOrganization }) => {
  const { register, handleSubmit } = useForm<TOrganization>({
    defaultValues: {
      name: organization.name,
      color: organization.color,
      logo: organization.logo,
      contactEmail: organization.contactEmail ?? '',
    },
  });

  const onSubmit = async (data: TOrganization) => {
    console.log('Dados do formulário:', data);

    try {
      const response = await organizationApi.update(data);
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
          {...register('contactEmail')}
        />
        <div className='col-span-2 flex w-full justify-end'>
          <Button>Salvar</Button>
        </div>
      </form>
    </section>
  );
};

export default Organization;

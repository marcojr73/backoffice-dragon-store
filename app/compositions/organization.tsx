import React from 'react';
import { Input } from '@/components/ui/form-inputs/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { TOrganization } from '@/app/schemas/organization.zod';
import { organizationApi } from '@/app/api/organization';
import PageBox from '@/app/components/page-box';

const Organization = ({ organization }: { organization: TOrganization }) => {
  const { register, handleSubmit, control } = useForm<TOrganization>({
    defaultValues: {
      name: organization.name,
      color: organization.color,
      logo: organization.logo,
      contactEmail: organization.contactEmail ?? '',
    },
  });

  const onSubmit = async (data: TOrganization) => {
    console.log(data);
    try {
      await organizationApi.update({ ...data, id: organization.id });
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
    }
  };

  return (
    <PageBox title={'Marca'}>
      <form
        className='grid grid-cols-2 gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label={'Logo da organização'}
          type={'file'}
          placeholder='Clique para selecionar um arquivo'
          control={control}
          name={'logo'}
        />
        <Input
          label={'nome da organização'}
          placeholder='Digite um nome'
          control={control}
          name={'name'}
        />
        <Input
          label={'Cor de destaque da organização'}
          type='color'
          placeholder='Selecione uma cor'
          control={control}
          name={'color'}
        />
        <Input
          label={'E-mail de contato'}
          placeholder='Digite o e-mail para notificações'
          control={control}
          name={'contactEmail'}
        />
        <div className='col-span-2 flex w-full justify-end'>
          <Button>Salvar</Button>
        </div>
      </form>
    </PageBox>
  );
};

export default Organization;

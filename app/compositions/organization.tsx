import React, { useState } from 'react';
import { Input } from '@/components/ui/form-inputs/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { TOrganization } from '@/app/schemas/organization.zod';
import { organizationApi } from '@/app/api/organization';
import PageBox from '@/app/components/page-box';
import { rules } from '@/app/utils/rules';
import { mask } from '@/app/utils/mask';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { toast } from 'sonner';
import { feedbacks } from '@/app/utils/feedbacks';

const Organization = ({ organization }: { organization: TOrganization }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TOrganization>({
    defaultValues: {
      name: organization.name,
      color: organization.color,
      logo: organization.logo,
      responsibleName: organization.responsibleName ?? '',
      responsibleEmail: organization.responsibleEmail ?? '',
      responsiblePhone: organization.responsiblePhone ?? '',
    },
  });

  const onSubmit = async (data: TOrganization) => {
    console.log(data);
    setIsLoading(true);
    try {
      await organizationApi.update({ ...data, id: organization.id });
      toast.success(feedbacks.successBrandUpdated);
    } catch (error) {
      toast.error(feedbacks.errorBrandUpdated);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageBox title={'Marca'}>
      {isLoading ? (
        <div
          className={
            'w-full h-max overflow-hidden flex justify-center items-center'
          }
        >
          <Spinner />
        </div>
      ) : (
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
            label={'Nome da organização'}
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
            label={'Nome do responsável'}
            placeholder='Digite o e-mail para notificações'
            control={control}
            name={'responsibleName'}
            rules={{ required: 'Campo obrigatório' }}
            error={errors.responsibleName?.message}
          />
          <Input
            label={'E-mail do responsável'}
            placeholder='Digite o e-mail para notificações'
            control={control}
            name={'responsibleEmail'}
            rules={rules.email}
            error={errors.responsibleEmail?.message}
          />
          <Input
            label={'Celular do responsável'}
            placeholder='Digite o e-mail para notificações'
            control={control}
            name={'responsiblePhone'}
            maskFormatter={mask.phone}
          />
          <div className='col-span-2 flex w-full justify-end'>
            <Button type={'submit'}>Salvar</Button>
          </div>
        </form>
      )}
    </PageBox>
  );
};

export default Organization;

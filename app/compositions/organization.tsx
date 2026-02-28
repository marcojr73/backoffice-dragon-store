import React from 'react';
import { Input } from '@/components/ui/form-inputs/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { TOrganization } from '@/app/schemas/organization.zod';
import { organizationApi } from '@/app/api/organization';
import PageBox from '@/app/components/page-box';
import { rules } from '@/app/utils/rules';
import { mask } from '@/app/utils/mask';
import { toast } from 'sonner';
import { feedbacks } from '@/app/utils/feedbacks';
import FieldSet from '@/components/ui/form-inputs/field-set';
import { Tag, Users, UserStar } from 'lucide-react';
import { claimsApi } from '@/app/api/claims';
import { ReportInterval } from '@/app/utils/enums/report-interval';

const Organization = ({ organization }: { organization: TOrganization }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TOrganization>({
    defaultValues: {
      name: organization.name,
      color: organization.color ?? '',
      logo: organization.logo ?? '',
      responsibleName: organization.responsibleName ?? '',
      responsibleEmail: organization.responsibleEmail ?? '',
      responsiblePhone: organization.responsiblePhone ?? '',
      reportSendInterval: organization.reportSendInterval ?? 4,
      coinsSupply: organization.coinsSupply ?? 100,
      maxRedemptions: organization.maxRedemptions ?? 0,
    },
  });

  const onSubmit = async (data: TOrganization) => {
    const loadingId = toast.loading('Atualizando marca');
    try {
      await organizationApi.update(data, organization.id);
      toast.success(feedbacks.successBrandUpdated, { id: loadingId });
    } catch (error) {
      toast.error(feedbacks.errorBrandUpdated, { id: loadingId });
    }
  };

  async function notifyOrders() {
    const loadingId = toast.loading('Disparando via e-mail');
    try {
      await claimsApi.notify();
      toast.success(feedbacks.successBrandUpdated, { id: loadingId });
    } catch (error) {
      toast.error('Ocorreu um erro ao disparar o e-mail', { id: loadingId });
    }
  }

  return (
    <PageBox title={'Loja'}>
      <form
        className='grid grid-cols-2 gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldSet icon={Tag}>Configurações da marca</FieldSet>
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
        <FieldSet icon={UserStar}>Dados do responsável</FieldSet>
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
        <Input
          label={'Forma de recebimento dos resgates'}
          placeholder='Clique para selecionar'
          type={'select'}
          options={[
            { value: ReportInterval.DAILY, label: 'Diáriamente' },
            { value: ReportInterval.WEEKLY, label: 'Semanalmente' },
            {
              value: ReportInterval.MONTHLY,
              label: 'Mensalmente',
            },
            { value: ReportInterval.ON_EACH_CLAIM, label: 'A cada resgate' },
          ]}
          control={control}
          name={'reportSendInterval'}
        />
        <FieldSet icon={Users}>Configurações dos usuários</FieldSet>
        <Input
          label={'Número de moedas por mês'}
          type={'number'}
          control={control}
          name={'coinsSupply'}
        />
        <Input
          label={'Número máximo de resgates por mês'}
          type={'number'}
          control={control}
          name={'maxRedemptions'}
        />
        <div className='col-span-2 flex w-full justify-end gap-2'>
          <Button type={'button'} variant={'outline'} onClick={notifyOrders}>
            Disparar último periodo de vendas
          </Button>
          <Button type={'submit'}>Salvar</Button>
        </div>
      </form>
    </PageBox>
  );
};

export default Organization;

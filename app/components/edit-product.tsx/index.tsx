import React from 'react';
import { TProduct } from '@/app/schemas/products.zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/form-inputs/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { productsApi } from '@/app/api/products';
import { validations } from '@/app/utils/validations';
import { errorMessages } from '@/app/utils/error-messages';

const EditProduct = ({
  product,
  close,
}: {
  product: TProduct | null;
  close: (shouldReload?: boolean) => void;
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<TProduct>({
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      value: product?.value ?? 0,
      picture: product?.picture ?? '',
      availableStartAt: product?.availableStartAt
        ? parseDate(product?.availableStartAt)
        : parseDate(getTodayIsoString()),
      availableEndAt: product?.availableEndAt
        ? parseDate(product?.availableEndAt)
        : undefined,
    },
  });

  function getTodayIsoString() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
  }

  function parseDate(date: string | null) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }

  const onSubmit = async (data: TProduct) => {
    try {
      if (product !== null) {
        await productsApi.update(data, product.id);
      } else {
        await productsApi.create(data);
      }
      close(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => close()}>
      <DialogContent aria-describedby={'products'}>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              <div className='flex gap-2'>
                <Pencil className='h-4 w-4' />
                <span>Editar</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <Input
            label={'Nome'}
            placeholder='Nome do produto'
            rules={{
              required: {
                value: true,
                message: errorMessages.requiredField,
              },
            }}
            error={errors.name?.message}
            control={control}
            name={'name'}
          />
          <Input
            label={'Descrição'}
            type={'textarea'}
            placeholder='Descrição da recompensa'
            control={control}
            name={'description'}
          />
          <Input
            label={'Valor'}
            type={'number'}
            placeholder='Valor em moedas'
            control={control}
            name={'value'}
          />
          <Input
            label={'Foto'}
            type={'file'}
            placeholder='Foto da reconpensa'
            control={control}
            name={'picture'}
          />
          <Input
            label={'Disponível a partir de:'}
            placeholder='Validade'
            type={'date'}
            control={control}
            rules={{
              validate: arg => {
                if (!arg) return true;
                return (
                  validations.isDateAfterThePresent(arg) ||
                  errorMessages.dateShouldNotInThePast
                );
              },
            }}
            error={errors.availableStartAt?.message}
            name={'availableStartAt'}
          />
          <Input
            label={'Disponível até:'}
            placeholder='Validade'
            type={'date'}
            control={control}
            name={'availableEndAt'}
            rules={{
              validate: targetDate => {
                if (!targetDate) return true;
                return (
                  validations.isDateAfterThan(
                    targetDate,
                    getValues('availableStartAt')
                  ) ||
                  errorMessages.dateShouldNotAfterThan(
                    getValues('availableStartAt') as string
                  )
                );
              },
            }}
            error={errors.availableEndAt?.message}
          />
          <DialogFooter>
            <Button type={'submit'}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;

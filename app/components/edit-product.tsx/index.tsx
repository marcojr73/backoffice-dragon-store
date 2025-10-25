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

const EditProduct = ({
  product,
  close,
}: {
  product: TProduct | null;
  close: (shouldReload?: boolean) => void;
}) => {
  const { handleSubmit, control } = useForm<TProduct>({
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      value: product?.value ?? 0,
      picture: product?.picture ?? '',
    },
  });

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
            control={control}
            name={'name'}
          />
          <Input
            label={'Descrição'}
            type={'textarea'}
            placeholder='Descrição do produto'
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
            placeholder='Foto do produto'
            control={control}
            name={'picture'}
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

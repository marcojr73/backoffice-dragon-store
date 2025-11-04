import React from 'react';
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
import { squadsApi } from '@/app/api/squads';
import { TSquad } from '@/app/schemas/squads.zod';

const EditSquad = ({
  squad,
  close,
}: {
  squad: TSquad | null;
  close: (shouldReload?: boolean) => void;
}) => {
  const { control, handleSubmit } = useForm<TSquad>({
    defaultValues: {
      name: squad?.name ?? '',
      description: squad?.description ?? '',
      squadLeader: squad?.squadLeader ?? null,
      color: squad?.color ?? '',
      logo: squad?.logo ?? '',
    },
  });

  const onSubmit = async (data: TSquad) => {
    console.log(data);
    try {
      if (squad !== null) {
        await squadsApi.update(data, squad?.id);
      } else {
        await squadsApi.create(data);
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
            placeholder='Nome do time'
            control={control}
            name={'name'}
          />
          <Input
            label={'Descrição'}
            type={'textarea'}
            placeholder='Descrição do time'
            control={control}
            name={'description'}
          />
          <Input
            label={'Lider do time'}
            placeholder='Clique para selecionar'
            type={'typeahead'}
            control={control}
            name={'squadLeader'}
          />
          <Input
            label={'Foto'}
            type={'file'}
            placeholder='Foto do time'
            control={control}
            name={'logo'}
          />
          <Input
            label={'Cor'}
            type={'color'}
            placeholder='Cor principal que representa o time'
            control={control}
            name={'color'}
          />
          <DialogFooter>
            <Button type={'submit'}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSquad;

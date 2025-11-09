import React, { useEffect } from 'react';
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
import { useQuery } from '@/app/hooks/use-query';
import { usersApi } from '@/app/api/users';
import { zUsers } from '@/app/schemas/user.zod';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import NotFound from '@/app/compositions/not-found';

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
      squadLeaderId: squad?.squadLeaderId ?? null,
      color: squad?.color ?? '',
      logo: squad?.logo ?? '',
    },
  });

  const {
    data: users,
    fetch,
    isLoading,
    error,
  } = useQuery({
    fetchFunction: usersApi.list,
    schema: zUsers,
    onError: error => {
      console.log(error);
    },
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  async function getUsers() {
    if (!squad) {
      return [];
    }
    const response = await squadsApi.listUsersSquad(squad?.id);
    return response.usersSquad.map(user => ({
      value: user.id,
      label: user.userName,
    }));
  }

  const onSubmit = async (data: TSquad) => {
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

          {users && Boolean(users.length > 0) && (
            <>
              <Input
                label={'Nome'}
                placeholder='Nome do time'
                control={control}
                name={'name'}
              />
              <Input
                label={'Lider do time'}
                placeholder='Clique para selecionar'
                type={'typeahead'}
                remote={{ fetchFunction: getUsers }}
                control={control}
                name={'squadLeaderId'}
              />
              <Input
                label={'Descrição'}
                type={'textarea'}
                placeholder='Descrição do time'
                control={control}
                name={'description'}
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
            </>
          )}

          {isLoading && <Spinner />}

          {Boolean(error) && <NotFound message={'Ocorreu um erro'}></NotFound>}

          <DialogFooter>
            <Button type={'submit'}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSquad;

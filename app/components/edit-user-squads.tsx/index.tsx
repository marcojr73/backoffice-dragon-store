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
import { TSquad, zUserSquads } from '@/app/schemas/squads.zod';
import { useQuery } from '@/app/hooks/use-query';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import NotFound from '@/app/compositions/not-found';
import { toast } from 'sonner';

const EditUserSquads = ({
  userId,
  close,
}: {
  userId: number;
  close: (shouldReload?: boolean) => void;
}) => {
  const { control, handleSubmit } = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });

  const {
    data: userSquads,
    fetch,
    isLoading,
    error,
  } = useQuery({
    fetchFunction: () => squadsApi.listUserSquads(userId),
    schema: zUserSquads,
    onError: error => {
      console.log(error);
    },
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  async function getUsers() {
    return [];
    // if (!users) {
    //   return [];
    // }
    // const response = await squadsApi.listUsersSquad(squad?.id);
    // return response.usersSquad.map(user => ({
    //   value: user.id,
    //   label: user.userName,
    // }));
  }

  const onSubmit = async (data: TSquad) => {
    const loadingId = toast.loading('Atualizando time');
    try {
      await squadsApi.create(data);
      toast.success('Time atualizado!', { id: loadingId });
    } catch (error) {
      toast.error('Erro ao atualizar time', { id: loadingId });
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

          {userSquads && Boolean(userSquads.length > 0) && (
            <>
              <Input
                label={'Nome'}
                placeholder='Nome do time'
                type={'typeahead'}
                control={control}
                name={'search'}
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

export default EditUserSquads;

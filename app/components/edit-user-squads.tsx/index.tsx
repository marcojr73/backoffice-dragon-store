import React, { useEffect, useState } from 'react';
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
import { Pencil, ShieldEllipsis, UserMinus } from 'lucide-react';
import { squadsApi } from '@/app/api/squads';
import { zUserSquads } from '@/app/schemas/squads.zod';
import { useQuery } from '@/app/hooks/use-query';
import { toast } from 'sonner';
import DragonTable from '@/components/ui/table/dragon-table';

const EditUserSquads = ({
  userId,
  close,
}: {
  userId: number;
  close: (shouldReload?: boolean) => void;
}) => {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const { control, handleSubmit } = useForm<{ squadId: number }>();
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

  useEffect(() => {
    (async () => {
      await getOptions();
    })();
  }, [userSquads]);

  async function getOptions() {
    if (!userSquads) {
      return [];
    }
    const response = await squadsApi.list();
    setOptions(
      response
        .map(squad => ({
          value: squad.id,
          label: squad.name,
        }))
        .filter(
          squad =>
            squad.value !==
            userSquads.find(userSquad => userSquad.squad.id === squad.value)
              ?.squad.id
        )
    );
  }

  const onSubmit = async (data: { squadId: number }) => {
    const loadingId = toast.loading('Adicionando colaborador ao time');
    try {
      await squadsApi.addUserSquad(data.squadId, { id: userId });
      toast.success('Atualizado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao salvar', { id: loadingId });
      console.error('Erro ao salvar:', error);
    }
  };

  const promoteToAdmin = async (data: number, squadLeaderId: number | null) => {
    try {
      const loadingId = toast.loading('Promovendo a Líder do time');
      await squadsApi.patch({ squadLeaderId }, data);
      toast.success('Líder atualizado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao promover.');
      console.error('Erro ao salvarr:', error);
    }
  };

  const deleteUser = async (data: number) => {
    try {
      const loadingId = toast.loading('Deletando colaborador do time');
      await squadsApi.deleteUserSquad(data, userId);
      toast.success('Colaborador deletado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao deletar colaborador ao squad');
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => close()}>
      <DialogContent aria-describedby={'products'}>
        <DialogHeader>
          <DialogTitle>
            <div className='flex gap-2 mb-4'>
              <Pencil className='h-4 w-4' />
              <span>Editar</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <>
            <Input
              label={'Nome'}
              placeholder='Nome do time'
              type={'typeahead'}
              control={control}
              options={options}
              action={{ onSubmitButton: () => handleSubmit(onSubmit) }}
              name={'squadId'}
            />
            <DragonTable
              data={userSquads}
              columns={[
                {
                  header: {
                    label: 'Nome',
                  },
                  html: userSquad => (
                    <div className='flex gap-2 items-center'>
                      <span className='font-bold'>{userSquad.squad.name}</span>
                      {userSquad.user.id === userSquad.squad.squadLeaderId && (
                        <span className='bg-accent px-2 rounded-md'>Líder</span>
                      )}
                    </div>
                  ),
                },
                {
                  header: {
                    label: 'Ações',
                  },
                  width: '50px',
                  buttons: [
                    {
                      icon: <ShieldEllipsis className='h-4 w-4' />,
                      title: 'Promover a líder do time',
                      action: userSquad =>
                        promoteToAdmin(
                          userSquad.squad.id,
                          userSquad.squad.squadLeaderId === userId
                            ? null
                            : userId
                        ),
                    },
                    {
                      icon: <UserMinus className='h-4 w-4' />,
                      title: 'Remover colaborador do time',
                      action: userSquad => deleteUser(userSquad.squad.id),
                    },
                  ],
                },
              ]}
              isLoading={isLoading}
              emptyMessage={'O usuário ainda não participa de nenhum time'}
            />
          </>
        </form>

        <DialogFooter>
          <Button type={'submit'}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserSquads;

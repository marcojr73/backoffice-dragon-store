import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Star, Trash } from 'lucide-react';
import { squadsApi } from '@/app/api/squads';
import { useQuery } from '@/app/hooks/use-query';
import NotFound from '@/app/compositions/not-found';
import { zUsersSquad } from '@/app/schemas/squads.zod';
import Image from 'next/image';
import { Input } from '@/components/ui/form-inputs/input';
import { usersApi } from '@/app/api/users';
import { toast } from 'sonner';
import DragonTable from '@/components/ui/table/dragon-table';
import emptyProfilePic from '@assets/empty-states/empty_profile.png';

const EditUsersSquad = ({
  squadId,
  close,
}: {
  squadId: number;
  close: (shouldReload?: boolean) => void;
}) => {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const {
    data: squad,
    fetch,
    isLoading,
    error,
  } = useQuery({
    fetchFunction: () => squadsApi.listUsersSquad(squadId),
    schema: zUsersSquad,
    onError: error => {
      console.log(error);
    },
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, [squad]);

  async function getUsers() {
    if (!squad) return [];

    const response = await usersApi.list();

    const existingUserIds = squad.usersSquad.map(userSquad => userSquad.id);

    setOptions(
      response
        .filter(user => !existingUserIds.includes(user.id))
        .map(user => ({
          value: user.id,
          label: user.userName,
        }))
    );
  }

  const onSubmit = async (data: { search: string }) => {
    try {
      if (!data.search) {
        return;
      }
      const loadingId = toast.loading('Adicionando colaborador ao time');
      await squadsApi.addUserSquad(squadId, { id: +data.search });
      toast.success('Colaborador adicionado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao adicionar colaborador ao squad');
      console.error('Erro ao salvar:', error);
    }
  };

  const deleteUser = async (data: number) => {
    try {
      const loadingId = toast.loading('Deletando colaborador do time');
      await squadsApi.deleteUserSquad(squadId, data);
      toast.success('Colaborador deletado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao deletar colaborador ao squad');
      console.error('Erro ao salvar:', error);
    }
  };

  const promoteToAdmin = async (data: number) => {
    try {
      const loadingId = toast.loading('Promovendo a Líder do time');
      await squadsApi.patch({ squadLeaderId: data }, squadId);
      toast.success('Líder atualizado!', { id: loadingId });
      await fetch();
    } catch (error) {
      toast.error('Erro ao promover.');
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => close()}>
      <DialogContent aria-describedby={'products'}>
        <DialogHeader>
          <DialogTitle>
            <div className='flex gap-2'>
              <Pencil className='h-4 w-4' />
              <span>Editar colaboradores do time</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <>
          <form
            className='flex flex-col gap-4 mt-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label={'Adicione um colaborador'}
              placeholder='Digite um nome'
              control={control}
              action={{ onSubmitButton: () => handleSubmit(onSubmit) }}
              name={'search'}
              type={'typeahead'}
              options={options}
            />
          </form>
          <DragonTable
            data={squad ? squad.usersSquad : null}
            columns={[
              {
                header: { label: 'Nome' },
                html: (userSquad: any) => (
                  <>
                    {userSquad.picture && (
                      <Image
                        src={userSquad.picture ?? emptyProfilePic}
                        alt={'Foto de perfil'}
                        width={100}
                        height={100}
                        className={'rounded-full w-6 h-6'}
                      />
                    )}
                    <span>{userSquad.userName}</span>
                    {userSquad.id === squad?.squadLeaderId && (
                      <span className='bg-accent px-2 py-0 rounded-sm text-xs'>
                        Líder
                      </span>
                    )}
                  </>
                ),
              },
              {
                header: { label: 'Ações' },
                width: '50px',
                buttons: [
                  {
                    title: 'Promover a líder do time',
                    icon: <Star className='h-4 w-4' />,
                    action: data => promoteToAdmin(data.id),
                  },
                  {
                    title: 'Remover colaborador do time',
                    icon: <Trash className='h-4 w-4' />,
                    action: data => deleteUser(data.id),
                  },
                ],
              },
            ]}
            isLoading={isLoading}
            emptyMessage='Nenhum colaborador encontrado'
          />
        </>

        {Boolean(error) && <NotFound message={'Ocorreu um erro'}></NotFound>}
      </DialogContent>
    </Dialog>
  );
};

export default EditUsersSquad;

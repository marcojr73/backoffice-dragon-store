import React, { useEffect, useState } from 'react';
import PageBox from '@/app/components/page-box';
import { TSquad, zSquads } from '@/app/schemas/squads.zod';
import { Button } from '@/components/ui/button';
import EditSquad from '@/app/components/edit-squad.tsx';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import { squadsApi } from '@/app/api/squads';
import Image from 'next/image';
import EditUsersSquad from '@/app/components/edit-users-squad.tsx';
import { toast } from 'sonner';
import DragonTable from '@/components/ui/table/dragon-table';
import emptyProfilePic from '@assets/empty-states/empty_profile.png';
import { useQuery } from '@/app/hooks/use-query';
import { Pencil, Trash, Users } from 'lucide-react';

const Squads = () => {
  const [usersSquadToEdit, setUsersSquadToEdit] = useState<{
    isOpen: boolean;
    squad: TSquad | null;
  }>({
    isOpen: false,
    squad: null,
  });

  const [squadToEdit, setSquadToEdit] = useState<{
    isOpen: boolean;
    squad: TSquad | null;
  }>({
    isOpen: false,
    squad: null,
  });

  const [squadToDelete, setSquadToDelete] = useState<{
    isOpen: boolean;
    squad: TSquad | null;
  }>({
    isOpen: false,
    squad: null,
  });

  const {
    data: squads,
    fetch,
    isLoading,
  } = useQuery({
    fetchFunction: squadsApi.list,
    schema: zSquads,
    onError: error => console.log(error),
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  function openSquadUsersDialog(squad: TSquad) {
    setUsersSquadToEdit({
      isOpen: true,
      squad,
    });
  }

  function openEditDialog(squad: TSquad | null = null) {
    setSquadToEdit({
      isOpen: true,
      squad,
    });
  }

  function openDeleteDialog(squad: TSquad | null = null) {
    setSquadToDelete({
      isOpen: true,
      squad,
    });
  }

  async function closeDialogs(shouldReload: boolean = false) {
    setSquadToEdit({ isOpen: false, squad: null });
    setSquadToDelete({ isOpen: false, squad: null });
    setUsersSquadToEdit({ isOpen: false, squad: null });
    if (shouldReload) await fetch();
  }

  async function deleteSquad() {
    const loadingId = toast.loading('Deletando o time');
    try {
      await squadsApi.deleteSquad(squadToDelete.squad!.id);
      await closeDialogs(true);
      toast.success('Time deletado!', { id: loadingId });
    } catch (error) {
      console.warn(error);
      toast.error('Ocorreu um erro ao deletar o time!', { id: loadingId });
    }
  }

  return (
    <PageBox
      title={'Times'}
      header={
        <Button
          variant={'default'}
          className='cursor-pointer'
          onClick={() => openEditDialog()}
        >
          Novo time
        </Button>
      }
    >
      <DragonTable
        data={squads}
        columns={[
          {
            header: { label: 'Logo' },
            html: squad => {
              return (
                <Image
                  src={squad?.logo?.length ? squad.logo : emptyProfilePic}
                  alt={'Logo da squad'}
                  width={40}
                  height={40}
                />
              );
            },
          },
          {
            header: { label: 'Nome' },
            accessor: 'name',
          },
          {
            header: { label: 'Pontos' },
            accessor: 'score',
          },
          {
            header: { label: 'Ações' },
            width: '100px',
            buttons: [
              {
                title: 'Editar usuários do time',
                icon: <Users className='h-4 w-4' />,
                action: squad => openSquadUsersDialog(squad),
              },
              {
                title: 'Editar time',
                icon: <Pencil className='h-4 w-4' />,
                action: squad => openEditDialog(squad),
              },
              {
                title: 'Remover time',
                icon: <Trash className='h-4 w-4' />,
                action: squad => openDeleteDialog(squad),
              },
            ],
          },
        ]}
        isLoading={isLoading}
      />

      {squadToEdit.isOpen && (
        <EditSquad
          squadToEdit={squadToEdit.squad}
          close={closeDialogs}
          onSuccess={fetch}
        />
      )}

      {usersSquadToEdit.isOpen && (
        <EditUsersSquad
          squadId={usersSquadToEdit.squad!.id}
          close={closeDialogs}
        />
      )}

      <AlertConfirmDialog
        isOpen={squadToDelete.isOpen}
        title={'Tem certeza que deseja deletar o time?'}
        description={
          'Esta ação não pode ser desfeita. Isso excluirá permanentemente o' +
          'time e removerá seus dados de nossos servidores.'
        }
        onConfirm={deleteSquad}
        close={closeDialogs}
      />
    </PageBox>
  );
};

export default Squads;

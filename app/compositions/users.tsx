import React, { useEffect, useState } from 'react';
import PageBox from '@/app/components/page-box';
import { Button } from '@/components/ui/button';
import { TUser, zUsers } from '@/app/schemas/user.zod';
import EditUser from '@/app/components/edit-user.tsx';
import { userApi } from '@/app/api/user';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import EditUserSquads from '../components/edit-user-squads.tsx';
import { toast } from 'sonner';
import DragonTable from '@/components/ui/table/dragon-table';
import { useTableData } from '@/app/hooks/use-table-data';
import { usersApi } from '@/app/api/users';
import emptyProfilePic from '@assets/empty-states/empty_profile.png';
import Image from 'next/image';
import { Pencil, ShieldHalf, Trash } from 'lucide-react';

const Users = () => {
  const [userToEdit, setUserToEdit] = useState<{
    isOpen: boolean;
    user: TUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [userToDelete, setUserToDelete] = useState<{
    isOpen: boolean;
    user: TUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [squadUserToEdit, setSquadUserToEdit] = useState<{
    isOpen: boolean;
    user: TUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  function openDeleteDialog(user: TUser | null = null) {
    setUserToDelete({
      isOpen: true,
      user: user,
    });
  }

  function openEditDialog(user: TUser | null = null) {
    setUserToEdit({
      isOpen: true,
      user: user,
    });
  }

  function openEditSquadUserDialog(user: TUser | null = null) {
    setSquadUserToEdit({
      isOpen: true,
      user: user,
    });
  }

  async function closeDialog(shouldReload = false) {
    setUserToDelete({ isOpen: false, user: null });
    setUserToEdit({ isOpen: false, user: null });
    setSquadUserToEdit({ isOpen: false, user: null });
    if (shouldReload) await fetch();
  }

  async function deleteUser() {
    const loadingId = toast.loading('Deletando usuário.');
    try {
      await userApi.deleteUser(userToDelete.user!.id);
      await closeDialog(true);
      toast.success('Deletado!', { id: loadingId });
    } catch (error) {
      console.warn(error);
      toast.error('Não foi possível deletar!', { id: loadingId });
    }
  }

  const { data, isLoading, error, fetch } = useTableData({
    fetchFunction: usersApi.list,
    schema: zUsers,
    onError: error => console.error('Erro ao carregar dados:', error),
    onSuccess: data => console.log('Dados carregados:', data.length),
  });

  useEffect(() => {
    (async () => {
      await fetch();
    })();
  }, []);

  return (
    <PageBox
      title={'Colaboradores da organização'}
      header={
        <Button
          variant={'default'}
          className='cursor-pointer'
          onClick={() => openEditDialog()}
        >
          Novo colaborador
        </Button>
      }
    >
      <DragonTable
        data={data}
        columns={[
          {
            header: { label: 'Foto' },
            html: data => (
              <div>
                <Image
                  src={data.picture?.length ? data.picture : emptyProfilePic}
                  alt={'Foto de perfil do usuário'}
                  className={'rounded-full w-8 h-8'}
                  width={40}
                  height={40}
                />
              </div>
            ),
          },
          {
            header: { label: 'Nome' },
            accessor: 'userName',
          },
          {
            header: { label: 'E-mail' },
            accessor: 'email',
          },
          {
            header: { label: 'Ações' },
            width: '80px',
            buttons: [
              {
                title: 'Times',
                action: arg => openEditSquadUserDialog(arg),
                icon: <ShieldHalf className='h-4 w-4' />,
              },
              {
                title: 'Editar',
                action: arg => openEditDialog(arg),
                icon: <Pencil className='h-4 w-4' />,
              },
              {
                title: 'Deletar',
                action: arg => openDeleteDialog(arg),
                icon: <Trash className='h-4 w-4' />,
              },
            ],
          },
        ]}
        isLoading={isLoading}
        error={error}
        emptyMessage='Nenhum usuário cadastrado...'
      />

      {userToEdit.isOpen && (
        <EditUser
          userToEdit={userToEdit.user}
          close={closeDialog}
          onSuccess={fetch}
        />
      )}

      {squadUserToEdit.isOpen && (
        <EditUserSquads userId={squadUserToEdit.user!.id} close={closeDialog} />
      )}

      <AlertConfirmDialog
        isOpen={userToDelete.isOpen}
        title={'Tem certeza que deseja deletar o usuário?'}
        description={
          'Esta ação não pode ser desfeita. Isso excluirá permanentemente sua' +
          'conta e removerá seus dados de nossos servidores.'
        }
        onConfirm={deleteUser}
        close={closeDialog}
      />
    </PageBox>
  );
};

export default Users;

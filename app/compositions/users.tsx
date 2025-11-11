import React, { useState } from 'react';
import PageBox from '@/app/components/page-box';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, ShieldHalf, Trash } from 'lucide-react';
import { TUser } from '@/app/schemas/user.zod';
import EditUser from '@/app/components/edit-user.tsx';
import { userApi } from '@/app/api/user';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import Image from 'next/image';
import EditUserSquads from '../components/edit-user-squads.tsx';

const Users = ({ users, fetch }: { users: TUser[]; fetch: () => void }) => {
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

  function closeDialog(shouldReload = false) {
    setUserToDelete({ isOpen: false, user: null });
    setUserToEdit({ isOpen: false, user: null });
    setSquadUserToEdit({ isOpen: false, user: null });
    if (shouldReload) fetch();
  }

  async function deleteUser() {
    try {
      await userApi.deleteUser(userToDelete.user!.id);
      closeDialog(true);
    } catch (error) {
      console.warn(error);
    }
  }

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
      <Table>
        <TableCaption>
          Lista de colaboradores cadastrados: {users.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold'>Foto</TableHead>
            <TableHead className='font-bold'>Nome</TableHead>
            <TableHead className='font-bold'>E-mail</TableHead>
            <TableHead className='w-[100px] font-bold'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={'cursor-default'}>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell width={100}>
                {user.picture && (
                  <Image
                    src={user.picture}
                    alt={'Foto de perfil do usuário'}
                    className={'rounded-full w-8 h-8'}
                    width={40}
                    height={40}
                  />
                )}
              </TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openEditSquadUserDialog(user)}
                  title={'Times'}
                >
                  <ShieldHalf className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openEditDialog(user)}
                  title={'Editar'}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openDeleteDialog(user)}
                  title={'Deletar'}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {userToEdit.isOpen && (
        <EditUser user={userToEdit.user} close={closeDialog} />
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

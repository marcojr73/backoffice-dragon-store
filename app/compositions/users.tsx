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
import { Pencil, Trash } from 'lucide-react';
import { TUser } from '@/app/schemas/user.zod';
import EditUser from '@/app/components/edit-user.tsx';
import { userApi } from '@/app/api/user';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';

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

  function closeDeleteDialog(shouldReload: boolean = false) {
    setUserToDelete({ isOpen: false, user: null });
    if (shouldReload) fetch();
  }

  function closeEditDialog(shouldReload: boolean = false) {
    setUserToEdit({ isOpen: false, user: null });
    if (shouldReload) fetch();
  }

  async function deleteUser() {
    try {
      await userApi.deleteUser(userToDelete.user!.id);
      closeDeleteDialog(true);
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
          Lista de produtos cadastrados: {users.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold'>Nome</TableHead>
            <TableHead className='font-bold'>E-mail</TableHead>
            <TableHead className='w-[100px] font-bold'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={'cursor-default'}>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openEditDialog(user)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openDeleteDialog(user)}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {userToEdit.isOpen && (
        <EditUser user={userToEdit.user} close={closeEditDialog} />
      )}
      <AlertConfirmDialog
        isOpen={userToDelete.isOpen}
        title={'Tem certeza que deseja deletar o usuário?'}
        description={
          'Esta ação não pode ser desfeita. Isso excluirá permanentemente sua' +
          'conta e removerá seus dados de nossos servidores.'
        }
        onConfirm={deleteUser}
        close={closeDeleteDialog}
      />
    </PageBox>
  );
};

export default Users;

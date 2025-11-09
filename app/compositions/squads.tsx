import React, { useState } from 'react';
import PageBox from '@/app/components/page-box';
import { TSquad } from '@/app/schemas/squads.zod';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash, Users } from 'lucide-react';
import EditSquad from '@/app/components/edit-squad.tsx';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import { squadsApi } from '@/app/api/squads';
import Image from 'next/image';
import EditUsersSquad from '@/app/components/edit-users-squad.tsx';

const Squads = ({ squads, fetch }: { squads: TSquad[]; fetch: () => void }) => {
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

  function closeDialogs(shouldReload: boolean = false) {
    setSquadToEdit({ isOpen: false, squad: null });
    setSquadToDelete({ isOpen: false, squad: null });
    setUsersSquadToEdit({ isOpen: false, squad: null });
    if (shouldReload) fetch();
  }

  async function deleteProduct() {
    try {
      await squadsApi.deleteSquad(squadToDelete.squad!.id);
      closeDialogs(true);
    } catch (error) {
      console.warn(error);
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
      <Table>
        <TableCaption>Lista de times cadastrados: {squads.length}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold'>Logo</TableHead>
            <TableHead className='font-bold'>Nome</TableHead>
            <TableHead className='font-bold'>
              <span>Pontos</span>
            </TableHead>
            <TableHead className='w-[100px] font-bold'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={'cursor-default'}>
          {squads.map((squad, index) => (
            <TableRow key={index}>
              <TableCell width={100}>
                {squad.logo && (
                  <Image
                    src={squad.logo}
                    alt={'Logo da squad'}
                    width={40}
                    height={40}
                  />
                )}
              </TableCell>
              <TableCell>{squad.name}</TableCell>
              <TableCell>{squad.score}</TableCell>
              <TableCell>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openSquadUsersDialog(squad)}
                >
                  <Users className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openEditDialog(squad)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openDeleteDialog(squad)}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {squadToEdit.isOpen && (
        <EditSquad squad={squadToEdit.squad} close={closeDialogs} />
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
        onConfirm={deleteProduct}
        close={closeDialogs}
      />
    </PageBox>
  );
};

export default Squads;

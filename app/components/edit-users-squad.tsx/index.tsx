import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Trash } from 'lucide-react';
import { squadsApi } from '@/app/api/squads';
import { useQuery } from '@/app/hooks/use-query';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import NotFound from '@/app/compositions/not-found';
import { zUsersSquad } from '@/app/schemas/squads.zod';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { Input } from '@/components/ui/form-inputs/input';
import { usersApi } from '@/app/api/users';
import { toast } from 'sonner';

const EditUsersSquad = ({
  squadId,
  close,
}: {
  squadId: number;
  close: (shouldReload?: boolean) => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
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

  async function getUsers() {
    if (!squad) return [];

    const response = await usersApi.list();

    const existingUserIds = squad.usersSquad.map(userSquad => userSquad.id);

    return response
      .filter(user => !existingUserIds.includes(user.id))
      .map(user => ({
        value: user.id,
        label: user.userName,
      }));
  }

  const onSubmit = async (data: { search: string }) => {
    try {
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

        {squad && (
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
                remote={{ fetchFunction: getUsers }}
              />
            </form>
            <Table>
              <TableCaption>
                Lista de colaboradores da equipe: {squad.usersSquad.length}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold'>Nome</TableHead>
                  <TableHead className='w-[50px] font-bold'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={'cursor-default'}>
                {squad.usersSquad.map((userSquad, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {userSquad.picture && (
                          <Image
                            src={userSquad.picture}
                            alt={'Foto de perfil'}
                            width={100}
                            height={100}
                            className={'rounded-full w-6 h-6'}
                          />
                        )}
                        <span>{userSquad.userName}</span>
                        {userSquad.id === squad.squadLeaderId && (
                          <span className='bg-accent px-2 py-0 rounded-sm text-xs'>
                            Líder
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        className={'cursor-pointer'}
                        size='icon'
                        onClick={() => deleteUser(userSquad.id)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        {isLoading && <Spinner />}
        {Boolean(error) && <NotFound message={'Ocorreu um erro'}></NotFound>}

        <DialogFooter>
          <Button type={'submit'}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUsersSquad;

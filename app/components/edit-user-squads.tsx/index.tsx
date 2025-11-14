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
import { Pencil, ShieldEllipsis, UserMinus } from 'lucide-react';
import { squadsApi } from '@/app/api/squads';
import { zUserSquads } from '@/app/schemas/squads.zod';
import { useQuery } from '@/app/hooks/use-query';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import NotFound from '@/app/compositions/not-found';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

const EditUserSquads = ({
  userId,
  close,
}: {
  userId: number;
  close: (shouldReload?: boolean) => void;
}) => {
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

  async function getSquads() {
    if (!userSquads) {
      return [];
    }
    const response = await squadsApi.list();
    return response
      .map(squad => ({
        value: squad.id,
        label: squad.name,
      }))
      .filter(
        squad =>
          squad.value !==
          userSquads.find(userSquad => userSquad.squad.id === squad.value)
            ?.squad.id
      );
  }

  const onSubmit = async (data: { squadId: number }) => {
    const loadingId = toast.loading('Adicionando colaborador ao time');
    try {
      await squadsApi.addUserSquad(data.squadId, { id: userId });
      toast.success('Atualizado!', { id: loadingId });
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
          {userSquads && Boolean(userSquads.length > 0) && (
            <>
              <Input
                label={'Nome'}
                placeholder='Nome do time'
                type={'typeahead'}
                control={control}
                action={{ onSubmitButton: () => handleSubmit(onSubmit) }}
                remote={{ fetchFunction: getSquads }}
                name={'squadId'}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold'>Nome</TableHead>
                    <TableHead className='w-[50px] font-bold'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={'cursor-default'}>
                  {userSquads.map((userSquad, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {userSquad.squad && (
                            <Image
                              src={userSquad.squad.logo ?? ''}
                              alt={'Foto de perfil'}
                              width={100}
                              height={100}
                              className={'rounded-full w-6 h-6'}
                            />
                          )}

                          <span>{userSquad.squad.name}</span>

                          {userSquad.squad.squadLeaderId === userId && (
                            <span className='bg-accent px-2 py-0 rounded-sm text-xs'>
                              Líder
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={'ghost'}
                          className={'cursor-pointer'}
                          size='icon'
                          type={'button'}
                          onClick={() =>
                            promoteToAdmin(
                              userSquad.squad.id,
                              userSquad.squad.squadLeaderId === userId
                                ? null
                                : userId
                            )
                          }
                          title={'Promover a líder do time'}
                        >
                          <ShieldEllipsis className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          className={'cursor-pointer'}
                          size='icon'
                          title={'Remover colaborador do time'}
                          onClick={() => deleteUser(userSquad.squad.id)}
                        >
                          <UserMinus className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </form>

        {isLoading && <Spinner />}

        {Boolean(error) && <NotFound message={'Ocorreu um erro'}></NotFound>}

        <DialogFooter>
          <Button type={'submit'}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserSquads;

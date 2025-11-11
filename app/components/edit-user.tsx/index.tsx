import React from 'react';
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
import { TUser } from '@/app/schemas/user.zod';
import { userApi } from '@/app/api/user';
import { toast } from 'sonner';
import { squadsApi } from '@/app/api/squads';

const EditUser = ({
  user,
  close,
}: {
  user: TUser | null;
  close: (shouldReload?: boolean) => void;
}) => {
  const { control, handleSubmit } = useForm<TUser & { squadId: number }>({
    defaultValues: {
      userName: user?.userName ?? '',
      email: user?.email ?? '',
      picture: user?.picture ?? '',
      password: user?.password ?? '',
      coins: user?.coins ?? 0,
      gas: user?.gas,
      isAdmin: user?.isAdmin,
    },
  });

  const onSubmit = async (data: TUser) => {
    const loadingId = toast.loading('Criando o usuário');
    try {
      if (user !== null) {
        await userApi.update(user.id, data);
      } else {
        await userApi.create(data);
      }
      toast.success('Sucesso', { id: loadingId });
    } catch (error) {
      toast.error('Ocorreu um erro', { id: loadingId });
      console.error('Erro ao salvar:', error);
    }
  };

  async function getSquads() {
    const response = await squadsApi.list();
    return response.map(squad => ({
      value: squad.id,
      label: squad.name,
    }));
  }

  return (
    <Dialog open onOpenChange={() => close()}>
      <DialogContent aria-describedby={'usuários'}>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              <div className='flex gap-2'>
                <Pencil className='h-4 w-4' />
                <span>Editar</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <Input label={'Nome'} control={control} name={'userName'} />
          <Input label={'E-mail'} control={control} name={'email'} />
          <Input
            label={'Foto'}
            type={'file'}
            control={control}
            name={'picture'}
          />
          <Input
            label={'Administrador'}
            type={'switch'}
            control={control}
            name={'isAdmin'}
          />
          <Input
            label={'Senha'}
            control={control}
            name={'password'}
            type={'password'}
          />
          <DialogFooter>
            <Button type={'submit'}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
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

const EditUser = ({
  user,
  close,
}: {
  user: TUser | null;
  close: (shouldReload?: boolean) => void;
}) => {
  const { register, handleSubmit } = useForm<TUser>({
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
    try {
      if (user !== null) {
        await userApi.update(user.id, data);
      } else {
        await userApi.create(data);
      }
      close(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

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
          <Input label={'Nome'} {...register('userName')} />
          <Input label={'E-mail'} {...register('email')} />
          <Input label={'Foto'} {...register('picture')} />
          <Input
            label={'Administrador'}
            type={'switch'}
            {...register('isAdmin')}
          />
          <Input label={'Senha'} {...register('password')} type={'password'} />
          <Input
            type={'number'}
            label={'Moedas para enviar'}
            {...register('coins')}
          />
          <Input
            type={'number'}
            label={'Moedas para consumir'}
            {...register('gas')}
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

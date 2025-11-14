import React, { useState } from 'react';
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
import { errorMessages } from '@/app/utils/error-messages';

const EditUser = ({
  userToEdit,
  close,
  onSuccess,
}: {
  userToEdit: TUser | null;
  close: (shouldReload?: boolean) => void;
  onSuccess?: () => void;
}) => {
  const [user, setUser] = useState<TUser | null>(userToEdit);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TUser & { squadId: number }>({
    defaultValues: {
      userName: user?.userName ?? '',
      email: user?.email ?? '',
      picture: user?.picture ?? '',
      password: user?.password ?? '',
      isAdmin: user?.isAdmin ?? false,
    },
  });

  const onSubmit = async (data: TUser) => {
    const loadingId = toast.loading(
      `${user ? 'Atualizando' : 'Criando'} o usuário...`
    );
    try {
      if (user !== null) {
        await userApi.update(user.id, data);
      } else {
        const userCreated = await userApi.create(data);
        setUser({ ...data, id: +userCreated.id });
      }
      toast.success('Sucesso', { id: loadingId });
      onSuccess && onSuccess();
    } catch (error) {
      toast.error('Ocorreu um erro', { id: loadingId });
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
                <span>
                  {user ? `Editar ${user?.userName}` : 'Criar usuário'}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <Input
            label={'Nome'}
            control={control}
            name={'userName'}
            rules={{
              required: {
                value: true,
                message: errorMessages.requiredField,
              },
              minLength: {
                value: 3,
                message: 'Nome deve conter 3 caracteres',
              },
            }}
            error={errors.userName?.message}
          />
          <Input
            label='E-mail'
            control={control}
            name='email'
            rules={{
              required: {
                value: true,
                message: errorMessages.requiredField,
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'O campo deve ser um e-mail válido',
              },
            }}
            error={errors.email?.message}
          />
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

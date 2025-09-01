import React, { useState } from 'react';
import PageBox from '@/app/components/page-box';
import { TProduct } from '@/app/schemas/products.zod';
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
import { Coins, Pencil, Trash } from 'lucide-react';
import EditProduct from '@/app/components/edit-product.tsx';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import { productsApi } from '@/app/api/products';

const Products = ({
  products,
  fetch,
}: {
  products: TProduct[];
  fetch: () => void;
}) => {
  const [productToEdit, setProductToEdit] = useState<{
    isOpen: boolean;
    product: TProduct | null;
  }>({
    isOpen: false,
    product: null,
  });

  const [productToDelete, setProductToDelete] = useState<{
    isOpen: boolean;
    product: TProduct | null;
  }>({
    isOpen: false,
    product: null,
  });

  function openEditDialog(product: TProduct | null = null) {
    setProductToEdit({
      isOpen: true,
      product: product,
    });
  }

  function openDeleteDialog(product: TProduct | null = null) {
    setProductToDelete({
      isOpen: true,
      product: product,
    });
  }

  function closeEditDialog(shouldReload: boolean = false) {
    setProductToEdit({ isOpen: false, product: null });
    if (shouldReload) fetch();
  }

  function closeDeleteDialog(shouldReload: boolean = false) {
    setProductToDelete({ isOpen: false, product: null });
    if (shouldReload) fetch();
  }

  async function deleteProduct() {
    try {
      await productsApi.deleteProduct(productToDelete.product!.id);
      closeDeleteDialog(true);
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <PageBox
      title={'Produtos'}
      header={
        <Button
          variant={'default'}
          className='cursor-pointer'
          onClick={() => openEditDialog()}
        >
          Novo produto
        </Button>
      }
    >
      <Table>
        <TableCaption>
          Lista de produtos cadastrados: {products.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold'>Nome</TableHead>
            <TableHead className='font-bold'>
              <div className={'flex items-center gap-2'}>
                <span>Valor</span>
                <Coins />
              </div>
            </TableHead>
            <TableHead className='w-[100px] font-bold'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={'cursor-default'}>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.value}</TableCell>
              <TableCell>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openEditDialog(product)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  className={'cursor-pointer'}
                  size='icon'
                  onClick={() => openDeleteDialog(product)}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {Boolean(productToEdit.isOpen) && (
        <EditProduct product={productToEdit.product} close={closeEditDialog} />
      )}
      <AlertConfirmDialog
        isOpen={productToDelete.isOpen}
        title={'Tem certeza que deseja deletar o usuário?'}
        description={
          'Esta ação não pode ser desfeita. Isso excluirá permanentemente sua' +
          'conta e removerá seus dados de nossos servidores.'
        }
        onConfirm={deleteProduct}
        close={closeDeleteDialog}
      />
    </PageBox>
  );
};

export default Products;

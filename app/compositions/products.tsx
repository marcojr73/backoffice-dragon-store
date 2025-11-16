import React, { useEffect, useState } from 'react';
import PageBox from '@/app/components/page-box';
import { TProduct, zProducts } from '@/app/schemas/products.zod';
import { Button } from '@/components/ui/button';
import { Coins, Pencil, Trash } from 'lucide-react';
import EditProduct from '@/app/components/edit-product.tsx';
import { AlertConfirmDialog } from '@/app/components/alert-confirm-dialog.tsx';
import { productsApi } from '@/app/api/products';
import DragonTable from '@/components/ui/table/dragon-table';
import { useQuery } from '@/app/hooks/use-query';

const Products = () => {
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

  const {
    data: products,
    fetch,
    isLoading,
  } = useQuery({
    fetchFunction: productsApi.get,
    schema: zProducts,
    onError: error => console.log(error),
  });

  useEffect(() => {
    (async () => fetch())();
  }, []);

  const columns = [
    {
      accessor: 'name' as keyof TProduct,
      header: { label: 'Nome' },
    },
    {
      accessor: 'value' as keyof TProduct,
      header: {
        label: (
          <div className={'flex items-center gap-2'}>
            <span>Valor</span>
            <Coins />
          </div>
        ) as any,
      },
    },
    {
      header: { label: 'Ações' },
      width: '100px',
      buttons: [
        {
          title: 'Editar produto',
          icon: <Pencil className='h-4 w-4' />,
          action: (product: TProduct) => openEditDialog(product),
        },
        {
          title: 'Deletar produto',
          icon: <Trash className='h-4 w-4' />,
          action: (product: TProduct) => openDeleteDialog(product),
        },
      ],
    },
  ];

  return (
    <PageBox
      title={'Recompensas'}
      header={
        <Button
          variant={'default'}
          className='cursor-pointer'
          onClick={() => openEditDialog()}
        >
          Nova recompensa
        </Button>
      }
    >
      <DragonTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage='Nenhuma recompensa cadastrada'
      />

      {Boolean(productToEdit.isOpen) && (
        <EditProduct product={productToEdit.product} close={closeEditDialog} />
      )}

      <AlertConfirmDialog
        isOpen={productToDelete.isOpen}
        title={'Tem certeza que deseja deletar o produto?'}
        description={
          'Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto' +
          ' e removerá seus dados de nossos servidores.'
        }
        onConfirm={deleteProduct}
        close={closeDeleteDialog}
      />
    </PageBox>
  );
};

export default Products;

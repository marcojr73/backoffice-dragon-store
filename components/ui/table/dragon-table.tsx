import React, { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import NotFound from '@/app/compositions/not-found';

type TButton<T> = {
  title?: string;
  icon: ReactNode;
  action: (arg: T) => void;
};

type TColumn<T> = {
  accessor?: keyof T;
  width?: string;
  header: {
    label: string;
  };
  html?: (arg: T) => ReactNode;
  format?: (arg: T) => string;
  buttons?: TButton<T>[];
};

type TProps<T> = {
  data: T[] | null;
  columns: TColumn<T>[];
  isLoading: boolean;
  error?: string | null;
  emptyMessage?: string;
};

function DragonTable<T>({
  data,
  columns,
  isLoading,
  error,
  emptyMessage = 'Nenhum dado...',
}: TProps<T>) {
  return (
    <Table>
      <TableHeaderComponent columns={columns} />
      <TableBodyComponent
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        emptyMessage={emptyMessage}
      />
    </Table>
  );
}

function TableHeaderComponent<T>({ columns }: { columns: TColumn<T>[] }) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column, index) => (
          <TableHead
            key={index}
            className='font-bold'
            style={{ width: column.width || 'auto' }}
          >
            {column.header.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

function ActionButtons<T>({
  buttons,
  data,
}: {
  buttons: TButton<T>[];
  data: T;
}) {
  return (
    <>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={'ghost'}
          className={'cursor-pointer'}
          size='icon'
          type={'button'}
          title={button.title}
          onClick={() => button.action(data)}
        >
          {button.icon}
        </Button>
      ))}
    </>
  );
}

function CellValue<T>({ data, column }: { data: T; column: TColumn<T> }) {
  function renderCellValue(data: T, column: TColumn<T>) {
    if (column.format) {
      return column.format(data);
    }

    if (!column.accessor) {
      return null;
    }

    const value = data[column.accessor];

    if (typeof value === 'string') {
      return value;
    }

    return null;
  }

  return (
    <div className='flex items-center gap-2'>
      {column.html ? (
        column.html(data)
      ) : (
        <span>{renderCellValue(data, column)}</span>
      )}
    </div>
  );
}

function TableCellComponent<T>({
  data,
  column,
}: {
  data: T;
  column: TColumn<T>;
}) {
  return (
    <TableCell>
      {column.buttons?.length ? (
        <ActionButtons buttons={column.buttons} data={data} />
      ) : (
        <CellValue data={data} column={column} />
      )}
    </TableCell>
  );
}

function TableRowComponent<T>({
  data,
  columns,
  index,
}: {
  data: T;
  columns: TColumn<T>[];
  index: number;
}) {
  return (
    <TableRow key={index}>
      {columns.map((column, columnIndex) => (
        <TableCellComponent key={columnIndex} data={data} column={column} />
      ))}
    </TableRow>
  );
}

function TableBodyComponent<T>({
  data,
  columns,
  isLoading,
  error,
  emptyMessage,
}: {
  data: T[] | null;
  columns: TColumn<T>[];
  isLoading: boolean;
  error?: string | null;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <caption className={'w-full py-10'}>
        <Spinner
          variant={'circle'}
          className={'w-10 h-10'}
          text={'Carregando...'}
        />
      </caption>
    );
  }

  if (error) {
    return (
      <caption className='w-full'>
        <NotFound message={`Erro: ${error}`} size={'md'} />
      </caption>
    );
  }

  if (data?.length === 0) {
    return (
      <caption className='w-full py-10'>
        <NotFound message={emptyMessage} size={'md'} />
      </caption>
    );
  }

  return (
    <TableBody className={'cursor-default'}>
      {data &&
        data.map((rowData, index) => (
          <TableRowComponent
            key={index}
            data={rowData}
            columns={columns}
            index={index}
          />
        ))}
    </TableBody>
  );
}

export default DragonTable;

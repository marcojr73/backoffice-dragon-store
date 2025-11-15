// hooks/use-table-data.ts
import { useCallback, useState } from 'react';
import { z } from 'zod';

type UseTableDataProps<T> = {
  fetchFunction: () => Promise<T[]>;
  schema: z.ZodType<T[]>;
  onError?: (error: any) => void;
  onSuccess?: (data: T[]) => void;
};

export function useTableData<T>({
  fetchFunction,
  schema,
  onError,
  onSuccess,
}: UseTableDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFunction();
      const validatedData = schema.parse(result);

      setData(validatedData);
      onSuccess?.(validatedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, schema, onError, onSuccess]);

  const reload = useCallback(() => fetch(), [fetch]);

  return {
    data,
    isLoading,
    error,
    fetch,
    reload,
  };
}

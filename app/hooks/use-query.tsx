import { useReducer, useRef } from 'react';
import { z } from 'zod';

type State<T> = {
  data: T | null;
  isLoading: boolean;
  error: unknown;
};

type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: unknown };

function queryReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, isLoading: false, error: null };
    case 'FETCH_ERROR':
      return { data: null, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function useQuery<T, K = undefined>({
  fetchFunction,
  schema,
  params,
  onSuccess,
  onError,
}: {
  fetchFunction: (args: K | undefined) => Promise<T>;
  schema: z.ZodType<T>;
  params?: K;
  onSuccess?: (arg: T) => Promise<void> | void;
  onError?: (error: unknown) => void;
}) {
  const b = 3;
  const [state, dispatch] = useReducer(queryReducer<T>, {
    data: null,
    isLoading: false,
    error: null,
  });
  const previousParamsRef = useRef<K>(undefined);

  async function fetch() {
    previousParamsRef.current = params;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });

      try {
        const result = await fetchFunction(params);

        const validationResult = schema.safeParse(result);

        if (!validationResult.success) {
          throw new Error(validationResult.error.toString());
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: validationResult.data });
        onSuccess && onSuccess(validationResult.data);
      } catch (error: unknown) {
        dispatch({ type: 'FETCH_ERROR', payload: error });
        onError && onError(error);
      }
    };

    await fetchData();
  }

  return { ...state, fetch };
}

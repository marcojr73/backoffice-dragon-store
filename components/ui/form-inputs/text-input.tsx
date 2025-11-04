import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import * as React from 'react';
import { cn } from '@/app/utils/utils';

const TextInput = <T extends FieldValues>({
  control,
  name,
  className,
  rules,
  maskFormatter,
  ...props
}: React.ComponentProps<'input'> & {
  error?: string;
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, (string | undefined) & Path<T>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  maskFormatter?: (value: string) => string;
}) => {
  const isDateInput = props.type === 'date';

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: controllerField }) => (
        <div className={cn('relative', isDateInput && 'w-full')}>
          <input
            id={props.id}
            type={props.type || 'text'}
            data-slot='input'
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              isDateInput &&
                '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100',
              className
            )}
            {...controllerField}
            onChange={e => {
              const rawValue = e.target.value;
              const formattedValue = maskFormatter
                ? maskFormatter(rawValue)
                : rawValue;
              controllerField.onChange(formattedValue);
            }}
            {...props}
          />
        </div>
      )}
    />
  );
};

export default TextInput;

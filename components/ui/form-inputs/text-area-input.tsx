import React from 'react';
import { cn } from '@/app/utils/utils';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const TextAreaInput = <T extends FieldValues>({
  control,
  name,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  error?: string;
  control: Control<T>;
  name: Path<T>;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: controllerField }) => (
        <textarea
          data-slot='textarea'
          className={cn(
            'border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className
          )}
          {...controllerField}
          {...(props as React.ComponentProps<'textarea'>)}
        />
      )}
    />
  );
};
export default TextAreaInput;

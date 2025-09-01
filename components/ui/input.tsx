import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

function Input({
  className,
  label,
  type,
  error,
  ...props
}: React.ComponentProps<'input'> & { label: string; error?: string }) {
  let field: any = (
    <input
      id={props.id}
      type={type}
      data-slot='input'
      aria-invalid={!!error}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );

  if (type === 'switch') {
    field = (
      <label className='relative inline-flex items-center cursor-pointer'>
        <input type='checkbox' className='peer sr-only' {...props} />
        <div
          className={cn(
            'peer h-[1.15rem] w-8 shrink-0 rounded-full border border-transparent shadow-xs transition-all',
            'bg-secondary peer-checked:bg-primary',
            'peer-focus-visible:outline-none peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-focus-visible:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'peer-checked:[&>#ball]:bg-secondary',
            'peer-checked:[&>#ball]:translate-x-[calc(100%-2px)]',
            className
          )}
        >
          <div
            id='ball'
            className={cn(
              'pointer-events-none block size-4 rounded-full bg-primary transition-transform'
            )}
          />
        </div>
      </label>
    );
  }

  if (type === 'textarea') {
    field = (
      <textarea
        data-slot='textarea'
        className={cn(
          'border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        {...(props as React.ComponentProps<'textarea'>)}
      />
    );
  }

  return (
    <div className=''>
      <Label htmlFor={props.id} className={'mb-2'}>
        {label}
      </Label>
      {field}
      {error && (
        <p className='text-sm text-red-500' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };

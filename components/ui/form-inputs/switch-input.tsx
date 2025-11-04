import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import * as React from 'react';
import { cn } from '@/app/utils/utils';

const SwitchInput = <T extends FieldValues>({
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
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='peer sr-only'
            checked={controllerField.value}
            onChange={e => controllerField.onChange(e.target.checked)}
            {...(props as React.ComponentProps<'input'>)}
          />
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
              className='pointer-events-none block size-4 rounded-full bg-primary transition-transform'
            />
          </div>
        </label>
      )}
    />
  );
};

export default SwitchInput;

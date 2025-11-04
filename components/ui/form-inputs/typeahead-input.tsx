'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { cn } from '@/app/utils/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const TypeaheadInput = <T extends FieldValues>({
  control,
  name,
  className,
  rules,
  maskFormatter,
  options,
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
  options: { value: string; label: string }[];
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='justify-between w-full'
            >
              {field.value
                ? options.find(option => option.value === field.value)?.label
                : props.placeholder}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[462px] p-0'>
            <Command>
              <CommandInput placeholder='Search framework...' className='h-9' />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {options.map(framework => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue: string) => {
                        field.onChange(
                          currentValue === field.value ? '' : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          field.value === framework.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
};

export default TypeaheadInput;

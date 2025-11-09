'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Plus, SearchIcon } from 'lucide-react';
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
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const TypeaheadInput = <T extends FieldValues>({
  control,
  name,
  className,
  rules,
  maskFormatter,
  remote,
  action,
  ...props
}: React.ComponentProps<'input'> & {
  error?: string;
  control: Control<T>;
  name: Path<T>;
  action?: {
    onSubmitButton: () => void;
  };
  rules?: Omit<
    RegisterOptions<T, (string | undefined) & Path<T>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  maskFormatter?: (value: string) => string;
  remote?: {
    fetchFunction: () =>
      | Promise<{ value: number; label: string }[]>
      | { value: number; label: string }[];
  };
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
  const [optionsFiltered, setOptionsFiltered] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (remote) {
        const response = await remote.fetchFunction();
        setOptions(response);
        setOptionsFiltered(response);
      }
    })();
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const popover = (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='justify-between w-full'
              >
                {field.value
                  ? optionsFiltered.find(
                      optionsFiltered => optionsFiltered.value == field.value
                    )?.label
                  : props.placeholder}
                <ChevronsUpDown className='opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[462px] p-0'>
              <Command>
                <div
                  data-slot='command-input-wrapper'
                  className='flex h-9 items-center gap-2 border-b px-3'
                >
                  <SearchIcon className='size-4 shrink-0 opacity-50' />
                  <input
                    data-slot='command-input'
                    placeholder='Buscar'
                    className={cn(
                      'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                      className
                    )}
                    onChange={event => {
                      setOptionsFiltered(
                        options.filter(option => {
                          return option.label
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase());
                        })
                      );
                    }}
                  />
                </div>
                <CommandList>
                  <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                  <CommandGroup>
                    {optionsFiltered.map(framework => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value.toString()}
                        onSelect={(currentValue: string) => {
                          field.onChange(
                            currentValue == field.value ? '' : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            field.value == framework.value
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
        );

        const wrapper = action ? (
          <div className='grid grid-cols-12 gap-1'>
            <div className={`col-span-${action ? '11' : '12'}`}>{popover}</div>
            <Button
              variant={'outline'}
              onClick={() => action.onSubmitButton()}
              className='col-span-1'
            >
              <Plus />
            </Button>
          </div>
        ) : (
          popover
        );
        return wrapper;
      }}
    />
  );
};

export default TypeaheadInput;

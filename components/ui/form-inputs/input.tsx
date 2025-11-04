import * as React from 'react';
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import FileInput from '@/components/ui/form-inputs/file-input';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import TextAreaInput from '@/components/ui/form-inputs/text-area-input';
import SwitchInput from '@/components/ui/form-inputs/switch-input';
import TextInput from '@/components/ui/form-inputs/text-input';
import ColorInput from '@/components/ui/form-inputs/color-input';
import TypeaheadInput from '@/components/ui/form-inputs/typeahead-input';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

function Input<T extends FieldValues>({
  className,
  label,
  type,
  control,
  name,
  error,
  rules,
  maskFormatter,
  ...props
}: React.ComponentProps<'input'> & {
  label: string;
  error?: string;
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, (string | undefined) & Path<T>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  maskFormatter?: (value: string) => string;
}) {
  console.log(error);
  let field: ReactNode;

  switch (type) {
    case 'switch':
      field = <SwitchInput control={control} name={name} />;
      break;
    case 'textarea':
      field = <TextAreaInput control={control} name={name} />;
      break;
    case 'file':
      field = <FileInput control={control} name={name} />;
      break;
    case 'color':
      field = <ColorInput control={control} name={name} />;
      break;
    case 'typeahead':
      field = (
        <TypeaheadInput
          control={control}
          name={name}
          options={frameworks}
          placeholder={props.placeholder}
        />
      );
      break;
    default:
      field = (
        <TextInput
          control={control}
          name={name}
          rules={rules}
          type={type}
          maskFormatter={maskFormatter}
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

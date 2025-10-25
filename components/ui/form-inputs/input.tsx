import * as React from 'react';
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import FileInput from '@/components/ui/form-inputs/file-input';
import { Control, FieldValues, Path } from 'react-hook-form';
import TextAreaInput from '@/components/ui/form-inputs/text-area-input';
import SwitchInput from '@/components/ui/form-inputs/switch-input';
import TextInput from '@/components/ui/form-inputs/text-input';

function Input<T extends FieldValues>({
  className,
  label,
  type,
  control,
  name,
  error,
  ...props
}: React.ComponentProps<'input'> & {
  label: string;
  error?: string;
  control: Control<T>;
  name: Path<T>;
}) {
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
    default:
      field = <TextInput control={control} name={name} />;
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

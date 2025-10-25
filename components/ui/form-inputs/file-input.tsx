import { useDropzone } from 'react-dropzone';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ImageUp } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { format } from '@/lib/format';

interface FileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error?: string;
}

function FileInput<T extends FieldValues>({
  control,
  name,
}: FileInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          },
          maxFiles: 1,
          multiple: false,
          onDrop: async (files: File[]) => {
            if (files[0]) {
              const base64 = await format.toBase64(files[0]);
              onChange(base64);
            } else {
              onChange(null);
            }
          },
        });

        const base64Value = value as string | null;

        return (
          <div
            {...getRootProps()}
            className='group border relative rounded-md h-9 cursor-pointer flex items-center p-1'
          >
            <input {...getInputProps()} />
            <div
              id='file-btn'
              className='group-hover:bg-accent duration-300 absolute right-0 top-0 bottom-0 flex justify-center items-center gap-2 rounded-sm p-2 m-1'
            >
              <ImageUp width={16} />
            </div>

            {base64Value && (
              <Image
                src={base64Value}
                width={100}
                height={100}
                className='h-full w-auto rounded-md'
                alt='Imagem anexada'
              />
            )}
          </div>
        );
      }}
    />
  );
}

export default FileInput;

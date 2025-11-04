import React, { useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const ColorInput = <T extends FieldValues>({
  control,
  name,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  error?: string;
  control: Control<T>;
  name: Path<T>;
}) => {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState('');

  const isValidHex = (value: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  };

  const normalizeHex = (value: string) => {
    if (!value) return '';
    let hex = value.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    return hex.toUpperCase();
  };

  const handleColorClick = () => {
    if (colorPickerRef.current) {
      colorPickerRef.current.click();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: controllerField }) => {
        const displayValue = controllerField.value || internalValue || '';
        const normalizedValue = normalizeHex(displayValue);
        const isValid = isValidHex(normalizedValue);
        const colorToShow = isValid ? normalizedValue : '#cccccc';

        return (
          <div className='relative'>
            <input
              id={props.id}
              type='text'
              data-slot='input'
              className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-12 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className}`}
              value={displayValue}
              onChange={e => {
                const value = e.target.value;
                setInternalValue(value);
                controllerField.onChange(value);
              }}
              onBlur={e => {
                const normalized = normalizeHex(e.target.value);
                if (isValidHex(normalized)) {
                  controllerField.onChange(normalized);
                  setInternalValue(normalized);
                }
                controllerField.onBlur();
              }}
              placeholder='#000000'
              {...props}
            />

            <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1'>
              <button
                type='button'
                onClick={handleColorClick}
                className='h-7 w-7 rounded border-none shadow-sm transition-transform outline-none cursor-pointer'
                style={{ backgroundColor: colorToShow }}
                aria-label='Selecionar cor'
              />
              <input
                ref={colorPickerRef}
                type='color'
                className='absolute opacity-0 pointer-events-none w-0 h-0'
                value={colorToShow}
                onChange={e => {
                  const newColor = e.target.value.toUpperCase();
                  controllerField.onChange(newColor);
                  setInternalValue(newColor);
                }}
                tabIndex={-1}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default ColorInput;

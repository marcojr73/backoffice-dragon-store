import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

const FieldSet = ({
  children,
  icon: Icon,
}: {
  children: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className='col-span-full font-bold mt-4 flex items-center gap-2'>
      {Icon && <Icon className='w-4 h-4' />}
      <span>{children}</span>
    </div>
  );
};

export default FieldSet;

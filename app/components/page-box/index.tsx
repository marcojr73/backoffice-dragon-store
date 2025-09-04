import React, { ReactNode } from 'react';

const PageBox = ({
  title,
  header,
  children,
}: {
  title: string;
  header?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <section className='bg-primary-light h-full p-6 rounded-md shadow-md'>
      <div className='flex flex-col gap-4 max-h-[100%] overflow-y-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-bold'>{title}</h1>
          {header}
        </div>
        {children}
      </div>
    </section>
  );
};

export default PageBox;

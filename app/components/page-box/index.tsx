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
    <section className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-bold'>{title}</h1>
        {header}
      </div>
      {children}
    </section>
  );
};

export default PageBox;

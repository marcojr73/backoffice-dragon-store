import React from 'react';
import Image from 'next/image';
import logo from '@assets/logos/dragon.png';

const NotFound = ({ message }: { message?: string }) => {
  return (
    <div className='w-full h-full flex justify-center items-center flex-col gap-4'>
      <Image src={logo} alt='Logo de dragão' width={100} height={100} />
      <p>{message}</p>
    </div>
  );
};

export default NotFound;

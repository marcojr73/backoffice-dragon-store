import React from 'react';
import Image from 'next/image';
import logo from '@assets/empty-states/sleeping_dragon.png';

const NotFound = ({
  message,
  size = 'sm',
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  function getImageSize() {
    switch (size) {
      case 'sm':
        return 100;
      case 'md':
        return 200;
      case 'lg':
        return 300;
      case 'xl':
        return 400;
    }
  }

  function getTextSize() {
    switch (size) {
      case 'sm':
        return '10px';
      case 'md':
        return '20px';
      case 'lg':
        return '20px';
      case 'xl':
        return '30px';
    }
  }

  return (
    <div className='w-full h-full flex justify-center items-center flex-col gap-4'>
      <Image
        src={logo}
        alt='Logo de dragão'
        width={getImageSize()}
        height={getImageSize()}
      />
      <p className={`text-${size}`}>{message}</p>
    </div>
  );
};

export default NotFound;

import React from 'react';
import PageBox from '@/app/components/page-box';
import Image from 'next/image';
import logo from '@assets/logos/dragon.png';

const Page = () => {
  return (
    <PageBox title={'Início'}>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <Image
          src={logo}
          alt={'Logo da dragon store'}
          width={200}
          height={200}
        />

        <p className='text-center px-40'>
          A Dragon Store é um produto da UEX que tem como objetivo bonificar a
          colaboração entre os funcionários de uma empresa de forma orgânica, os
          próprios funcionários têm o poder de bonificar os demais colaboradores
          pelo seu bom trabalho.{' '}
        </p>
      </div>
    </PageBox>
  );
};

export default Page;

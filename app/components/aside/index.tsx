import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Inbox, LucideProps, Settings, Tag, User, Users } from 'lucide-react';
import ToggleTheme from '@/app/components/toggle-theme/toggle-theme';
import Image from 'next/image';
import logo from '@assets/logos/dragon.png';

function Aside() {
  const items: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
  }[] = [
    {
      title: 'Marca',
      url: 'backoffice/marca',
      icon: Tag,
    },
    {
      title: 'Produtos',
      url: 'backoffice/produtos',
      icon: Inbox,
    },
    {
      title: 'Colaboradores',
      url: 'backoffice/colaboradores',
      icon: User,
    },
    {
      title: 'Times',
      url: 'backoffice/times',
      icon: Users,
    },
    {
      title: 'Settings',
      url: 'backoffice/configuracoes',
      icon: Settings,
    },
  ];

  return (
    <Sidebar color={'#F00'}>
      <SidebarHeader
        className={'flex flex-col items-center gap-2 bg-[#2D2E33]'}
      >
        <Image
          src={logo}
          alt={'Logo do Backoffice - Dragon store'}
          width={40}
          height={40}
        />
        <p className='font-bold'>Backoffice - Dragon store</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Customização da Loja</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Preferências</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <ToggleTheme />
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Aside;

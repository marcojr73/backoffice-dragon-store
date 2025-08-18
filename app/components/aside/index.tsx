import React from 'react';
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
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {Calendar, Inbox, Search, Settings} from "lucide-react"
import ToggleTheme from "@/app/components/toggle-theme/toggle-theme";

const Aside = () => {
    const items = [
        {
            title: "Marca",
            url: "/marca",
            icon: Inbox,
        },
        {
            title: "Produtos",
            url: "/produtos",
            icon: Inbox,
        },
        {
            title: "Colaboradores",
            url: "/colaboradores",
            icon: Calendar,
        },
        {
            title: "Equipes",
            url: "/equipes",
            icon: Search,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>Backoffice</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Customização da Loja</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
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
                            <ToggleTheme/>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
};

export default Aside;

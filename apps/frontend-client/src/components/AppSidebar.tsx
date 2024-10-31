"use client";
import { Briefcase, ChevronUp, Home, User } from "lucide-react";

import {
    Sidebar,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "./ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserProfile } from "./UserProfile";
import CollapsibleContentMenu from "./CollapsibleContentMenu";
import { itemsMenu } from "@/utils/navigationItems";
import SabaiROkLogo from "../../public/logoSabaiRok.svg";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarGroup>
                <SidebarGroupLabel>
                    <Image
                        src={SabaiROkLogo}
                        width={100}
                        height={100}
                        alt="logo"
                    />
                </SidebarGroupLabel>
            </SidebarGroup>
            <ScrollArea>
                <SidebarGroup className="h-full">
                    {itemsMenu.map((item, index) => (
                        <CollapsibleContentMenu
                            key={index}
                            item={item.item}
                            triggerName={item.triggerName}
                            iconTrigger={<item.iconTrigger />}
                            isCollapsibleOpen={item.isCollapsibleOpen}
                        />
                    ))}
                </SidebarGroup>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="py-6" asChild>
                                    <SidebarMenuButton>
                                        <UserProfile
                                            avatarImage="https://github.com/shadcn.png"
                                            fallback="yo"
                                        />
                                        Username
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <span>Account</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Billing</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </ScrollArea>
        </Sidebar>
    );
}

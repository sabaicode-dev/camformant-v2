import React from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
interface MenuItem {
    title: string;
    url: string;
    icon: React.ElementType;
}

interface CollapsibleContentMenuProps {
    item: MenuItem[];
    triggerName: string;
    iconTrigger: React.ReactNode;
    isCollapsibleOpen?: boolean;
}

const CollapsibleContentMenu: React.FC<CollapsibleContentMenuProps> = ({
    item,
    triggerName,
    iconTrigger,
    isCollapsibleOpen,
}) => {
    const pathname = usePathname();
    const isActive = pathname === item[0].url;
    return (
        <>
            {isCollapsibleOpen ? (
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="gap-2 text-[14px]">
                                <span className="size-7">{iconTrigger}</span>
                                {triggerName}
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent className="CollapsibleContent">
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <div className="relative">
                                        <Separator
                                            orientation="vertical"
                                            className="absolute left-0 top-0 h-full w-[1px] bg-gray-300"
                                            aria-orientation="vertical"
                                        />
                                        <SidebarMenu className="pl-4">
                                            {item.map((item: any) => (
                                                <SidebarMenuItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <Link
                                                            href={item.url}
                                                            className="flex items-center"
                                                        >
                                                            <item.icon />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </div>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            ) : (
                <SidebarGroupLabel className="px-2 py-6">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    href={item[0].url}
                                    className={cn("flex items-center", {
                                        "active-class": isActive,
                                    })}
                                >
                                    <span className="size-7">
                                        {iconTrigger}
                                    </span>
                                    {triggerName}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupLabel>
            )}
        </>
    );
};

export default CollapsibleContentMenu;

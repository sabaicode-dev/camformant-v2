"use client";
import { useRef } from "react";
import { Menubar } from "@/components/ui/menubar";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./ui/modeToggle";
import { Bell, Mail, SearchCheckIcon } from "lucide-react";
import { Input } from "./ui/input";
import { ToolTip } from "./ToolTip";
import { UserProfile } from "./UserProfile";

export const MenuBar = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        if (inputRef.current) {
            inputRef.current?.focus();
        }
    };

    return (
        <Menubar className="w-full py-8">
            <SidebarTrigger />
            <SearchCheckIcon
                onClick={handleSearch}
                className="cursor-pointer"
            />
            <Input ref={inputRef} placeholder="Search..." />
            <ModeToggle />
            <ToolTip icon={<Bell />} text="Notification" />
            <ToolTip icon={<Mail />} text="Inbox" />
            <UserProfile
                avatarImage="https://github.com/shadcn.png"
                fallback="yo"
            />
        </Menubar>
    );
};

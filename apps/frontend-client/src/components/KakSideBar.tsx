"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LineChart,
  PieChart,
  UserCircle,
  UserCheck,
  Calendar,
  Sheet,
  List,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useSidebarContext } from "../context/SidebarContext";

interface Route {
  label: string;
  icon: any;
  href?: string;
  color?: string;
  subRoutes?: Route[];
}

const routes: Route[] = [
  {
    label: "Dashboards",
    icon: LayoutDashboard,
    color: "text-sky-500",
    href: "/dashboard",
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    color: "text-pink-500",
    subRoutes: [
      {
        label: "Lists",
        icon: List,
        href: "dashboard/jobs",
      },
      {
        label: "View Jobs",
        icon: Sheet,
        href: "dashboard/viewJobs",
      },
      {
        label: "View Applicant",
        icon: UserCircle,
        href: "dashboard/applicant",
      },
      {
        label: "New Job",
        icon: Users,
        href: "/dashboard/posts",
      },
    ],
  },
  {
    label: "Messages",
    icon: MessageSquare,
    color: "text-emerald-500",
    href: "/dashboard/chat"
  },
  {
    label: "Calendar",
    icon: Calendar,
    color: "text-yellow-300",
    href: "/dashboard/calendar",
  },
  {
    label: "Charts",
    icon: LineChart,
    color: "text-indigo-500",
    href: "/dashboard/charts",
  },
  {
    label : "Profile",
    icon: UserCheck,
    color: "text-rose-500",
    href: "/dashboard/profile",
  }
];

function SidebarItem({ route, isOpen, level = 0 }: { route: Route; isOpen: boolean; level?: number }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0;

  const handleClick = () => {
    if (hasSubRoutes) {
      setIsExpanded(!isExpanded);
    }
  };

  // Normalize href to ensure it starts with a slash
  const normalizeHref = (href?: string) => href && !href.startsWith('/') ? `/${href}` : href;

  // Check if the route is active
  const isRouteActive = pathname === normalizeHref(route.href);

  // Render logic for routes with subroutes
  if (hasSubRoutes) {
    return (
      <div>
        <div
          onClick={handleClick}
          className={cn(
            "flex p-4  w-full justify-start font-medium text-pretty cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
            isRouteActive ? "text-white bg-[#FF7300]" : "text-muted-foreground",
            !isOpen && "justify-center",
            level > 0 && "ml-4"
          )}
          title={!isOpen ? route.label : undefined}
        >
          <div className={cn(
            "flex items-center flex-1",
            !isOpen && "justify-center"
          )}>
            <route.icon className={cn(
              "h-6 w-6", 
              route.color, 
              isRouteActive && "text-white", 
              isOpen && "mr-3"
            )} />
            {isOpen && (
              <>
                <span className="flex-1">{route.label}</span>
                {hasSubRoutes && (
                  <ChevronDown
                    className={cn(
                      "h-6 w-6 transition-transform",
                      isExpanded && "transform rotate-180"
                    )}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {isOpen && hasSubRoutes && isExpanded && (
          <div className="mt-1">
            {route.subRoutes?.map((subRoute) => (
              <Link
                key={subRoute.href}
                href={normalizeHref(subRoute.href) || "#"}
                className={cn(
                  "flex p-3 pl-12 w-full justify-start items-center text-sm font-medium cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
                  pathname === normalizeHref(subRoute.href)
                    ? "text-white bg-[#FF7300]"
                    : "text-muted-foreground"
                )}
              >
                <subRoute.icon className="h-6 w-6 mr-3" />
                {subRoute.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render logic for routes without subroutes
  if (route.href && isOpen) {
    return (
      <Link
        href={normalizeHref(route.href) ||"/dashboard"}
        className={cn(
          "flex p-4 w-full justify-start items-center font-medium text-pretty cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
          isRouteActive
            ? "text-white bg-[#FF7300]"
            : "text-muted-foreground"
        )}
      >
        <route.icon className={cn(
          "h-6 w-6 mr-3", 
          route.color, 
          isRouteActive && "text-white"
        )} />
        {route.label}
      </Link>
    );
  }

  // Fallback rendering for routes without href when sidebar is closed
  return (
    <div
      className={cn(
        "flex p-4 w-full justify-start items-center font-light cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
        !isOpen && "justify-center"
      )}
      title={route.label}
    >
      <route.icon className={cn(
        "h-6 w-6", 
        route.color, 
        isRouteActive && "text-white"
      )} />
    </div>
  );
}

export default function KakSideBar() {
  const { isOpen } = useSidebarContext();
  return (
    <ScrollArea className={cn("pt-16 h-screen transition-all duration-300" , isOpen ? "w-80" : "w-28" )}>
      <div
        className={cn(
          "space-y-4 flex flex-col h-full dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 border-r",
          isOpen ? "w-full" : "w-full items-center"
        )}
      >
        <div className="px-3 py-2 flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <SidebarItem key={route.label} route={route} isOpen={isOpen} />
            ))}
          </div>
          {/* <div className="flex items-center justify-between mb-14">
          </div> */}
        </div>
      </div>

    </ScrollArea>
  );
}
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
  Store,
  ShoppingBag,
  Inbox,
  Send,
  Archive,
  FileText,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
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
    icon: Users,
    color: "text-pink-500",
    subRoutes: [
      {
        label: "View Applicant",
        icon: UserCircle,
        href: "dashboard/jobs",
      },
      {
        label: "Lists",
        icon: UserCircle,
        href: "dashboard/jobs",
      },
      {
        label: "Leads",
        icon: Users,
        href: "/dashboard/leads",
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
    label: "Documents",
    icon: UserCheck,
    color: "text-emerald-500",
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
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
            "flex p-4  w-full justify-start font-medium text-sm cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
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
              "h-4 w-4", 
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
                      "h-4 w-4 transition-transform",
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
                <subRoute.icon className="h-4 w-4 mr-3" />
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
          "flex p-4 w-full justify-start items-center font-medium text-sm cursor-pointer hover:text-white hover:bg-orange-300 rounded-lg transition",
          isRouteActive
            ? "text-white bg-[#FF7300]"
            : "text-muted-foreground"
        )}
      >
        <route.icon className={cn(
          "h-4 w-4 mr-3", 
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
        "h-4 w-4", 
        route.color, 
        isRouteActive && "text-white"
      )} />
    </div>
  );
}

export default function KakSideBar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative pt-16">
      <div
        className={cn(
          "space-y-4 flex flex-col h-full dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 border-r",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="px-3 py-2 flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <SidebarItem key={route.label} route={route} isOpen={isOpen} />
            ))}
          </div>
          <div className="flex items-center justify-between mb-14 pl-3">
            {/* {isOpen && <h1 className="text-2xl font-bold">Dashboard</h1>} */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8"
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
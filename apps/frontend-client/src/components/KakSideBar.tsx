"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Package,
  Mail,
  CalendarDays,
  TicketIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleDot,
  LineChart,
  PieChart,
  UserCircle,
  Store,
  ShoppingBag,
  Inbox,
  Send,
  Archive,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { itemsMenu } from "@/utils/navigationItems";

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
    label: "Analytics",
    icon: BarChart3,
    color: "text-violet-500",
    subRoutes: [
      {
        label: "Reports",
        icon: LineChart,
        href: "/analytics/reports",
      },
      {
        label: "Statistics",
        icon: PieChart,
        href: "/analytics/statistics",
      },
    ],
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
        href: "/crm/leads",
      },
    ],
  },
  {
    label: "eCommerce",
    icon: ShoppingCart,
    color: "text-orange-500",
    subRoutes: [
      {
        label: "Products",
        icon: Store,
        href: "/ecommerce/products",
      },
      {
        label: "Orders",
        icon: ShoppingBag,
        href: "/ecommerce/orders",
      },
    ],
  },
  {
    label: "Messages",
    icon: MessageSquare,
    color: "text-emerald-500",
    subRoutes: [
      {
        label: "Inbox",
        icon: Inbox,
        href: "/messages/inbox",
      },
      {
        label: "Sent",
        icon: Send,
        href: "/messages/sent",
      },
      {
        label: "Archive",
        icon: Archive,
        href: "/messages/archive",
      },
    ],
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
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

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          "flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
          pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
          !isOpen && "justify-center",
          level > 0 && "ml-4"
        )}
        title={!isOpen ? route.label : undefined}
      >
        <div className={cn(
          "flex items-center flex-1",
          !isOpen && "justify-center"
        )}>
          <route.icon className={cn("h-5 w-5", route.color, isOpen && "mr-3")} />
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
              href={subRoute.href || "#"}
              className={cn(
                "flex p-3 pl-12 w-full justify-start text-sm font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === subRoute.href
                  ? "text-primary bg-primary/10"
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

export default function KakSideBar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      <div
        className={cn(
          "space-y-4 py-4 flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="px-3 py-2 flex-1">
          <div className="flex items-center justify-between mb-14 pl-3">
            {isOpen && <h1 className="text-2xl font-bold">Dashboard</h1>}
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
          <div className="space-y-1">
            {routes.map((route) => (
              <SidebarItem key={route.label} route={route} isOpen={isOpen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
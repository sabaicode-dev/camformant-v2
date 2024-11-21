import { PersonIcon } from "@radix-ui/react-icons";
import { LayoutDashboard, Sheet, LetterText, Calendar, ChartNetwork, UserPen, List, MessageSquare, Settings, Users2, User } from "lucide-react";



// All icons in sidebar
// Menu Dashboard.

const dashboard = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    }
];

// Menu jobs.
const Jobs = [
    {
        title: "Job List",
        url: "/dashboard/jobs",
        icon: Sheet,
    },
    {
        title: "Job View",
        url: "/dashboard/viewJob",
        icon: Sheet,
    },
    {
        title: "View Applicant",
        url: "/dashboard/applicant",
        icon: Sheet,
    },
    {
        title: "New Job",
        url: "/dashboard/posts",
        icon: LetterText,
    },
];

// Menu Posts

// const posts = [
//     {
//         title: "Posts",
//         url: "/dashboard/posts",
//         icon: LetterText,
//     },
//     {
//         title: "List",
//         url: "/dashboard/posts/list",
//         icon: List,
//     },
// ];

// Menu users.

const users = [
    {
        title: "Users",
        url: "/dashboard/users",
        icon: PersonIcon,
    },
    {
        title: "Profile",
        url: "/dashboard/users/profile",
        icon: UserPen,
    },
    // {
    //     title: "List",
    //     url: "/dashboard/users/list",
    //     icon: List,
    // },
];

// Menu Calendar.

const calendar = [
    {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
    },
];

// Menu Chart 

const chart = [
    {
        title: "Chart",
        url: "/dashboard/chart",
        icon: ChartNetwork,
    },
];
const profile = [
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
    },
];

// Menu Chat.

const chat = [
    {
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
    },
];

// Menu Settings.

const settings = [
    {
        title: "Account Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export const itemsMenu = [
    {
        item: dashboard,
        triggerName: "Dashboard",
        iconTrigger: LayoutDashboard,
        isCollapsibleOpen: false,
    },
    {
        item: users,
        triggerName: "Users",
        iconTrigger: Users2,
        isCollapsibleOpen: false,
    },
    {
        item: profile,
        triggerName: "Profile",
        iconTrigger: User,
        isCollapsibleOpen: false,
    },
    // {
    //     item: posts,
    //     triggerName: "Posts",
    //     iconTrigger: LetterText,
    //     isCollapsibleOpen: false,
    // },
    {
        item: Jobs,
        triggerName: "Jobs",
        iconTrigger: Sheet,
        isCollapsibleOpen: true,
    },
    {
        item: calendar,
        triggerName: "Calendar",
        iconTrigger: Calendar,
        isCollapsibleOpen: false,
    },
    {
        item: chat,
        triggerName: "Chat",
        iconTrigger: User,
        isCollapsibleOpen: false,
    },
    {
        item: chart,
        triggerName: "Chart",
        iconTrigger: ChartNetwork,
        isCollapsibleOpen: false,
    },
    {
        item: settings,
        triggerName: "Account Settings",
        iconTrigger: Settings,
        isCollapsibleOpen: false,
    },
]

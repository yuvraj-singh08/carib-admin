import {
  Settings,
  LucideIcon,
  UserRound,
  Package,
  CircleGauge,
  Clipboard,
  MessageSquare,
  ChartColumn,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname === "/",
          icon: CircleGauge,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/supplier",
          label: "Firewall Setting",
          active: pathname.includes("/supplier"),
          icon: UserRound,
          submenus: [],
        },
        {
          href: "/customer-details",
          label: "Customer details",
          active: pathname.includes("/customer-details"),
          icon: Package,
          submenus: [],
        },
        {
          href: "/manage-airlines",
          label: "Commission management",
          active: pathname.includes("/manage-airlines"),
          icon: ChartColumn,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/manage-user",
          label: "User Management",
          active: pathname.includes("/manage-user"),
          icon: Clipboard,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/tickets",
          label: "Ticket System",
          active: pathname.includes("/tickets"),
          icon: MessageSquare,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/landing-settings",
          label: "Landing Page",
          active: pathname.includes("/landing-settings"),
          icon: MessageSquare,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
    // {
    //   groupLabel: "",
    //   menus: [
    //     {
    //       href: "/",
    //       label: "Support",
    //       active: pathname.includes("/xyz"),
    //       icon: Settings,
    //       submenus: [],
    //     },
    //   ],
    // },
  ];
}

import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
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
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Flights",
          active: pathname.includes("/flights"),
          icon: SquarePen,
          submenus: [
            {
              href: "/menu1",
              label: "Sub menu",
              active: pathname === "/sub-menu",
            },
          ],
        },
        {
          href: "/bookings",
          label: "Bookings",
          active: pathname.includes("/bookings"),
          icon: Bookmark,
          submenus: [
            {
              href: "/menu1",
              label: "Sub menu",
              active: pathname === "/sub-menu",
            },
          ],
        },
        {
          href: "/payment",
          label: "Payment",
          active: pathname.includes("/payment"),
          icon: Tag,
          submenus: [
            {
              href: "/menu1",
              label: "Sub menu",
              active: pathname === "/sub-menu",
            },
          ],
        },
        {
          href: "/reports",
          label: "Reports & Analytics",
          active: pathname.includes("/reports"),
          icon: Users,
          submenus: [
            {
              href: "/menu1",
              label: "Sub menu",
              active: pathname === "/sub-menu",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/user-management",
          label: "User Management",
          active: pathname.includes("/user-management"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/Ticket",
          label: "Ticket",
          active: pathname.includes("/Ticket"),
          icon: Users,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/support",
          label: "Support",
          active: pathname.includes("/support"),
          icon: Users,
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
          icon: Users,
          submenus: [],
        },
      ],
    },
  ];
}

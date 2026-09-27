export type Pill = {
  id: string;
  label: string;
  /** When set, choosing this pill navigates here */
  to?: string;
  /** Optional sidebar icon class (PrimeIcons / Tabler) */
  icon?: string;
};

export type ModuleEntry = {
  id: string;
  title: string;
  icon: string;
  pills?: Pill[];
};

export const MODULES: ModuleEntry[] = [
  {
    id: "3be5f7a9-c1d2-43e5-9f0a-1b2c3d4e5f60",
    title: "Clinic",
    icon: "pi pi-heart",
    pills: [
      { id: "patients", label: "Patients", to: "/clinic/patients", icon: "pi pi-users" },
      { id: "doctors", label: "Doctors", to: "/clinic/doctors", icon: "pi pi-user" },
      { id: "practice", label: "Practice", to: "/clinic/practice", icon: "pi pi-building" },
    ],
  },
  {
    id: "7f3a9c2e-1b4d-4e8f-9a6c-2d5e8f1a4b7c",
    title: "Tailoring",
    icon: "pi pi-star-half",
    pills: [
      { id: "tailor-dashboard", label: "Tailor Dashboard", to: "/tailor-dashboard", icon: "pi pi-home" },
      { id: "measurements", label: "Measurements", to: "/measurements", icon: "pi pi-pencil" },
      { id: "costs", label: "Costs", to: "/costs", icon: "pi pi-wallet" },
    ],
  },
  {
    id: "a2b4c6d8-e0f1-4a2b-8c3d-4e5f6a7b8c9d",
    title: "General Store",
    icon: "pi pi-shopping-bag",
    pills: [
      { id: "company", label: "Company", to: "/dashboard", icon: "pi pi-building" },
      { id: "users", label: "Users", to: "/dashboard", icon: "pi pi-users" },
      { id: "products", label: "Products", to: "/dashboard", icon: "pi pi-box" },
      { id: "sales", label: "Sales", to: "/dashboard", icon: "pi pi-chart-line" },
      { id: "purchases", label: "Purchases", to: "/dashboard", icon: "pi pi-shopping-cart" },
      { id: "inventory", label: "Inventory", to: "/dashboard", icon: "pi pi-database" },
      { id: "reports", label: "Reports", to: "/dashboard", icon: "pi pi-file" },
      { id: "settings", label: "Settings", to: "/dashboard", icon: "pi pi-cog" },
    ],
  },
  {
    id: "admin-panel",
    title: "Admin",
    icon: "pi pi-shield",
    pills: [
      { id: "user-management", label: "User Management", to: "/admin/users", icon: "pi pi-users" },
    ],
  },
];

export const ADMIN_MODULE_ID = "admin-panel";

export const isAdminFromAuth = (user?: {
  role?: string;
  isAdmin?: string | boolean;
} | null) => {
  if (!user) return false;
  if (user.role === "Admin") return true;
  return user.isAdmin === true || user.isAdmin === "true";
};

/** Pills that have a real route (shown in sidebar). */
export const getModuleNavItems = (module: ModuleEntry | undefined): Pill[] =>
  (module?.pills ?? []).filter((pill): pill is Pill & { to: string } => Boolean(pill.to));

export const findModuleById = (moduleId: string | null | undefined) =>
  MODULES.find((m) => m.id === moduleId);

/** Match module whose navigable route is a prefix of the current path. */
export const findModuleByPath = (pathname: string) =>
  MODULES.find((m) =>
    getModuleNavItems(m).some(
      (pill) => pathname === pill.to || pathname.startsWith(`${pill.to}/`)
    )
  );

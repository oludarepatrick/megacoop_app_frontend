export type NavItem = {
  id: string;
  title: string;
  href: string;
  icon?: string;
};

export type PageHeader = {
  title: string;
  description?: string;
};

export type DashboardCharts = {
    year: number;
    data: DashboardStats[];
}

export type DashboardStats = {
  month: string;
  credit: number
  debit: number;
}

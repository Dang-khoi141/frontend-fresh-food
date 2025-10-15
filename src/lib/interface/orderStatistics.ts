export interface ChartPoint {
  date: string;
  revenue: number;
}

export interface OrderStatistics {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  chart: ChartPoint[];
  statusChart: Record<string, number>;
}

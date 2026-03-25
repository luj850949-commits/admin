import http from "@/utils/http";

export interface ChartDataItem {
  name: string;
  value: number;
  percent: string;
  bgColor: string;
  color: string;
  data: number[];
}

export interface ProgressDataItem {
  week: string;
  percentage: number;
  color: string;
}

export interface LatestNewsDataItem {
  date: string;
  requiredNumber: number;
  resolveNumber: number;
}

export interface BarChartDataItem {
  requireData: number[];
  questionData: number[];
}

export type DashboardData = {
  chartData: ChartDataItem[];
  progressData: ProgressDataItem[];
  latestNewsData: LatestNewsDataItem[];
  barChartData: BarChartDataItem[];
}

export const getDashboardData = () => {
  // 请求我们在 mock 中定义的 url
  return http.get("/dashboard/all") as Promise<DashboardData>;
};
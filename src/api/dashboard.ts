import http from "@/utils/http";

export const getDashboardData = () => {
  // 请求我们在 mock 中定义的 url
  return http.get<any>("/dashboard/all");
};
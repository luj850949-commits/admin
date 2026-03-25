import { MockMethod } from "vite-plugin-mock";

// 模拟生成过去14天的日期
const getPastDays = (days: number) => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return result;
};

export default [
  {
    url: "/api/dashboard/all", // 模拟的后端接口路径
    method: "get",
    response: () => {
      return {
        success: true,
        code: 200,
        data: {
          // 1. 顶部卡片数据
          chartData: [
            { 
              name: "需求人数", value: 36000, percent: "+88%", bgColor: "#effaff", color: "#41b6ff",
              data: [2101, 5288, 4239, 4962, 6752, 5208, 7450] // 折线图数据
            },
            { 
              name: "提问数量", value: 16580, percent: "+70%", bgColor: "#fff5f4", color: "#e85f33",
              data: [2216, 1148, 1255, 788, 4821, 1973, 4379] 
            },
            { 
              name: "解决数量", value: 16499, percent: "+99%", bgColor: "#eff8f4", color: "#26ce83",
              data: [861, 1002, 3195, 1715, 3666, 2415, 3645] 
            },
            { 
              name: "用户满意度", value: 100, percent: "+100%", bgColor: "#f6f4fe", color: "#7846e5",
              data: [100] // 只有一个数据，用来触发渲染环形图
            }
          ],
          // 2. 进度条数据
          progressData: [
            { week: "周日", percentage: 100, color: "#26ce83" },
            { week: "周六", percentage: 96, color: "#26ce83" },
            { week: "周五", percentage: 94, color: "#26ce83" },
            { week: "周四", percentage: 89, color: "#41b6ff" },
            { week: "周三", percentage: 88, color: "#41b6ff" },
            { week: "周二", percentage: 86, color: "#41b6ff" },
            { week: "周一", percentage: 85, color: "#41b6ff" }
          ],
          // 3. 最新动态时间轴数据
          latestNewsData: getPastDays(14).map(date => ({
            date: date,
            requiredNumber: Math.floor(Math.random() * 5000) + 10000,
            resolveNumber: Math.floor(Math.random() * 5000) + 10000
          })),
          // 新增：柱状图数据 (索引0代表上周，索引1代表本周)
          barChartData: [
            {
              requireData: [2101, 5288, 4239, 4962, 6752, 5208, 7450],
              questionData: [2216, 1148, 1255, 1788, 4821, 1973, 4379]
            },
            {
              requireData: [2101, 3280, 4400, 4962, 5752, 6889, 7600],
              questionData: [2116, 3148, 3255, 3788, 4821, 4970, 5390]
            }
          ]
        },
        message: "获取看板数据成功"
      };
    }
  }
] as MockMethod[];
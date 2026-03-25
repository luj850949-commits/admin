<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getDashboardData, type ChartDataItem, type ProgressDataItem, type LatestNewsDataItem, type BarChartDataItem } from "@/api/dashboard";

import ChartBar from "./components/charts/ChartBar.vue";

defineOptions({
  name: "Home"
});

const curWeek = ref(1); 

const chartData = ref<ChartDataItem[]>([]);
const progressData = ref<ProgressDataItem[]>([]);
const latestNewsData = ref<LatestNewsDataItem[]>([]);
const barChartData = ref<BarChartDataItem[]>([
  { requireData: [], questionData: [] },
  { requireData: [], questionData: [] } // 给个默认空骨架防止初次渲染报错
]);

// 获取数据
const fetchData = async () => {
  try {
    const res = await getDashboardData();
    chartData.value = res.chartData;
    progressData.value = res.progressData;
    latestNewsData.value = res.latestNewsData;
    barChartData.value = res.barChartData;
  } catch (error) {
    console.error("获取看板数据失败:", error);
  }
};

// 组件挂载后发起请求
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="welcome-container">
    <el-row :gutter="24" justify="space-around">
      
      <el-col
        v-for="(item, index) in chartData"
        :key="index"
        :xs="24" :sm="12" :md="12" :lg="6"
        class="mb-4"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 80 * (index + 1) } }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">{{ item.name }}</span>
          </div>
          <div class="mt-3">
            <span style="font-size: 1.6em; font-weight: bold;">{{ item.value }}</span>
            <p style="color: #67c23a; font-weight: 500;">{{ item.percent }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col 
        :xs="24" :lg="18" class="mb-4"
        v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-4">
            <span class="text-md font-medium">分析概览</span>
            <el-radio-group v-model="curWeek" size="small">
              <el-radio-button :label="0">上周</el-radio-button>
              <el-radio-button :label="1">本周</el-radio-button>
            </el-radio-group>
          </div>
          <div class="mt-3">
            <ChartBar
              v-if="barChartData.length > 0"
              :requireData="barChartData[curWeek]!.requireData"
              :questionData="barChartData[curWeek]!.questionData"
            />
          </div>
        </el-card>
      </el-col>

      <el-col 
        :xs="24" :lg="6" class="mb-4"
        v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, transition: { delay: 480 } }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-4">
            <span class="text-md font-medium">解决概率</span>
          </div>
          <div
            v-for="(item, index) in progressData"
            :key="index"
            class="progress-item"
          >
            <el-progress
              :text-inside="true"
              :percentage="item.percentage"
              :stroke-width="21"
              :color="item.color"
              striped
              striped-flow
              :duration="100"
            />
            <span class="week-text">{{ item.week }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col 
        :xs="24" :lg="6" class="mb-4"
        v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, transition: { delay: 640 } }"
      >
        <el-card shadow="never">
          <div class="flex justify-between mb-4">
            <span class="text-md font-medium">最新动态</span>
          </div>
          <el-scrollbar max-height="400">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in latestNewsData"
                :key="index"
                center
                placement="top"
                :timestamp="item.date"
              >
                <p style="color: #909399; font-size: 14px;">
                  新增 {{ item.requiredNumber }} 条问题，{{ item.resolveNumber }} 条已解决
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<style scoped>
.welcome-container {
  padding: 20px;
}

.flex { display: flex; }
.justify-between { justify-content: space-between; }
.mb-4 { margin-bottom: 1rem; }
.mt-3 { margin-top: 0.75rem; }

/* 调整进度条排版 */
.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

:deep(.el-progress--line) {
  width: 85%;
}

.week-text {
  white-space: nowrap;
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
}

/* 隐藏滚动条 */
:deep(.el-scrollbar__bar) {
  display: none;
}
</style>
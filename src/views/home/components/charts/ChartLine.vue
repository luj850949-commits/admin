<template>
  <div ref="chartRef" style="width: 100%; height: 60px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  color: string;
  data: number[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const setOptions = () => {
  if (!chartInstance) return;
  chartInstance.setOption({
    grid: { top: 0, bottom: 0, left: 0, right: 0 }, // 撑满容器
    xAxis: {
      type: "category",
      show: false, // 隐藏X轴
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      show: false // 隐藏Y轴
    },
    series: [
      {
        type: "line",
        data: props.data,
        smooth: true, // 平滑曲线
        symbol: "none", // 隐藏拐点圆圈
        lineStyle: {
          width: 2,
          color: props.color
        },
        areaStyle: {
          // 渐变色填充
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: props.color + "80" }, // 80代表透明度
            { offset: 1, color: "transparent" }
          ])
        }
      }
    ]
  });
};

watch(() => props.data, () => setOptions(), { deep: true });

const resizeHandler = () => chartInstance?.resize();

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    setOptions();
    window.addEventListener("resize", resizeHandler);
  }
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
  window.removeEventListener("resize", resizeHandler);
});
</script>
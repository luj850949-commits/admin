<template>
  <div ref="chartRef" style="width: 100%; height: 350px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";

// 定义接收的属性：需求数据和提问数据
const props = defineProps<{
  requireData: number[];
  questionData: number[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 配置和渲染图表的方法
const setOptions = () => {
  if (!chartInstance) return;
  chartInstance.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" }
    },
    legend: {
      data: ["需求人数", "提问数量"],
      bottom: 0 // 图例放在最下方
    },
    grid: {
      top: "10%", left: "2%", right: "2%", bottom: "10%", containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisTick: { show: false } // 隐藏刻度线让UI更干净
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "需求人数",
        type: "bar",
        barWidth: 15, // 柱子宽度
        itemStyle: {
          color: "#41b6ff",
          borderRadius: [4, 4, 0, 0] // 顶部圆角
        },
        data: props.requireData
      },
      {
        name: "提问数量",
        type: "bar",
        barWidth: 15,
        itemStyle: {
          color: "#e85f33",
          borderRadius: [4, 4, 0, 0]
        },
        data: props.questionData
      }
    ]
  });
};

// 1. 监听父组件传来的数据变化，数据变了就重新配置图表
watch(
  () => [props.requireData, props.questionData],
  () => {
    setOptions();
  },
  { deep: true }
);

// 2. 窗口缩放自适应逻辑
const resizeHandler = () => {
  chartInstance?.resize();
};

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
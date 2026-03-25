<template>
  <div ref="chartRef" style="width: 100%; height: 60px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption({
      title: {
        text: '100%',
        left: 'center',
        top: 'center',
        textStyle: {
          color: "#7846e5", // 保持和圆环一样的紫色
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'bold'
        }
      },
      series: [
        {
          type: "pie",
          radius: ["78%", "90%"], // 内外半径，形成环形
          avoidLabelOverlap: false,
          itemStyle: {
            color: "#7846e5" // 满意度的紫色
          },
          label: { show: false },
          data: [{ value: 100 }] // 固定 100%
        }
      ]
    });
    window.addEventListener("resize", () => chartInstance?.resize());
  }
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
});
</script>
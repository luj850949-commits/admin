<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'

defineOptions({
  name: "Success"
});

const columns = [
  {
    label: "项目 ID：",
    value: "12345"
  },
  {
    label: "负责人：",
    value: "明明"
  },
  {
    label: "生效时间：",
    value: "2026-03-25 18:37:42"
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">成功页</span>
      </div>
    </template>
    <el-result
      icon="success"
      title="提交成功"
      sub-title="操作执行完毕，详情与后续指引请参考下方说明。"
    >
      <template #extra>
        <div class="flex">
          <el-button type="primary">返回列表</el-button>
          <el-button>查看项目</el-button>
          <el-button>打印</el-button>
        </div>
      </template>
    </el-result>
    <div class="p-6 w-[90%] m-auto bg-[#fafafa] dark:bg-[#1d1d1d]">
      <PureDescriptions title="项目名称" :columns="columns" class="mb-5" />
      <el-steps :active="2">
        <el-step title="创建项目">
          <template #description>
            <p>明明</p>
            <p>2026-03-25 18:37:42</p>
          </template>
        </el-step>
        <el-step title="部门初审">
          <template #description>
            <p class="flex items-center">
              亮亮
              <span
                role="img"
                aria-label="dingding"
                class="anticon anticon-dingding flex items-center cursor-pointer"
                style="margin-left: 8px; color: rgb(0 160 233)"
              >
                <el-icon><Promotion /></el-icon>
                催一下
              </span>
            </p>
          </template>
        </el-step>
        <el-step title="财务复核" />
        <el-step title="完成" />
      </el-steps>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.el-descriptions__body) {
  background: transparent;
}
</style>

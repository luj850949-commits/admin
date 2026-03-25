<script setup lang="ts">
import { CircleClose, ArrowRight } from '@element-plus/icons-vue'
defineOptions({
  name: "Fail"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">失败页</span>
      </div>
    </template>
    <el-result
      icon="error"
      title="提交失败"
      sub-title="请核对并修改以下信息后，再重新提交。"
    >
      <template #extra>
        <el-button type="primary">返回修改</el-button>
      </template>
    </el-result>
    <div class="p-6 w-[90%] m-auto bg-[#fafafa] dark:bg-[#1d1d1d]">
      <div class="w-full ml-2 text-lg">您提交的内容有如下错误：</div>
      <br>
      <div class="flex items-center">
        <el-icon><CircleClose /></el-icon>
        <span class="ml-1 mr-4">您的账户已被冻结</span>
        <a
          href="javascript:void(0);"
          class="flex items-center"
          style="color: var(--el-color-primary)"
        >
          立即解冻
          <el-icon><ArrowRight /></el-icon>
        </a>
      </div>
      <br />
      <div class="flex items-center">
        <el-icon><CircleClose /></el-icon>
        <span class="ml-1 mr-4">您的账户还不具备申请资格</span>
        <a
          href="javascript:void(0);"
          class="flex items-center"
          style="color: var(--el-color-primary)"
        >
          立即升级
          <el-icon><ArrowRight /></el-icon>
        </a>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.el-descriptions__body) {
  background: transparent;
}
</style>

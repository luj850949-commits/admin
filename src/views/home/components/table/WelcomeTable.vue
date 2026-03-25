<script setup lang="ts">
// 接收父组件传来的表格数据
defineProps<{
  data: any[];
}>();
</script>

<template>
  <el-table 
    :data="data" 
    height="360" 
    style="width: 100%" 
    stripe 
    :header-cell-style="{ background: 'var(--bg-color)', color: 'var(--text-color)' }"
  >
    <el-table-column prop="id" label="序号" width="70" align="center" />
    <el-table-column prop="date" label="日期" min-width="120" />
    <el-table-column prop="requiredNumber" label="新增需求" min-width="120" sortable />
    <el-table-column prop="questionNumber" label="提问数量" min-width="120" sortable />
    <el-table-column prop="resolveNumber" label="解决数量" min-width="120" sortable />
    
    <el-table-column label="用户满意度" min-width="160">
      <template #default="scope">
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 10px; min-width: 35px;">{{ scope.row.satisfaction }}%</span>
          <el-progress 
            :percentage="scope.row.satisfaction" 
            :show-text="false" 
            :color="scope.row.satisfaction === 100 ? '#26ce83' : '#41b6ff'"
            style="flex: 1;"
          />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
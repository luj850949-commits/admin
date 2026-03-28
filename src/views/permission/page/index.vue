<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-bold text-lg">页面级权限测试</div>
      </template>

      <div class="mb-6 text-gray-600">
        当前角色：<el-tag type="success" class="mr-4">{{ currentRole }}</el-tag>
        <span class="text-sm">(观察左侧边栏的“系统管理”菜单)</span>
      </div>

      <el-select style="width: 15vw;" v-model="currentRole" @change="handleRoleChange">
        <el-option label="切换为 管理员 (显示系统管理)" value="admin" />
        <el-option label="切换为 普通干员 (隐藏系统管理)" value="common" />
      </el-select>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/modules/user';
import { usePermissionStore } from '@/stores/modules/permission';

const userStore = useUserStore();
const permissionStore = usePermissionStore();

// 初始化当前选中的角色
const currentRole = ref(userStore.roles[0] || 'common');

// 切换角色时的处理逻辑
const handleRoleChange = (val: string) => {
  // 1. 更新 Pinia 中保存的当前角色
  userStore.setRoles([val]);

  // 2. 清空权限 Store 中已生成的菜单树 (这是触发路由守卫重新计算的关键)
  permissionStore.clearMenus();

  // 3. 刷新浏览器重新走一遍完整的 Vue Router 初始化流程
  window.location.reload();
};
</script>
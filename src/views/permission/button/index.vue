<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-bold text-lg">按钮级别权限测试</div>
      </template>
      
      <div class="mb-6 text-gray-600">
        当前拥有的按钮权限：
        <el-tag v-for="p in currentPermissions" :key="p" type="success" class="mr-2">{{ p }}</el-tag>
      </div>

      <div class="mb-6">
        <el-select style="width: 15vw;" v-model="mockType" @change="handlePermChange">
          <el-option label="模拟 Admin (拥有增删改查)" value="admin" />
          <el-option label="模拟 Editor (拥有增改查，无删除)" value="editor" />
          <el-option label="模拟 Viewer (只有查看权限)" value="viewer" />
        </el-select>
      </div>

      <el-divider />

      <div>
        <h3 class="mb-4 font-bold">操作按钮区：</h3>
        <el-button v-auth="['btn:view']" type="info" plain>查看数据 (btn:view)</el-button>
        <el-button v-auth="['btn:add']" type="primary">新增数据 (btn:add)</el-button>
        <el-button v-auth="['btn:edit']" type="warning">编辑数据 (btn:edit)</el-button>
        <el-button v-auth="['btn:delete']" type="danger">删除数据 (btn:delete)</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();

const mockType = ref('admin');
const currentPermissions = ref<string[]>([]);

// 模拟后端返回的不同角色的按钮权限数据
const permsMap = {
  admin: ['btn:view', 'btn:add', 'btn:edit', 'btn:delete'],
  editor: ['btn:view', 'btn:add', 'btn:edit'],
  viewer: ['btn:view']
};

onBeforeMount(() => {
  // 进来时如果没有权限，先给个默认值
  if (userStore.permissions.length === 0) {
    userStore.setPermissions( userStore.roles[0] === 'admin' ? permsMap.admin : (userStore.roles[0] === 'common' ? permsMap.editor : permsMap.viewer) );
  }
  currentPermissions.value = userStore.permissions;
  
  // 根据当前权限长度反推该高亮哪个单选按钮
  if (currentPermissions.value.length === 4) mockType.value = 'admin';
  else if (currentPermissions.value.length === 3) mockType.value = 'editor';
  else mockType.value = 'viewer';
})

// 切换按钮权限时的处理逻辑
const handlePermChange = (val: string) => {
  const perms = permsMap[val as keyof typeof permsMap];
  // 存入 Pinia
  userStore.setPermissions(perms);
  
  // 刷新页面以重新触发 DOM 的挂载和指令拦截
  // 由于 v-auth 是在 DOM mounted 时执行移除操作，如果动态改变权限，
  // 被拔掉的 DOM 元素不会自动长回来。在真实业务中，权限通常是登录时一次性获取的。
  // 为了演示动态切换，这里采用刷新页面的方式。
  window.location.reload();
};
</script>
<template>
  <div class="h-full p-4 flex flex-col bg-[#f0f2f5] dark:bg-gray-950">
    <div class="flex-1 bg-white dark:bg-[#141414] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
      
      <el-form :inline="true" :model="searchForm" class="mb-2">
        <el-form-item label="菜单名称">
          <el-input style="width: 10vw;" v-model="searchForm.title" placeholder="请输入菜单名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="mb-4">
        <el-button v-auth="['btn:add']" type="primary" :icon="Plus" @click="handleAdd()">新增菜单</el-button>
        <el-button :icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </div>

      <el-table 
        v-if="refreshTable"
        :data="tableData" 
        row-key="id"
        :default-expand-all="isExpandAll"
        border 
        class="w-full flex-1"
      >
        <el-table-column prop="title" label="菜单名称" min-width="180" align="left" header-align="center" />
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon" :size="18">
              <component :is="Icons[row.icon as keyof typeof Icons]" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 0" type="primary">目录</el-tag>
            <el-tag v-else-if="row.type === 1" type="success">菜单</el-tag>
            <el-tag v-else-if="row.type === 2" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="auths" label="权限标识" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.auths" type="warning" plain>{{ row.auths }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" width="80" align="center" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.type !== 2" type="success" link :icon="Plus" @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="650px" append-to-body destroy-on-close @close="resetForm">
      <el-form ref="formRef" :model="menuForm" :rules="formRules" label-width="100px" v-loading="formLoading">
        
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="treeSelectData"
            placeholder="请选择上级菜单"
            check-strictly
            :render-after-expand="false"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type" @change="handleTypeChange">
            <el-radio-button :label="0">目录</el-radio-button>
            <el-radio-button :label="1">菜单</el-radio-button>
            <el-radio-button :label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>

        <template v-if="menuForm.type === 0 || menuForm.type === 1">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="menuForm.icon" placeholder="请输入 Element Plus 图标名 (例如: User)" />
          </el-form-item>
          <el-form-item label="路由路径" prop="path">
            <el-input v-model="menuForm.path" placeholder="请输入路由路径 (例如: /system/user)" />
          </el-form-item>
        </template>

        <template v-if="menuForm.type === 1">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="menuForm.component" placeholder="请输入组件路径 (例如: @/views/system/user/index.vue)" />
          </el-form-item>
        </template>

        <template v-if="menuForm.type === 2">
          <el-form-item label="权限标识" prop="auths">
            <el-input v-model="menuForm.auths" placeholder="请输入权限标识 (例如: btn:add)" />
          </el-form-item>
        </template>

        <el-form-item label="排序" prop="rank">
          <el-input-number v-model="menuForm.rank" :min="1" :max="99" controls-position="right" />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { Search, Plus, Sort, Delete, Edit, Refresh } from '@element-plus/icons-vue';
import * as Icons from '@element-plus/icons-vue'; 

// 数据源与搜索
const searchForm = reactive({ title: '' });
const tableData = ref<any[]>([]); 
const isExpandAll = ref(false);
const refreshTable = ref(true); // 用于触发展开/折叠重绘

// 模拟数据库中的完整菜单树数据
const rawMenuData = [
  {
    id: 1, parentId: 0, title: '系统管理', type: 0, icon: 'Setting', path: '/system', rank: 10,
    children: [
      { 
        id: 11, parentId: 1, title: '用户管理', type: 1, icon: 'User', path: '/system/user', component: '@/views/system/user/index.vue', rank: 1,
        children: [
          { id: 111, parentId: 11, title: '新增用户', type: 2, auths: 'btn:add', rank: 1 },
          { id: 112, parentId: 11, title: '修改用户', type: 2, auths: 'btn:edit', rank: 2 },
          { id: 113, parentId: 11, title: '删除用户', type: 2, auths: 'btn:delete', rank: 3 }
        ]
      },
      { 
        id: 12, parentId: 1, title: '角色管理', type: 1, icon: 'UserFilled', path: '/system/role', component: '@/views/system/role/index.vue', rank: 2,
        children: [
          { id: 121, parentId: 12, title: '分配权限', type: 2, auths: 'btn:assign', rank: 1 }
        ]
      },
      { 
        id: 13, parentId: 1, title: '菜单管理', type: 1, icon: 'Menu', path: '/system/menu', component: '@/views/system/menu/index.vue', rank: 3
      }
    ]
  },
  {
    id: 2, parentId: 0, title: '权限管理', type: 0, icon: 'Key', path: '/permission', rank: 20,
    children: [
      { id: 21, parentId: 2, title: '页面权限', type: 1, path: '/permission/page', component: '@/views/permission/page/index.vue', rank: 1 },
      { id: 22, parentId: 2, title: '按钮权限', type: 1, path: '/permission/button', component: '@/views/permission/button/index.vue', rank: 2 }
    ]
  }
];

// 用于下拉树选择（增加一个虚拟的“顶级节点”）
const treeSelectData = ref<any[]>([
  { id: 0, title: '顶级目录', children: rawMenuData }
]);

/** 树形结构过滤（简易版递归搜索） */
const filterTree = (nodes: any[], keyword: string): any[] => {
  return nodes.filter(node => {
    const match = node.title.includes(keyword);
    if (node.children && node.children.length > 0) {
      // 递归过滤子节点
      const filteredChildren = filterTree(node.children, keyword);
      // 如果子节点有匹配的，父节点也要保留
      if (filteredChildren.length > 0) {
        node.children = filteredChildren;
        return true; 
      }
    }
    return match;
  }).map(node => ({ ...node })); // 深拷贝避免污染原数据
};

const handleSearch = () => {
  if (!searchForm.title) {
    tableData.value = JSON.parse(JSON.stringify(rawMenuData));
  } else {
    // 每次搜索前必须从深拷贝的原始数据中去过滤
    const rawCopy = JSON.parse(JSON.stringify(rawMenuData));
    tableData.value = filterTree(rawCopy, searchForm.title);
  }
};

const resetSearch = () => {
  searchForm.title = '';
  handleSearch();
};

// 展开/折叠重绘 Hack 手段
const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => { refreshTable.value = true; });
};

// ==================== 2. 弹窗表单交互 ====================
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('新增菜单');
const formLoading = ref(false);

const menuForm = reactive({
  id: undefined,
  parentId: 0,
  type: 0, // 0:目录 1:菜单 2:按钮
  title: '',
  icon: '',
  path: '',
  component: '',
  auths: '',
  rank: 1
});

const formRules = reactive({
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  auths: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
});

// 重置表单
const resetForm = () => {
  if (formRef.value) formRef.value.resetFields();
  menuForm.id = undefined;
};

// 切换菜单类型时，清理掉不需要的字段残留数据
const handleTypeChange = () => {
  menuForm.icon = ''; menuForm.path = ''; menuForm.component = ''; menuForm.auths = '';
  formRef.value?.clearValidate(); // 清除红字报错
};

// 点击【新增】：如果有 row 传进来，说明是在某级目录下新增子菜单
const handleAdd = (row?: any) => {
  dialogTitle.value = '新增菜单';
  dialogVisible.value = true;
  nextTick(() => {
    resetForm();
    if (row) {
      menuForm.parentId = row.id;
      // 智能判断：在目录下新增默认是菜单，在菜单下新增默认是按钮
      menuForm.type = row.type === 0 ? 1 : 2; 
    } else {
      menuForm.parentId = 0;
      menuForm.type = 0;
    }
  });
};

// 点击【修改】
const handleEdit = (row: any) => {
  dialogTitle.value = '修改菜单';
  dialogVisible.value = true;
  nextTick(() => {
    resetForm();
    Object.assign(menuForm, row); // 数据回显
  });
};

// 提交表单
const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      formLoading.value = true;
      setTimeout(() => {
        formLoading.value = false;
        dialogVisible.value = false;
        ElMessage.success(`${menuForm.id ? '修改' : '新增'}成功 (请查看 Console)`);
        console.log('提交的菜单配置 ->', JSON.parse(JSON.stringify(menuForm)));
      }, 600);
    }
  });
};

// 删除
const handleDelete = (row: any) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该菜单下包含子菜单，请先删除子节点！');
    return;
  }
  ElMessageBox.confirm(`确认要删除 "${row.title}" 吗？`, '警告', { type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {});
};

onMounted(() => {
  handleSearch();
  // 注入 TreeSelect 所需的 label 属性，因为原数据只有 title
  const injectLabel = (nodes: any[]) => {
    nodes.forEach(node => { node.value = node.id; node.label = node.title; if(node.children) injectLabel(node.children); });
  };
  injectLabel(treeSelectData.value);
});
</script>
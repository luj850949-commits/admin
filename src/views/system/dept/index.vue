<template>
  <div class="h-full p-4 flex flex-col bg-[#f0f2f5] dark:bg-gray-950">
    <div class="flex-1 bg-white dark:bg-[#141414] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
      
      <el-form :inline="true" :model="searchForm" class="mb-2">
        <el-form-item label="部门名称">
          <el-input style="width: 10vw;" v-model="searchForm.deptName" placeholder="请输入部门名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width: 7vw;" v-model="searchForm.status" placeholder="部门状态" clearable class="w-[150px]">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="mb-4">
        <el-button v-auth="['btn:add']" type="primary" :icon="Plus" @click="handleAdd()">新增部门</el-button>
        <el-button :icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </div>

      <el-table 
        v-if="refreshTable"
        :data="tableData" 
        row-key="id"
        :default-expand-all="isExpandAll"
        border 
        stripe
        class="w-full flex-1"
      >
        <el-table-column prop="deptName" label="部门名称" min-width="200" align="left" header-align="center" />
        <el-table-column prop="rank" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.status" 
              :active-value="1" 
              :inactive-value="0" 
              :disabled="row.id === 1"
              @change="handleStatusChange(row)" 
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" />
        <el-table-column prop="remark" label="备注" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-auth="['btn:add']" type="success" link :icon="Plus" @click="handleAdd(row)">新增</el-button>
            <el-button v-auth="['btn:edit']" type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button v-auth="['btn:delete']" type="danger" link :icon="Delete" :disabled="row.id === 1" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body destroy-on-close @close="resetForm">
      <el-form ref="formRef" :model="deptForm" :rules="formRules" label-width="100px" v-loading="formLoading">
        
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="deptForm.parentId"
            :data="treeSelectData"
            placeholder="请选择上级部门"
            check-strictly
            :render-after-expand="false"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="显示排序" prop="rank">
          <el-input-number v-model="deptForm.rank" :min="0" :max="999" controls-position="right" />
        </el-form-item>

        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="deptForm.status">
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="0">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="deptForm.remark" type="textarea" placeholder="请输入备注" :rows="3" />
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

// 数据源与搜索
const searchForm = reactive({ deptName: '', status: '' as unknown as string });
const tableData = ref<any[]>([]); 
const isExpandAll = ref(true); // 部门默认展开
const refreshTable = ref(true); 

// 模拟数据库中的部门树数据
const rawDeptData = [
  {
    id: 1, parentId: 0, deptName: '某某科技总公司', rank: 0, status: 1, createTime: '2023-01-01 10:00:00', remark: '集团总部',
    children: [
      { 
        id: 101, parentId: 1, deptName: '深圳总公司', rank: 1, status: 1, createTime: '2023-02-01 10:00:00', remark: '华南大区',
        children: [
          { id: 1011, parentId: 101, deptName: '研发部门', rank: 1, status: 1, createTime: '2023-02-15 10:00:00', remark: '核心技术线' },
          { id: 1012, parentId: 101, deptName: '市场部门', rank: 2, status: 1, createTime: '2023-02-16 10:00:00', remark: '' }
        ]
      },
      { 
        id: 102, parentId: 1, deptName: '郑州分公司', rank: 2, status: 0, createTime: '2023-03-01 10:00:00', remark: '华中大区 (筹备中)',
        children: [
          { id: 1021, parentId: 102, deptName: '测试部门', rank: 1, status: 1, createTime: '2023-03-05 10:00:00', remark: '' },
          { id: 1022, parentId: 102, deptName: '财务部门', rank: 2, status: 1, createTime: '2023-03-06 10:00:00', remark: '' }
        ]
      }
    ]
  }
];

// 用于下拉树选择 (加一个顶级节点)
const treeSelectData = ref<any[]>([
  { id: 0, deptName: '顶级部门', children: rawDeptData }
]);

/** 树形结构过滤递归函数 */
const filterTree = (nodes: any[], nameKey: string, statusKey: string | number): any[] => {
  return nodes.filter(node => {
    // 匹配部门名称
    const matchName = node.deptName.includes(nameKey);
    // 匹配状态 (如果状态条件为空则不限制)
    const matchStatus = statusKey === '' ? true : node.status === statusKey;
    
    const match = matchName && matchStatus;

    if (node.children && node.children.length > 0) {
      const filteredChildren = filterTree(node.children, nameKey, statusKey);
      if (filteredChildren.length > 0) {
        node.children = filteredChildren;
        return true; 
      }
    }
    return match;
  }).map(node => ({ ...node })); 
};

const handleSearch = () => {
  if (!searchForm.deptName && searchForm.status === '') {
    tableData.value = JSON.parse(JSON.stringify(rawDeptData));
  } else {
    const rawCopy = JSON.parse(JSON.stringify(rawDeptData));
    tableData.value = filterTree(rawCopy, searchForm.deptName, searchForm.status);
  }
};

const resetSearch = () => {
  searchForm.deptName = '';
  searchForm.status = '' as unknown as string;
  handleSearch();
};

const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => { refreshTable.value = true; });
};

// 弹窗表单交互
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('新增部门');
const formLoading = ref(false);

const deptForm = reactive({
  id: undefined,
  parentId: 0,
  deptName: '',
  rank: 0,
  status: 1,
  remark: ''
});

const formRules = reactive({
  parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
});

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields();
  deptForm.id = undefined;
};

// 点击【新增】
const handleAdd = (row?: any) => {
  dialogTitle.value = '新增部门';
  dialogVisible.value = true;
  nextTick(() => {
    resetForm();
    // 如果传了 row，说明是在该部门下新建子部门
    if (row) {
      deptForm.parentId = row.id;
    } else {
      deptForm.parentId = 0;
    }
  });
};

// 点击【修改】
const handleEdit = (row: any) => {
  dialogTitle.value = '修改部门';
  dialogVisible.value = true;
  nextTick(() => {
    resetForm();
    Object.assign(deptForm, row);
  });
};

// 状态切换拦截
const handleStatusChange = (row: any) => {
  const text = row.status === 1 ? '启用' : '停用';
  ElMessageBox.confirm(`确认要"${text}"部门 "${row.deptName}" 吗？如果停用，其下属部门及员工将受到影响。`, '提示', { type: 'warning' })
    .then(() => ElMessage.success(`${text}成功`))
    .catch(() => row.status = row.status === 1 ? 0 : 1);
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
        ElMessage.success(`${deptForm.id ? '修改' : '新增'}成功`);
        console.log('提交的部门数据 ->', JSON.parse(JSON.stringify(deptForm)));
      }, 600);
    }
  });
};

// 删除拦截逻辑 (不能删顶层，不能删包含子部门的)
const handleDelete = (row: any) => {
  if (row.id === 1) {
    ElMessage.error('禁止删除总公司节点！');
    return;
  }
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该部门下包含子部门，请先删除子节点！');
    return;
  }
  ElMessageBox.confirm(`确认要删除部门 "${row.deptName}" 吗？`, '警告', { type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {});
};

onMounted(() => {
  handleSearch();
  const injectLabel = (nodes: any[]) => {
    nodes.forEach(node => { node.value = node.id; node.label = node.deptName; if(node.children) injectLabel(node.children); });
  };
  injectLabel(treeSelectData.value);
});
</script>

<style scoped>
/* 保证树形下拉框的宽度填满表单项 */
.w-full { width: 100%; }
</style>
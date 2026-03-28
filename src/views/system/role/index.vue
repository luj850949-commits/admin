<template>
  <div class="h-full p-4 flex flex-col bg-[#f0f2f5] dark:bg-gray-950">
    <div class="flex-1 bg-white dark:bg-[#141414] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
      
      <el-form :inline="true" :model="searchForm" class="mb-2">
        <el-form-item label="角色名称">
          <el-input style="width: 10vw;" v-model="searchForm.roleName" placeholder="请输入角色名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input style="width: 10vw;" v-model="searchForm.roleCode" placeholder="请输入角色标识" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="mb-4">
        <el-button v-auth="['btn:add']" type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
        <el-button v-auth="['btn:delete']" type="danger" :icon="Delete" plain :disabled="selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
      </div>

      <el-table 
        :data="tableData" 
        border 
        stripe 
        class="w-full flex-1"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="编号" width="80" align="center" />
        <el-table-column prop="roleName" label="角色名称" width="150" align="center" />
        <el-table-column prop="roleCode" label="角色标识" width="150" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ row.roleCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="success" link :icon="Setting" @click="handleAssignPerms(row)">分配权限</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)" :disabled="row.roleCode === 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[5, 10, 20]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" append-to-body destroy-on-close @close="resetForm">
      <el-form ref="formRef" :model="roleForm" :rules="formRules" label-width="100px" v-loading="formLoading">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色标识 (如: admin)" :disabled="roleForm.id === 1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="permsDialogVisible" title="分配权限" width="500px" append-to-body destroy-on-close>
      <div v-loading="permsLoading" class="min-h-[200px]">
        <div class="mb-4 text-gray-600 text-sm">
          正在为 <el-tag type="info">{{ currentAssignRole?.roleName }}</el-tag> 分配权限
        </div>
        <div class="border border-gray-200 dark:border-gray-700 rounded-md p-2 h-[300px] overflow-y-auto">
          <el-tree
            ref="treeRef"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            :default-expand-all="false"
            :props="{ label: 'title', children: 'children' }"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="permsDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="permsLoading" @click="handleSavePerms">保存</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type TreeInstance } from 'element-plus';
import { Search, Plus, Delete, Edit, Refresh, Setting } from '@element-plus/icons-vue';

const searchForm = reactive({ roleName: '', roleCode: '' });
const selectedIds = ref<number[]>([]);
const tableData = ref<any[]>([]); 
const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 });

const rawTableData = [
  { id: 1, roleName: '超级管理员', roleCode: 'admin', remark: '拥有系统全部权限', status: 1, createTime: '2023-10-01 12:00:00' },
  { id: 2, roleName: '普通干员', roleCode: 'common', remark: '只拥有基础查看权限', status: 1, createTime: '2023-10-02 14:30:00' },
  { id: 3, roleName: '财务专员', roleCode: 'finance', remark: '财务报表相关权限', status: 1, createTime: '2023-10-03 09:00:00' },
  { id: 4, roleName: '内容编辑', roleCode: 'editor', remark: '文章发布与编辑', status: 0, createTime: '2023-10-04 10:15:00' },
];

const handleSearch = () => {
  const filteredData = rawTableData.filter(item => {
    const matchName = item.roleName.includes(searchForm.roleName);
    const matchCode = item.roleCode.includes(searchForm.roleCode);
    return matchName && matchCode;
  });
  pagination.total = filteredData.length;
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  tableData.value = filteredData.slice(startIndex, startIndex + pagination.pageSize);
};

const resetSearch = () => {
  searchForm.roleName = ''; searchForm.roleCode = '';
  pagination.currentPage = 1; handleSearch();
};

const handleSelectionChange = (selection: any[]) => selectedIds.value = selection.map(item => item.id);
const handleSizeChange = (val: number) => { pagination.pageSize = val; pagination.currentPage = 1; handleSearch(); };
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch(); };

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('新增角色');
const formLoading = ref(false);

const roleForm = reactive({ id: undefined, roleName: '', roleCode: '', remark: '', status: 1 });
const formRules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
});

const resetForm = () => { if (formRef.value) formRef.value.resetFields(); roleForm.id = undefined; };

const handleAdd = () => { dialogTitle.value = '新增角色'; dialogVisible.value = true; nextTick(() => resetForm()); };
const handleEdit = (row: any) => { dialogTitle.value = '修改角色'; dialogVisible.value = true; nextTick(() => { resetForm(); Object.assign(roleForm, row); }); };

const handleStatusChange = (row: any) => {
  if(row.roleCode === 'admin') { ElMessage.warning('超级管理员状态不可修改！'); row.status = 1; return; }
  const text = row.status === 1 ? '启用' : '禁用';
  ElMessageBox.confirm(`确认要"${text}"角色 "${row.roleName}" 吗？`, '提示', { type: 'warning' })
    .then(() => ElMessage.success(`${text}成功`))
    .catch(() => row.status = row.status === 1 ? 0 : 1);
};

const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      formLoading.value = true;
      setTimeout(() => {
        formLoading.value = false; dialogVisible.value = false;
        ElMessage.success(`${roleForm.id ? '修改' : '新增'}成功`);
      }, 800);
    }
  });
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除角色 "${row.roleName}"？`, '警告', { type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {});
};
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个角色？`, '警告', { type: 'warning' })
    .then(() => ElMessage.success('批量删除成功')).catch(() => {});
};


// 分配权限逻辑 (核心)
const permsDialogVisible = ref(false);
const permsLoading = ref(false);
const treeRef = ref<TreeInstance>();
const currentAssignRole = ref<any>(null);

// 模拟系统的全量菜单树数据 (通常由后端 /menu/tree 接口返回)
const menuTreeData = [
  {
    id: 1, title: '系统管理',
    children: [
      { 
        id: 11, title: '用户管理', 
        children: [ { id: 111, title: '新增 (btn:add)' }, { id: 112, title: '修改 (btn:edit)' }, { id: 113, title: '删除 (btn:delete)' } ] 
      },
      { 
        id: 12, title: '角色管理',
        children: [ { id: 121, title: '新增 (btn:add)' }, { id: 122, title: '修改 (btn:edit)' }, { id: 123, title: '删除 (btn:delete)' } ] 
      }
    ]
  },
  {
    id: 2, title: '权限管理',
    children: [ { id: 21, title: '页面权限' }, { id: 22, title: '按钮权限' } ]
  }
];

// 打开分配权限弹窗
const handleAssignPerms = (row: any) => {
  currentAssignRole.value = row;
  permsDialogVisible.value = true;
  permsLoading.value = true;

  // 模拟从后端获取该角色【已拥有的权限 ID 列表】
  setTimeout(() => {
    permsLoading.value = false;
    // 假设 Admin 拥有所有权限，普通员工只有用户管理的查看权限
    const mockCheckedKeys = row.roleCode === 'admin' ? [1, 11, 111, 112, 113, 12, 121, 122, 123, 2, 21, 22] : [2, 21];
    
    // nextTick 确保 Tree 组件已经渲染完毕，然后再调用 setCheckedKeys 打勾
    nextTick(() => {
      treeRef.value!.setCheckedKeys(mockCheckedKeys);
    });
  }, 500);
};

// 保存分配的权限
const handleSavePerms = () => {
  // 获取当前树上【半选】和【全选】的节点 ID
  const checkedKeys = treeRef.value!.getCheckedKeys();
  const halfCheckedKeys = treeRef.value!.getHalfCheckedKeys();
  const finalPermIds = [...checkedKeys, ...halfCheckedKeys];

  console.log(`准备提交后端：角色ID [${currentAssignRole.value.id}] 绑定的权限集 ->`, finalPermIds);
  
  permsLoading.value = true;
  setTimeout(() => {
    permsLoading.value = false;
    permsDialogVisible.value = false;
    ElMessage.success('权限分配成功！');
  }, 800);
};

onMounted(() => handleSearch());
</script>
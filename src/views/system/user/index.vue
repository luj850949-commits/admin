<template>
  <div class="h-full">
    <h3>用户管理(仅演示，操作后不生效)</h3>
    <div class="flex h-full gap-4 p-4">
      <div class="w-[260px] bg-white dark:bg-[#141414] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <el-input v-model="treeSearch" placeholder="搜索部门" clearable class="mb-4" />
        <el-tree
          ref="treeRef"
          :data="deptTreeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>

      <div class="flex-1 bg-white dark:bg-[#141414] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
        
        <el-form :inline="true" :model="searchForm" class="mb-2">
          <el-form-item label="用户名称">
            <el-input style="width: 10vw;" v-model="searchForm.username" placeholder="请输入用户名称" clearable @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input style="width: 10vw;" v-model="searchForm.phone" placeholder="请输入手机号码" clearable @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="mb-4">
          <el-button v-auth="['btn:add']" type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
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
          <el-table-column prop="username" label="用户名称" width="120" align="center" />
          <el-table-column prop="nickname" label="昵称" width="120" align="center" />
          <el-table-column prop="deptName" label="部门" width="150" align="center" />
          <el-table-column prop="phone" label="手机号码" width="150" align="center" />
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" />
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-button v-auth="['btn:edit']" type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
              <el-button v-auth="['btn:delete']" type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
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

      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        append-to-body
        destroy-on-close
        @close="resetForm"
      >
        <el-form
          ref="formRef"
          :model="userForm"
          :rules="formRules"
          label-width="100px"
          v-loading="formLoading"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名称" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item v-if="!userForm.id" label="密码" prop="password">
            <el-input v-model="userForm.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="userForm.deptId"
              :data="deptTreeData"
              placeholder="请选择部门"
              check-strictly
              :props="defaultProps"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="userForm.status">
              <el-radio-button :label="1">启用</el-radio-button>
              <el-radio-button :label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="formLoading" @click="handleConfirm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { Search, Plus, Delete, Edit, Refresh } from '@element-plus/icons-vue';

const treeSearch = ref('');
const treeRef = ref();
const defaultProps = { children: 'children', label: 'label', value: 'id' };
const selectedDeptId = ref<number | null>(null);

const deptTreeData = [
  {
    id: 1, label: '某某科技总公司',
    children: [
      { id: 101, label: '深圳总公司', children: [{ id: 1011, label: '研发部门' }, { id: 1012, label: '市场部门' }] },
      { id: 102, label: '郑州分公司', children: [{ id: 1021, label: '测试部门' }, { id: 1022, label: '财务部门' }] }
    ]
  }
];

watch(treeSearch, (val) => treeRef.value!.filter(val));
const filterNode = (value: string, data: any) => value ? data.label.includes(value) : true;
const handleNodeClick = (data: any) => {
  selectedDeptId.value = data.id === 1 ? null : data.id;
  pagination.currentPage = 1;
  handleSearch(); 
};

const searchForm = reactive({ username: '', phone: '' });
const selectedIds = ref<number[]>([]);
const tableData = ref<any[]>([]); // 视图上真正的表格数据
const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 });

// 模拟数据库数据
const rawTableData = [
  { id: 1, username: 'admin', nickname: '管理员', deptId: 1011, deptName: '研发部门', phone: '13888888888', status: 1, createTime: '2023-10-01 12:00:00' },
  { id: 2, username: 'common', nickname: '普通干员', deptId: 1021, deptName: '测试部门', phone: '13999999999', status: 1, createTime: '2023-10-02 14:30:00' },
  { id: 3, username: 'zhangsan', nickname: '张三', deptId: 1011, deptName: '研发部门', phone: '13711111111', status: 1, createTime: '2023-10-03 09:00:00' },
  { id: 4, username: 'lisi', nickname: '李四', deptId: 1012, deptName: '市场部门', phone: '13622222222', status: 0, createTime: '2023-10-04 10:15:00' },
  { id: 5, username: 'wangwu', nickname: '王五', deptId: 1022, deptName: '财务部门', phone: '13533333333', status: 1, createTime: '2023-10-05 14:20:00' },
  { id: 6, username: 'zhaoliu', nickname: '赵六', deptId: 1011, deptName: '研发部门', phone: '13444444444', status: 1, createTime: '2023-10-06 16:45:00' },
];

const handleSearch = () => {
  const filteredData = rawTableData.filter(item => {
    const matchDept = selectedDeptId.value ? item.deptId === selectedDeptId.value : true;
    const matchUsername = item.username.includes(searchForm.username);
    const matchPhone = item.phone.includes(searchForm.phone);
    return matchDept && matchUsername && matchPhone;
  });
  pagination.total = filteredData.length;
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  tableData.value = filteredData.slice(startIndex, startIndex + pagination.pageSize);
};

const resetSearch = () => {
  searchForm.username = ''; searchForm.phone = '';
  selectedDeptId.value = null; treeRef.value?.setCurrentKey(null);
  pagination.currentPage = 1; handleSearch();
};

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('新增用户');
const formLoading = ref(false);

// 3.1 定义弹窗表单数据结构
const userForm = reactive({
  id: undefined, // 存在表示修改，不存在表示新增
  username: '',
  nickname: '',
  password: '',
  deptId: undefined,
  phone: '',
  email: '',
  status: 1 // 默认启用
});

// 定义校验规则
const formRules = reactive({
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择归属部门', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
});

// 重置表单清理校验
const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields(); // 自动还原到 reactive 定义的初始值
  // 额外手动清理 id
  userForm.id = undefined;
};

// 触发【新增】
const handleAdd = () => {
  dialogTitle.value = '新增用户';
  dialogVisible.value = true;
  // 必须延迟清空，因为 dialog mounted 需要时间
  nextTick(() => resetForm());
};

// 触发【修改】
const handleEdit = (row: any) => {
  dialogTitle.value = '修改用户';
  dialogVisible.value = true;
  nextTick(() => {
    resetForm();
    // 模拟数据回显：后端获取详情后赋值
    // 这里把 row 的字段浅拷贝给 userForm
    Object.assign(userForm, row);
    console.log('正在修改用户ID:', userForm.id);
  });
};

// 触发开关【修改状态】
const handleStatusChange = (row: any) => {
  const text = row.status === 1 ? '启用' : '禁用';
  ElMessageBox.confirm(`确认要"${text}"用户 "${row.username}" 吗？`, '系统提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success(`${text}成功`);
  }).catch(() => {
    // 点击取消，把开关还原
    row.status = row.status === 1 ? 0 : 1;
  });
};

// 弹窗点击【确定】（新增/修改保存）
const handleConfirm = async () => {
  if (!formRef.value) return;
  // 1. 执行表单校验
  await formRef.value.validate((valid) => {
    if (valid) {
      // 2. 模拟加载状态
      formLoading.value = true;
      console.log('提交的表单数据:', userForm);
      
      const type = userForm.id ? '修改' : '新增';

      // 3. 模拟网络请求
      setTimeout(() => {
        formLoading.value = false;
        dialogVisible.value = false;
        ElMessage.success(`${type}成功`);
        // 这里如果是真实后端，应该重新调用 handleSearch 刷新列表
      }, 1500);
    }
  });
};

// 触发【删除】
const handleDelete = (row: any) => {
  // 1. 使用 ElMessageBox 弹出确认框
  ElMessageBox.confirm(`确认要删除用户 "${row.username}" 吗？此操作不可逆！`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 2. 模拟成功消息
    ElMessage.success('删除成功');
  }).catch(() => {
    console.log('取消删除');
  });
};

// 触发【批量删除】
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return;
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条用户数据吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除成功');
  }).catch(() => {});
};


const handleSelectionChange = (selection: any[]) => selectedIds.value = selection.map(item => item.id);
const handleSizeChange = (val: number) => { pagination.pageSize = val; pagination.currentPage = 1; handleSearch(); };
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch(); };

onMounted(() => handleSearch());
</script>
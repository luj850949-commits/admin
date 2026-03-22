<template>
  <div class="flex flex-col lg:flex-row gap-4 h-full">
    
    <!--  左侧：用户资料卡片  -->
    <el-card shadow="never" class="w-full lg:w-[350px] shrink-0 border-none rounded-xl">
      <template #header>
        <div class="font-bold text-gray-800 dark:text-gray-200">个人信息</div>
      </template>
      
      <div class="flex flex-col items-center pt-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <!-- 头像上传占位 -->
        <div class="relative group cursor-pointer rounded-full overflow-hidden w-[100px] h-[100px] border-4 border-white dark:border-gray-800 shadow-md">
          <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <el-icon class="text-white text-2xl"><Camera /></el-icon>
          </div>
        </div>
        
        <h2 class="mt-4 text-xl font-bold text-gray-800 dark:text-white">{{ userStore.username }}</h2>
      </div>

      <div class="py-4 space-y-4 text-sm">
        <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <div class="flex items-center"><el-icon class="mr-2"><User /></el-icon>用户昵称</div>
          <span class="text-gray-800 dark:text-gray-200">{{ userStore.username }}</span>
        </div>
        <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <div class="flex items-center"><el-icon class="mr-2"><Phone /></el-icon>手机号码</div>
          <span class="text-gray-800 dark:text-gray-200">138****8888</span>
        </div>
        <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <div class="flex items-center"><el-icon class="mr-2"><Message /></el-icon>用户邮箱</div>
          <span class="text-gray-800 dark:text-gray-200">2244636579@qq.com</span>
        </div>
        <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <div class="flex items-center"><el-icon class="mr-2"><Monitor /></el-icon>所属部门</div>
          <span class="text-gray-800 dark:text-gray-200">研发部 - 前端组</span>
        </div>
      </div>
    </el-card>

    <!--  右侧：资料编辑区  -->
    <el-card shadow="never" class="flex-1 border-none rounded-xl">
      <el-tabs v-model="activeTab" class="profile-tabs">
        
        <!-- 标签 1：基本资料 -->
        <el-tab-pane label="基本资料" name="info">
          <div class="pt-4 max-w-lg">
            <el-form 
              ref="infoFormRef" 
              :model="infoForm" 
              :rules="infoRules" 
              label-width="80px" 
              label-position="right"
            >
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="infoForm.nickname" placeholder="请输入您的昵称" maxlength="30" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="infoForm.email" placeholder="请输入电子邮箱" />
              </el-form-item>
              <el-form-item label="个人简介" prop="bio">
                <el-input 
                  v-model="infoForm.bio" 
                  type="textarea" 
                  :rows="4" 
                  placeholder="用一句话介绍一下自己吧" 
                  maxlength="150"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitInfoForm(infoFormRef)" :icon="Check">保存修改</el-button>
                <el-button @click="resetForm(infoFormRef)">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 标签 2：修改密码 -->
        <el-tab-pane label="修改密码" name="password">
          <div class="pt-4 max-w-lg">
            <el-form 
              ref="pwdFormRef" 
              :model="pwdForm" 
              :rules="pwdRules" 
              label-width="80px" 
              label-position="right"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入当前使用的密码" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码（不少于 6 位）" />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitPwdForm(pwdFormRef)" :icon="Check">更新密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Camera, User, Phone, Message, Monitor, Check } from '@element-plus/icons-vue'
import { ElMessage} from 'element-plus'
import type { FormInstance, FormRules, FormItemRule } from "element-plus";
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 控制当前激活的 Tab
const activeTab = ref<string>('info')

//  基本资料逻辑 
const infoFormRef = ref<FormInstance>()

interface InfoForm {
  nickname: string;
  phone: string;
  email: string;
  bio: string;
}

const infoForm = reactive<InfoForm>({
  nickname: userStore.username,
  phone: '13888888888',
  email: '2244636579@qq.com',
  bio: '前端开发工程师，热爱生活，热爱编码。'
})

const infoRules = reactive<FormRules<InfoForm>>({
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const submitInfoForm = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      // TODO: 这里将来可以调用后端 API 更新资料
      ElMessage.success('基本资料已成功保存！')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
}

//  修改密码逻辑 
const pwdFormRef = ref<FormInstance>()

interface PwdForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const pwdForm = reactive<PwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义校验：确认密码必须和新密码一致
const validateConfirmPwd = (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const pwdRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPwd, trigger: 'blur' }
  ]
})

const submitPwdForm = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      // TODO: 调用后端修改密码接口
      ElMessage.success('密码修改成功，请妥善保管！')
      formEl.resetFields()
    }
  })
}
</script>

<style scoped>
/* 去除 Tabs 默认的底部灰线，让界面更清爽 */
:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--el-border-color-light);
}
:deep(.el-card) {
  background-color: var(--el-bg-color-overlay);
}
</style>
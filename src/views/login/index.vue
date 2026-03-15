<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { bg, illustration, avatar } from "./utils/static"
import { useDark, useStorage } from '@vueuse/core'
import { Setting } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

// 引入 vue-i18n 提供的方法：locale 用于切换语言
const { locale } = useI18n()

const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  verifyCode: ""
});

const onLogin = async () => {
  if (!ruleFormRef.value) return;
  
  // 模拟点击登录后的过程
  loading.value = true;
  console.log("正在提交数据：", ruleForm);
  
  setTimeout(() => {
    loading.value = false;
    alert("点击了登录！数据请看控制台");
  }, 1000);
};

// 切换暗黑主题
const isDark = useDark({
  disableTransition: false // 关闭自带的“禁用过渡动画”功能
})

// 国际化处理
const currentLang = useStorage('locale', 'zhCn');
const handleLangChange = (command: string) => {
  currentLang.value = command;
  locale.value = command;
}
</script>

<template>
  <div>
    <!-- 背景图 -->
    <img :src="bg" class="wave">

    <!-- 右上角控制暗黑主题和翻译的按钮 -->
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        inline-prompt
        active-text="☀️"
        inactive-text="🌙"
        v-model="isDark"
        style="--el-switch-on-color: #409eff; --el-switch-off-color: #f2f2f2"
      />
      <!-- 国际化 -->
      <el-dropdown trigger="click" @command="handleLangChange">
        <el-icon class="ml-6 text-gray-600 dark:text-gray-300 hover:!text-[#409eff] transition-colors cursor-pointer outline-none" size="22px"><Setting /></el-icon>
        <template #dropdown>
          <el-dropdown-menu class="lang-dropdown">
            <el-dropdown-item command="zh" :class="{'is-active': currentLang === 'zh'}">
              <span class="w-5 inline-block text-center mr-1">
                <span v-if="currentLang === 'zh'">✔</span>
              </span> 
              简体中文
            </el-dropdown-item>
            
            <el-dropdown-item command="en" :class="{'is-active': currentLang === 'en'}">
              <span class="w-5 inline-block text-center mr-1">
                <span v-if="currentLang === 'en'">✔</span>
              </span> 
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="login-container">
      <!-- 左侧插画 -->
      <div class="img">
        <img :src="illustration" alt="登录插画" />
      </div>

      <!-- 右侧登录窗口 -->
      <div class="login-box bg-white dark:bg-gray-700 dark:border-gray-700 transition-colors duration-300">
        <div class="login-form">
          <!-- 登录窗口上方logo -->
          <div class="flex justify-center mb-6">
            <img 
              :src="avatar" 
              class="w-[100px] h-[100px]" 
            />
          </div>
          
          <h2 class="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-300">{{ $t('login.title') }}</h2>
          
          <el-form ref="ruleFormRef" :model="ruleForm" size="large">
            
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                :placeholder="$t('login.username')"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                :placeholder="$t('login.password')"
                show-password
                clearable
              />
            </el-form-item>

            <el-form-item prop="verifyCode">
              <el-input
                v-model="ruleForm.verifyCode"
                :placeholder="$t('login.verifyCode')"
                clearable
              >
                <template #append>
                  <div style="cursor: pointer;">验证码占位</div>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                class="w-full"
                type="primary"
                :loading="loading"
                @click="onLogin"
              >
                {{ $t('login.submit') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wave {
  position: fixed;      /* 固定定位，脱离文档流 */
  top: 0;
  left: 0;
  width: 100%;          /* 宽度撑满屏幕 */
  height: 100%;         /* 高度撑满屏幕 */
  z-index: -1;          /* 沉到最底层，防止挡住登录框和按钮 */
  object-fit: cover;    /* 保证图片拉伸铺满且不变形 */
}
.login-container {
  display: flex;
  align-items: center;          /* 垂直居中 */
  justify-content: space-around;/* 左右内容之间留出均匀的空隙 */
  box-sizing: border-box;       /* 保证 padding 不会撑破屏幕 */
  width: 100vw;
  height: 100vh;
}
.img {
  width: 500px;
}
.login-box {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
/* 当宽度小于900px时，隐藏左侧图片 */
@media (max-width: 900px) {
  .img {
    display: none;
  }
}
</style>
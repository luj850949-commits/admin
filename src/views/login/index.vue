<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { bg, illustration, avatar } from "./utils/static"

// 1. 定义页面的状态
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

// 2. 用户名密码
const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  verifyCode: ""
});

// 3. 登录函数（简化版）
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
</script>

<template>
  <div>
    <!-- 背景图 -->
    <img :src="bg" class="wave">

    <div class="login-container">
      <!-- 左侧插画 -->
      <div class="img">
        <img :src="illustration" alt="登录插画" />
      </div>

      <!-- 右侧登录窗口 -->
      <div class="login-box">
        <div class="login-form">
          <!-- 登录窗口上方logo -->
          <div class="flex justify-center mb-6">
            <img 
              :src="avatar" 
              class="w-[100px] h-[100px]" 
            />
          </div>
          
          <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">用户登录</h2>
          
          <el-form ref="ruleFormRef" :model="ruleForm" size="large">
            
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                placeholder="用户名"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                placeholder="密码"
                show-password
                clearable
              />
            </el-form-item>

            <el-form-item prop="verifyCode">
              <el-input
                v-model="ruleForm.verifyCode"
                placeholder="验证码"
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
                登录
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
  background: white;
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
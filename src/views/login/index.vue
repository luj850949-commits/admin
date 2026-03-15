<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
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

// 验证码
// 1. 验证码相关的响应式变量
const verifyCanvasRef = ref<HTMLCanvasElement | null>(null);
const generatedCode = ref(""); // 存放真实生成的4位验证码，用于比对

// 2. 核心：绘制图形验证码的函数
const drawVerifyCode = () => {
  const canvas = verifyCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // 随机颜色生成函数
  const randomColor = (min: number, max: number) => {
    const r = Math.floor(Math.random() * (max - min) + min);
    const g = Math.floor(Math.random() * (max - min) + min);
    const b = Math.floor(Math.random() * (max - min) + min);
    return `rgb(${r},${g},${b})`;
  };

  // 随机数生成函数
  const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

  // 清空画布并填充浅色背景
  ctx.fillStyle = randomColor(180, 240);
  ctx.fillRect(0, 0, width, height);

  // 准备要抽取的字符（去掉了容易混淆的 1, l, I, 0, O）
  const str = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";

  // 绘制 4 个字符
  for (let i = 0; i < 4; i++) {
    const char = str.charAt(randomNum(0, str.length));
    code += char;
    
    const fontSize = randomNum(18, 28); // 字体大小随机
    const deg = randomNum(-30, 30);     // 旋转角度随机
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = randomColor(50, 160); // 字体颜色随机深色

    ctx.save();
    // 移动原点到指定位置并旋转，制造歪歪扭扭的效果
    ctx.translate(20 * i + 15, height / 2);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(char, -10, 0);
    ctx.restore();
  }
  
  // 保存生成的验证码内容
  generatedCode.value = code;

  // 绘制干扰线（5条）
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.strokeStyle = randomColor(100, 200);
    ctx.stroke();
  }

  // 绘制干扰噪点（40个）
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.fillStyle = randomColor(150, 200);
    ctx.fill();
  }
};

// 3. 页面挂载时，自动画一张验证码出来
onMounted(() => {
  drawVerifyCode();
});
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
                <canvas
                  ref="verifyCanvasRef"
                  width="110"
                  height="38"
                  class="cursor-pointer"
                  :title="$t('login.reVerifyCode')"
                  @click="drawVerifyCode"
                ></canvas>
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
/* 强行清除输入框 append 插槽的默认内边距 */
:deep(.el-input-group__append) {
  padding: 0;
}
</style>
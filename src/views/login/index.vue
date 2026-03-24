<script setup lang="ts">
import { ref, reactive, onMounted, onUpdated } from "vue";
import type { FormInstance, FormRules, FormItemRule } from "element-plus";
import { ElMessage } from "element-plus"
import { bg, illustration, avatar } from "./utils/static"
import { User ,Lock, Compass, Iphone } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { loginAPI } from "@/api/user";
import { useUserStore } from '@/stores'

import translate from "@/components/translate.vue";
import changeTheme from "@/components/changeTheme.vue";

const router = useRouter()
const userStore = useUserStore()

// 引入 vue-i18n 提供的方法：locale 用于切换语言
const { t } = useI18n()

const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
// 记录当前处于哪个模块 ('login' | 'register' | 'forgot')
const currentModule = ref("login");

// 登录
const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  verifyCode: ""
});

const onLogin = async () => {
  if (!ruleFormRef.value) return;
  
  // 调用 validate 方法进行全局校验
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 校验全部通过！接下来走验证码比对逻辑
      if (ruleForm.verifyCode.toLowerCase() !== generatedCode.value.toLowerCase()) {
        ElMessage.error(t('login.verCodeErr'));
        ruleForm.verifyCode = "";
        drawVerifyCode();
        return;
      }
      try{
        // 开始真正的登录请求
        loading.value = true;
        const res = await loginAPI({
          username: ruleForm.username,
          password: ruleForm.password
        })
        ElMessage.success(t('login.submitSuc'));
        userStore.setToken(res.token)
        userStore.setUsername(res.username)
        setTimeout(() => {
          loading.value = false;
          router.push('/')
        }, 1000);
      } catch(error) {
        console.log(error)
        // 只要登录失败，为了安全，自动刷新一次验证码
        if (error instanceof Error) {
            ruleForm.verifyCode = "";
            drawVerifyCode();
        }
        loading.value = false;
      }
    }
  });
};

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
// 3. 页面挂载或刷新时，自动画一张验证码出来
onMounted(() => {
  drawVerifyCode();
});
onUpdated(() => {
  drawVerifyCode();
})

// 表单验证
// 1. 编写密码的自定义校验逻辑
const validatePassword = (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
  if (!value) { 
    return callback(new Error(t('login.passwordEmpty')));
  }
  if (value.length < 8 || value.length > 18) {
    return callback(new Error(t('login.passwordLength')));
  }
  
  // 统计包含的字符类型数量
  let typeCount = 0;
  if (/[a-zA-Z]/.test(value)) typeCount++; // 包含字母
  if (/[0-9]/.test(value)) typeCount++;    // 包含数字
  if (/[^a-zA-Z0-9\s]/.test(value)) typeCount++; // 包含符号（排除空格、字母、数字）

  if (typeCount < 2) {
    return callback(new Error(t('login.passwordType')));
  }
  
  // 校验通过
  callback();
};

// 2. 定义完整的表单校验规则对象
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: t('login.usernameEmpty'), trigger: "blur" }
  ],
  password: [
    // 使用自定义校验函数，并设置 trigger 为 blur（失焦时触发）
    { required: true, validator: validatePassword, trigger: ["blur"] }
  ],
  verifyCode: [
    { required: true, message: t('login.verifyEmpty'), trigger: "blur" }
  ]
});


// 注册
const registerFormRef = ref<FormInstance>();
const registerForm = reactive({
  username: "",
  phone: "",
  verifyCode: "",
  password: "",
  confirmPassword: "",
});
const countdown = ref(0); // 倒计时秒数
const isCounting = ref(false); // 是否正在倒计时中
let timer: ReturnType<typeof setInterval> | null = null; // 定时器引用
// 点击获取验证码
const onGetVerCode = async() => {
  if (!registerFormRef.value) return;
  await registerFormRef.value.validateField("phone");
  ElMessage.success(t('login.verCodeSend'));
  startCountdown();
}
// 启动倒计时函数
const startCountdown = () => {
  isCounting.value = true;
  countdown.value = 60; // 设置倒计时 60 秒
  
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      // 倒计时结束，清理定时器并恢复按钮状态
      clearInterval(timer!);
      isCounting.value = false;
    }
  }, 1000);
};
// 自定义验证注册再次输入密码
const rePassword = (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
  if(value !== registerForm.password){
    return callback(new Error(t('login.rePassword')));
  }else{
    // 校验通过
    callback();
  }
};

const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: t('login.usernameEmpty'), trigger: "blur" }
  ],
  phone: [
    { required: true, message: t('login.phoneEmpty'), trigger: ["blur"] },
    { pattern: /^1[3-9]\d{9}$/, message: t('login.phoneType'), trigger: ["blur"] }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: ["blur"] }
  ],
  verifyCode: [
    { required: true, message: t('login.verifyEmpty'), trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: ["blur"] },
    { validator: rePassword, trigger: ["blur"] }
  ]
});

// 忘记密码
const forgotFormRef = ref<FormInstance>();
const forgotForm = reactive({
  phone: "",
  verifyCode: "",
  password: "",
  confirmPassword: '',
});
// 点击获取验证码
const onForGetVerCode = async() => {
  if (!forgotFormRef.value) return;
  await forgotFormRef.value.validateField("phone");
  ElMessage.success(t('login.verCodeSend'));
  startCountdown();
}
// 自定义验证重置密码再次输入密码
const reForgotPassword = (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
  if(value !== forgotForm.password){
    return callback(new Error(t('login.rePassword')));
  }else{
    // 校验通过
    callback();
  }
};
const forgotRules = reactive<FormRules>({
  phone: [
    { required: true, message: t('login.phoneEmpty'), trigger: ["blur"] },
    { pattern: /^1[3-9]\d{9}$/, message: t('login.phoneType'), trigger: ["blur"] }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: ["blur"] }
  ],
  verifyCode: [
    { required: true, message: t('login.verifyEmpty'), trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: ["blur"] },
    { validator: reForgotPassword, trigger: ["blur"] }
  ]
});
</script>

<template>
  <div>
    <!-- 背景图 -->
    <img :src="bg" class="wave">

    <!-- 右上角控制暗黑主题和翻译的按钮 -->
    <div class="flex-c absolute right-5 top-3 gap-3">
      <!-- 切换明暗主题 -->
      <changeTheme></changeTheme>
      <!-- 国际化 -->
      <translate></translate>
    </div>

    <div class="login-container">
      <!-- 左侧插画 -->
      <div class="img">
        <illustration></illustration>
      </div>

      <!-- 右侧登录窗口 -->
      <div class="login-box bg-white dark:bg-gray-700 dark:border-gray-700 transition-colors duration-300">
        
        <div class="login-form">
          <!-- 登录窗口上方logo -->
          <div class="flex justify-center mb-6">
            <avatar class="w-[100px] h-[100px]" />
          </div>
          <!-- 登录窗口 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 100 }"
            :enter="{ opacity: 1, y: 0 }"
            v-if="currentModule === 'login'"
            >
            <h2 class="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-300">{{ $t('login.title') }}</h2>
            <el-form :rules="loginRules" ref="ruleFormRef" :model="ruleForm" size="large">
              
              <el-form-item prop="username">
                <el-input
                  v-model="ruleForm.username"
                  :placeholder="$t('login.username')"
                  clearable
                >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  :placeholder="$t('login.password')"
                  show-password
                  clearable
                >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.verifyCode"
                  :placeholder="$t('login.verifyCode')"
                  clearable
                  @keyup.enter="onLogin"
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
                  <template #prefix>
                    <el-icon><Compass /></el-icon>
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
            <div class="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="cursor-pointer hover:text-[#409eff] transition-colors" @click="currentModule = 'forgot'">
                {{ $t('login.forget') }}
              </span>
              <span class="cursor-pointer hover:text-[#409eff] transition-colors" @click="currentModule = 'register'">
                {{ $t('login.reregister') }}
              </span>
            </div>
          </div>
          
          <!-- 注册窗口 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 100 }"
            :enter="{ opacity: 1, y: 0 }"
            v-else-if="currentModule === 'register'"
          >
            <h2 class="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {{ $t('login.reregisterTitle') }}
            </h2>

            <el-form :rules="registerRules" :model="registerForm" ref="registerFormRef" size="large">
              <el-form-item prop="username">
                <el-input
                  v-model="registerForm.username"
                  :placeholder="$t('login.username')"
                  clearable
                >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
                </el-input>
              </el-form-item>
          
              <el-form-item prop="phone">
                <el-input
                  v-model="registerForm.phone"
                  :placeholder="$t('login.phoneNum')"
                  clearable
                >
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="verifyCode">
                <el-input
                  v-model="registerForm.verifyCode"
                  :placeholder="$t('login.verifyCode')"
                  clearable
                >
                <template #append>
                  <el-button :disabled="isCounting" class="w-40 hover:!text-[#409eff]" @click="onGetVerCode">{{ isCounting ? `${countdown}` + $t('login.seconds') : $t('login.getVerCode') }}</el-button>
                </template>
                <template #prefix>
                  <el-icon><Compass /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  :placeholder="$t('login.password')"
                  show-password
                  clearable
                >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  :placeholder="$t('login.surePassword')"
                  show-password
                  clearable
                >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-button class="w-full" type="success" @click="currentModule = 'login'">
                {{ $t('login.reregisterSuccess') }}
              </el-button>
            </el-form>

            <div class="flex justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="cursor-pointer hover:text-[#409eff] transition-colors" @click="currentModule = 'login'">
                ⬅ {{ $t('login.backLogin') }}
              </span>
            </div>
          </div>

          <!-- 忘记密码 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 100 }"
            :enter="{ opacity: 1, y: 0 }"
            v-else-if="currentModule === 'forgot'"
            >
            <h2 class="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {{ $t('login.reTitle') }}
            </h2>
            
            <el-form :rules="forgotRules" :model="forgotForm" ref="forgotFormRef" size="large">
              <el-form-item prop="phone">
                <el-input
                  v-model="forgotForm.phone"
                  :placeholder="$t('login.phoneNum')"
                  clearable
                >
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="verifyCode">
                <el-input
                  v-model="forgotForm.verifyCode"
                  :placeholder="$t('login.verifyCode')"
                  clearable
                >
                <template #append>
                  <el-button :disabled="isCounting" class="w-40 hover:!text-[#409eff]" @click="onForGetVerCode">{{ isCounting ? `${countdown}` + $t('login.seconds') : $t('login.getVerCode') }}</el-button>
                </template>
                <template #prefix>
                  <el-icon><Compass /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="forgotForm.password"
                  :placeholder="$t('login.password')"
                  show-password
                  clearable
                >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="forgotForm.confirmPassword"
                  :placeholder="$t('login.surePassword')"
                  show-password
                  clearable
                >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
                </el-input>
              </el-form-item>

              <el-button class="w-full" type="success" @click="currentModule = 'login'">
                {{ $t('login.reSuccess') }}
              </el-button>
            </el-form>

            <div class="flex justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="cursor-pointer hover:text-[#409eff] transition-colors" @click="currentModule = 'login'">
                ⬅ {{ $t('login.backLogin') }}
              </span>
            </div>
          </div>
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
<template>
  <div class="felx justify-items-center">
    <el-card style="width: 80%">
      <template #header>
        <div class="card-header">
          <span>DeepSeek</span>
        </div>
      </template>
      <div class="felx justify-items-center">
        <deep-chat
          :history="history"
          :directConnection='{
            "deepSeek": {
              "key": "sk-dfa3cd8a633d4a6a84ec75a7f1fa2352",
              "system_prompt": "你是一个前端开发专家，精通 Vue.js 和相关技术栈，能够帮助用户解决各种前端开发问题。",
              "temperature": 0.7
            }
          }'
          :connect='{"stream": true}'

          :style="chatStyle"
          :messageStyles="messageStyles"
          :textInput="textInputConfig"
          :submitButtonStyles="submitButtonStyles"
        ></deep-chat>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'deep-chat' // 必须引入，以注册 <deep-chat> 标签

const history = ref([
  { role: 'ai', text: '你好！我是你的专属 AI 助手，有什么我可以帮你的吗？' },
]);

const chatStyle = {
  width: '100vh',
  height: '75vh',
  border: 'none',
  backgroundColor: 'var(--bg-color)',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
}

const messageStyles = {
  default: {
    shared: {
      innerContainer: {
        fontSize: '15px',
        lineHeight: '1.6',
        borderRadius: '12px',
        maxWidth: '85%'
      }
    },
    user: {
      bubble: {
        backgroundColor: 'var(--border-color)', // 3. 用户回复的消息有“浅灰色”气泡框
        color: 'var(--text-color)',
        padding: '12px 16px',
        border: 'none',
        marginTop: '16px'
      }
    },
    ai: {
      bubble: {
        backgroundColor: 'transparent', // 2. AI 回复的消息没有气泡框（透明背景）
        color: 'var(--text-color)',
        padding: '12px 0',
        border: 'none',
        boxShadow: 'none', // 确保清除默认阴影
        marginTop: '16px'
      }
    }
  }
}

const textInputConfig = {
  styles: {
    container: {
      backgroundColor: 'var(--border-color)', 
      border: '1px solid #e5e7eb', 
      borderRadius: '24px',        
      // 【关键修改】：将原来的 padding: '10px 16px' 改为如下。
      // 右侧增加到 48px，留出空间给发送按钮，防止文字重叠
      padding: '10px 48px 10px 16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
      margin: '0 20px 20px 20px'
    },
    text: {
      fontSize: '15px',
      color: 'var(--text-color)'
    }
  },
  placeholder: {
    text: '给 DeepSeek 发送消息...',
    style: {
      color: 'var(--text-color)'
    }
  }
}

const submitButtonStyles = {
  position: 'inside-right', 
  
  // 常态
  submit: {
    container: {
      default: {
        backgroundColor: '#7cb9e8', 
        borderRadius: '50%',        
        padding: '6px',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // 【关键修改】：上 auto，右 10px，下 8px，左 0px
        // 这样可以把按钮从右下角往左上推，使其完美居中于圆角区域
        margin: 'auto 20px 12px 0px', 
      },
      hover: {
        backgroundColor: '#6ba6d6' 
      }
    },
    svg: {
      styles: {
        default: {
          filter: 'brightness(0) invert(1)' 
        }
      }
    }
  },

  // 禁用态（输入框没有字）
  disabled: {
    container: {
      default: {
        backgroundColor: '#7cb9e8', 
        borderRadius: '50%',
        padding: '6px',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // 【关键修改】：必须和 submit 保持一致，避免状态切换时按钮跳动
        margin: 'auto 20px 12px 0px',
      }
    },
    svg: {
      styles: {
        default: {
          filter: 'brightness(0) invert(1)' 
        }
      }
    },
  },

  // 加载态
  loading: {
    svg: {
      content: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="20" cy="12" r="2.5" fill="currentColor"/></svg>',
      styles: {
        default: {
          filter: 'brightness(0) invert(1)',
          width: '20px', 
          height: '20px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: '0',
          padding: '0'
        }
      }
    }
  },

  // 停止态 (AI 回复中)
  stop: {
    svg: {
      content: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="15" height="15" rx="1" fill="currentColor"/></svg>',
      styles: {
        default: {
          filter: 'brightness(0) invert(1)',
          width: '18px',
          height: '18px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: '0',
          padding: '0'
        }
      }
    }
  }
}

</script>

<style scoped>

</style>
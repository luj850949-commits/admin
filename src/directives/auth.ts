import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/stores/modules/user';

export const auth: Directive = {
  // Vue3 指令的生命周期钩子，在元素被插入 DOM 时调用
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore();
    const { value } = binding; // 获取 v-auth="['btn:add']" 传进来的值
    
    if (value) {
      // 兼容字符串和数组两种写法
      const auths = typeof value === 'string' ? [value] : value;
      // 核心判断：用户拥有的权限标识中，是否包含该按钮所需的标识？
      const hasAuth = userStore.permissions.some(perm => auths.includes(perm));
      
      // 如果没有权限，直接把这个 DOM 元素从父节点移除
      if (!hasAuth) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error(`需要配置权限标识，例如 v-auth="['btn:add']"`);
    }
  }
};
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span 
          v-if="index === breadcrumbs.length - 1" 
          class="text-gray-400 dark:text-gray-500 font-normal"
        >
          {{ item.title }}
        </span>
        <a 
          v-else 
          @click.prevent="handleLink(item)" 
          class="text-gray-600 dark:text-gray-300 hover:text-[#409eff] transition-colors font-normal"
        >
          {{ item.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
  path: string;
  title: string;
  redirect?: string;
}

const breadcrumbs = ref<BreadcrumbItem[]>([])

const getBreadcrumb = (): void => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const result: BreadcrumbItem[] = []
  
  if (matched.length === 0 || matched[0]?.name !== 'Dashboard') {
    result.push({ 
      path: '/dashboard', 
      title: '首页' 
    })
  }

  // 映射 Vue Router 的原生对象到我们的严格接口
  matched.forEach(item => {
    result.push({
      path: item.path,
      title: String(item.meta.title || item.name || ''),
      redirect: typeof item.redirect === 'string' ? item.redirect : undefined
    })
  })

  breadcrumbs.value = result
}

const handleLink = (item: BreadcrumbItem): void => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watch(() => route.path, () => {
  getBreadcrumb()
})

onMounted(() => {
  getBreadcrumb()
})
</script>

<style scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.4s ease;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-leave-active {
  position: absolute;
}
</style>
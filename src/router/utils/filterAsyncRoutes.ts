import type { RouteRecordRaw } from "vue-router";

// 判断用户角色列表是否包含路由所需的角色
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => (route.meta?.roles as string[]).includes(role))
  }
  return true // 如果没有 meta.roles 定义，则默认允许访问
}

// 递归过滤有权限的动态路由树
export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
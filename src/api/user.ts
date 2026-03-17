import http from '@/utils/http'

export type LoginResult = {
  username: string;
  roles: string[];
  token: string;
}

// 登录
export const loginAPI = (data?: object) => {
  return http.post("/login", data) as Promise<LoginResult>
}
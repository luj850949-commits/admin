import axios from "axios";
import { ElMessage } from "element-plus";

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || "/api",
  timeout: 10000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 发请求前，检查本地有没有 Token
    const token = localStorage.getItem("token");
    if (token) {
      // 如果有，就把它塞进请求头里（Bearer 是业界标准前缀）
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 (入境安检)
http.interceptors.response.use(
  (response) => {
    // 这里的 response.data 才是后端真正返回的那个 JSON 对象
    const res = response.data;

    // 假设后端约定的成功状态码是 0 或 200 (根据实际后端接口调整)
    if (res.code === 0 || res.code === 200) {
      return res.data;
    } else {
      // 失败
      ElMessage.error(res.message || "请求失败");
      // 抛出错误，阻止代码继续往下走
      return Promise.reject(new Error(res.message || "Error"));
    }
  },
  (error) => {
    // 处理 HTTP 状态码层面的错误（比如 401没权限、404找不到、500服务器崩了）
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录已过期，请重新登录");
          localStorage.removeItem("token");
          break;
        case 404:
          ElMessage.error("请求的接口不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error("网络请求错误");
      }
    } else {
      ElMessage.error("网络连接断开，请检查网络");
    }
    return Promise.reject(error);
  }
);

export default http;
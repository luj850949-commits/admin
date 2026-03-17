import { MockMethod } from 'vite-plugin-mock'

export default [
  // 登录接口
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body;
      if( username === "admin" ) {
        return {
          code: 200,
          message: '登陆成功',
          data: {
            username: '管理员',
            roles: ['admin'],
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.123456'
          }
        };
      } else {
        return {
          code: 200,
          message: '登陆成功',
          data: {
            username: '普通干员',
            roles: ['common'],
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.789101'
          }
        };
      }
    }
  }
] as MockMethod[];
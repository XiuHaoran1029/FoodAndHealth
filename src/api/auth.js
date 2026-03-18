import http from './http'

/**
 * 用户登录
 * @param {string} username
 * @param {string} password
 */
export const login = (username, password) =>
  http.post('/api/auth/login', { username, password })

/**
 * 用户注册
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
export const register = (username, password, email) =>
  http.post('/api/auth/register', { username, password, email })

/**
 * 更新用户设置（用户名、疾病信息、忌口信息、头像）
 * @param {object} data - { userid, username, sick, taboo, avatar }
 */
export const updateSetting = (data) =>
  http.post('/api/auth/setting', data)

/**
 * 修改密码
 * @param {number} userid
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export const changePassword = (userid, oldPassword, newPassword) =>
  http.get('/api/auth/setting', {
    params: { userid, old_password: oldPassword, new_password: newPassword }
  })

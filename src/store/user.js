import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(null)
  const username = ref('')
  const avatar = ref('')
  const sick = ref('')
  const taboo = ref('')

  // 初始化时解析已存储的 token
  if (token.value) {
    _parseToken(token.value)
  }

  function _parseToken(rawToken) {
    if (!rawToken) {
      logout();
      return;
    }

    try {
      const decodedOuter = rawToken;

      // --- 第二步：按分隔符拆分 ---
      // 注意：确保这里的分隔符与后端 SEPARATOR 一致，通常是 "|#|"
      const SEPARATOR = '|#|';
      const parts = decodedOuter.split(SEPARATOR);

      if (parts.length !== 3) {
        throw new Error(`Token 格式错误：期望 3 个部分，实际得到 ${parts.length}`);
      }

      // --- 第三步：分别解码字段 ---
      // 后端: Base64.getUrlDecoder().decode(parts[0]) -> userId
      const userIdStr =  urlSafeBase64Decode(parts[0]);

      // 后端: Base64.getUrlDecoder().decode(parts[1]) -> username
      const usernameStr = urlSafeBase64Decode(parts[1]);

      // 后端: parts[2] (图片 Base64 不再次解码，直接使用)
      const imgBase64Str = parts[2];

      // --- 第四步：赋值 ---
      const parsedId = Number(userIdStr);

      if (isNaN(parsedId)) {
        throw new Error('用户 ID 不是有效数字');
      }



      userId.value = parsedId;
      username.value = usernameStr;
      avatar.value = imgBase64Str; // 注意：这里拿到的是完整的 Base64 图片字符串 (data:image/...)

      console.log('✅ Token 解析成功:', { id: userId.value, user: username.value });

    } catch (e) {
      console.error('❌ Token 解析严重失败:', e.message);
      // 【关键】解析失败必须清除状态，防止 null ID 请求后端
      logout();
      // 可选：强制跳转登录页
      // window.location.href = '/login';
    }
  }

// 保持 setToken 不变，但确保调用的是新的 _parseToken
  function setToken(rawToken) {
    if (!rawToken) {
      logout();
      console.log('❌ Token 解析失败')
      return;
    }
    token.value = rawToken;
    localStorage.setItem('token', rawToken);
    _parseToken(rawToken);
  }

  function logout() {
    token.value = ''
    userId.value = null
    username.value = ''
    avatar.value = ''
    sick.value = ''
    taboo.value = ''
    localStorage.removeItem('token')
  }
  /**
   * URL Safe Base64 解码辅助函数
   * 将 '-' 替换为 '+', '_' 替换为 '/', 并处理填充 '='
   */
  function urlSafeBase64Decode(base64Url) {
    // 1. 替换字符
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // 2. 补全 padding (Base64 长度必须是 4 的倍数)
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }

    // 3. 解码
    try {
      return atob(base64);
    } catch (e) {
      console.error('Base64 解码失败:', e);
      throw new Error('Invalid Base64');
    }
  }

  const isLoggedIn = computed(() => !!token.value)

  return { token, userId, username, avatar, sick, taboo, setToken, logout, isLoggedIn }
})

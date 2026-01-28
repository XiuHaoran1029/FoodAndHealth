<!-- filepath: c:\NoChineseFile\FoodAndHealth\FoodAndHealth-master\FoodAndHealth-master\src\views\login.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

// 表单状态：'login' 或 'register'
const mode = ref('login')

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 响应式检测
const isLargeScreen = useMediaQuery('(min-width: 768px)')
const screenWidth = ref(window.innerWidth)

// Android WebView检测
const isAndroidWebView = computed(() => {
  return /android/i.test(navigator.userAgent) && /wv/i.test(navigator.userAgent)
})

const effectiveIsLargeScreen = computed(() => {
  if (isLargeScreen.value !== null) {
    return isLargeScreen.value
  }
  return screenWidth.value >= 768
})

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  // 清空表单
  loginForm.value = { username: '', password: '' }
  registerForm.value = { username: '', email: '', password: '', confirmPassword: '' }
}

// 【API接口】登录请求
const handleLogin = async () => {
  try {
    console.log('登录数据:', loginForm.value)
    
    // TODO: 调用登录API
    // const response = await fetch('YOUR_API_ENDPOINT/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(loginForm.value)
    // })
    // const data = await response.json()
    // if (data.success) {
    //   // 保存token
    //   localStorage.setItem('token', data.token)
    //   // 跳转到主页
    //   router.push('/')
    // } else {
    //   alert(data.message)
    // }
    
    alert('登录功能待实现，当前为静态界面')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录请求失败')
  }
}

// 【API接口】注册请求
const handleRegister = async () => {
  // 验证密码匹配
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    console.log('注册数据:', registerForm.value)
    
    // TODO: 调用注册API
    // const response = await fetch('YOUR_API_ENDPOINT/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     username: registerForm.value.username,
    //     email: registerForm.value.email,
    //     password: registerForm.value.password
    //   })
    // })
    // const data = await response.json()
    // if (data.success) {
    //   alert('注册成功，请登录')
    //   toggleMode()
    // } else {
    //   alert(data.message)
    // }
    
    alert('注册功能待实现，当前为静态界面')
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册请求失败')
  }
}

// 【API接口】第三方登录（预留）
const handleThirdPartyLogin = (provider) => {
  console.log(`${provider} 登录`)
  
  // TODO: 调用第三方登录API
  // window.location.href = `YOUR_API_ENDPOINT/oauth/${provider}`
  
  alert(`${provider} 登录功能待实现`)
}

onMounted(() => {
  const updateScreenWidth = () => {
    screenWidth.value = window.innerWidth
  }
  window.addEventListener('resize', updateScreenWidth)
  
  // Android WebView特殊处理
  if (isAndroidWebView.value) {
    setTimeout(() => {
      console.log('Android WebView环境检测完成')
    }, 100)
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <!-- 登录/注册卡片 -->
    <div 
      class="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
      :class="effectiveIsLargeScreen ? 'w-full max-w-md' : 'w-full max-w-sm'"
    >
      <!-- Logo 区域 -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">AAA助手</h1>
        <p class="text-blue-100 mt-2">{{ mode === 'login' ? '欢迎回来' : '创建新账户' }}</p>
      </div>

      <!-- 表单区域 -->
      <div class="p-8">
        <!-- 登录表单 -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入用户名"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入密码"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span class="ml-2 text-gray-600">记住我</span>
            </label>
            <a href="#" class="text-blue-500 hover:text-blue-600">忘记密码?</a>
          </div>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            登录
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              v-model="registerForm.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入邮箱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入密码"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请再次输入密码"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            注册
          </button>
        </form>


        <!-- 分隔线 -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        <!-- 第三方登录（预留接口） -->
        <div class="space-y-3">
          <button
            @click="handleThirdPartyLogin('wechat')"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5 12c0 .83-.67 1.5-1.5 1.5S5.5 12.83 5.5 12s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm6 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
            </svg>
            <span class="text-gray-700">微信登录</span>
          </button>
        </div>

        <!-- 切换模式 -->
        <div class="mt-6 text-center">
          <button
            @click="toggleMode"
            class="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            {{ mode === 'login' ? '还没有账户？立即注册' : '已有账户？返回登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 移动端优化 */
@media (max-width: 640px) {
  input {
    font-size: 16px; /* 防止iOS自动缩放 */
  }
}

/* Android WebView优化 */
input:focus {
  outline: none;
}
</style>
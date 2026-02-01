<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const profileForm = ref({
  username: '',
  diseaseName: ''
})

const avoidFoods = ref(['海鲜', '辛辣'])
const newAvoidFood = ref('')

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const avatarFile = ref(null)
const avatarPreviewUrl = ref('')

const isLargeScreen = useMediaQuery('(min-width: 768px)')
const screenWidth = ref(window.innerWidth)
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

const isAndroidWebView = computed(() => {
  return /android/i.test(navigator.userAgent) && /wv/i.test(navigator.userAgent)
})

const effectiveIsLargeScreen = computed(() => {
  if (isLargeScreen.value !== null) {
    return isLargeScreen.value
  }
  return screenWidth.value >= 768
})

const onPickAvatar = () => {
  const input = document.getElementById('avatar-input')
  if (input) input.click()
}

const onAvatarChange = (event) => {
  const file = event?.target?.files?.[0]
  if (!file) return

  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }

  avatarFile.value = file
  avatarPreviewUrl.value = URL.createObjectURL(file)
}

const addAvoidFood = () => {
  const value = newAvoidFood.value.trim()
  if (!value) return
  if (avoidFoods.value.includes(value)) {
    newAvoidFood.value = ''
    return
  }
  avoidFoods.value = [...avoidFoods.value, value].slice(0, 20)
  newAvoidFood.value = ''
}

const removeAvoidFood = (value) => {
  avoidFoods.value = avoidFoods.value.filter((item) => item !== value)
}

const saveProfile = async () => {
  try {
    console.log('保存用户设置:', {
      ...profileForm.value,
      avoidFoods: avoidFoods.value,
      avatarFile: avatarFile.value
    })
    alert('保存功能待实现，当前为静态界面')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败')
  }
}

const changePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    alert('请填写完整密码信息')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }

  try {
    console.log('修改密码:', { ...passwordForm.value })
    alert('修改密码功能待实现，当前为静态界面')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败')
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  updateScreenWidth()

  if (isAndroidWebView.value) {
    setTimeout(() => {
      console.log('Android WebView环境检测完成')
    }, 100)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div
      class="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
      :class="effectiveIsLargeScreen ? 'w-full max-w-2xl' : 'w-full max-w-sm'"
    >
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
        <div class="flex items-center gap-5">
          <div class="relative shrink-0">
            <div class="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-md">
              <img
                v-if="avatarPreviewUrl"
                :src="avatarPreviewUrl"
                alt="avatar"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                class="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0zm3 10H6a7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-white">用户设置</h1>
            <p class="text-blue-100 mt-1">头像、账号与健康偏好设置</p>
          </div>

          <div class="shrink-0">
            <input id="avatar-input" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
            <button
              type="button"
              @click="onPickAvatar"
              class="px-4 py-2 bg-white/15 text-white rounded-lg border border-white/25 hover:bg-white/20 transition-all active:scale-95"
            >
              更换头像
            </button>
          </div>
        </div>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              v-model="profileForm.username"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">患病名称</label>
            <input
              v-model="profileForm.diseaseName"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="例如：糖尿病 / 高血压 / 痛风"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">忌口食品</label>
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="food in avoidFoods"
                :key="food"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
              >
                <span class="text-sm">{{ food }}</span>
                <button
                  type="button"
                  class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  @click="removeAvoidFood(food)"
                >
                  ×
                </button>
              </span>
            </div>

            <div class="flex gap-2">
              <input
                v-model="newAvoidFood"
                type="text"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="输入食品名称后添加"
                @keydown.enter.prevent="addAvoidFood"
              />
              <button
                type="button"
                class="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                @click="addAvoidFood"
              >
                添加
              </button>
            </div>
          </div>

          <button
            type="button"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            @click="saveProfile"
          >
            保存设置
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">修改密码</span>
          </div>
        </div>

        <form class="space-y-5" @submit.prevent="changePassword">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入当前密码"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入新密码"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请再次输入新密码"
            />
          </div>

          <button
            type="submit"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95 font-semibold text-gray-700"
          >
            确认修改
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  input {
    font-size: 16px;
  }
}

input:focus {
  outline: none;
}
</style>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center shadow-sm sticky top-0 z-10">
      <button 
        class="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        @click="goBack"
      >
        <ArrowLeft size="24" />
      </button>
      <h1 class="text-lg font-bold text-gray-800 flex-1 text-center pr-8">个人设置</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
      
      <!-- Avatar Section -->
      <div class="flex flex-col items-center justify-center pt-2">
        <div class="relative group cursor-pointer" @click="onPickAvatar">
          <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 relative">
            <img
              v-if="avatarPreviewUrl"
              :src="avatarPreviewUrl"
              alt="avatar"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
              <User size="40" />
            </div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"></div>
          </div>
          
          <!-- Camera Icon Badge -->
          <div class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white shadow-sm hover:bg-primary/90 transition-colors">
            <Camera size="16" />
          </div>
          
          <input id="avatar-input" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
        </div>
        <p class="mt-3 text-sm text-gray-500">点击头像更换</p>
      </div>

      <!-- Basic Profile Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 class="font-bold text-gray-800 flex items-center gap-2">
          <UserCircle size="20" class="text-primary" />
          基本信息
        </h2>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              v-model="profileForm.username"
              type="text"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="请输入用户名"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">患病名称</label>
            
            <!-- Diseases Tags List -->
            <div class="flex flex-wrap gap-2 mb-2" v-if="profileForm.diseases.length > 0">
              <span
                v-for="disease in profileForm.diseases"
                :key="disease"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-sm font-medium animate-in fade-in zoom-in duration-200"
              >
                {{ disease }}
                <button
                  type="button"
                  class="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                  @click="removeDisease(disease)"
                >
                  <X size="14" />
                </button>
              </span>
            </div>

            <!-- Add Disease Input -->
            <div class="flex gap-2">
              <input
                v-model="newDisease"
                type="text"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="添加患病名称（按回车）"
                @keydown.enter.prevent="addDisease"
              />
              <button
                type="button"
                class="px-4 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors flex items-center justify-center"
                @click="addDisease"
              >
                <Plus size="20" />
              </button>
            </div>
          </div>

          <!-- Avoid Foods -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">忌口食品</label>
            
            <!-- Tags List -->
            <div class="flex flex-wrap gap-2 mb-2" v-if="avoidFoods.length > 0">
              <span
                v-for="food in avoidFoods"
                :key="food"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium animate-in fade-in zoom-in duration-200"
              >
                {{ food }}
                <button
                  type="button"
                  class="p-0.5 hover:bg-red-100 rounded-full transition-colors"
                  @click="removeAvoidFood(food)"
                >
                  <X size="14" />
                </button>
              </span>
            </div>
            
            <!-- Add Input -->
            <div class="flex gap-2">
              <input
                v-model="newAvoidFood"
                type="text"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="添加忌口（按回车）"
                @keydown.enter.prevent="addAvoidFood"
              />
              <button
                type="button"
                class="px-4 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors flex items-center justify-center"
                @click="addAvoidFood"
              >
                <Plus size="20" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
          @click="saveProfile"
        >
          保存个人信息
        </button>
      </div>

      <!-- Security Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 class="font-bold text-gray-800 flex items-center gap-2">
          <Lock size="20" class="text-primary" />
          安全设置
        </h2>

        <div class="space-y-2">
          <p class="text-sm text-gray-500">定期修改密码可以提高账号安全性</p>
          <button
            type="button"
            class="w-full py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            @click="showPasswordModal = true"
          >
            <Lock size="18" />
            修改密码
          </button>
        </div>
      </div>
      
      <!-- Logout Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <button
          type="button"
          class="w-full py-3.5 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          @click="handleLogout"
        >
          <LogOut size="18" />
          退出登录
        </button>
      </div>

      <!-- Safe Area for bottom spacing -->
      <div class="h-6"></div>
    </main>

    <!-- Password Modal -->
    <Teleport to="body">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="showPasswordModal = false"></div>
        
        <!-- Modal Content -->
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800">修改密码</h3>
            <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="showPasswordModal = false">
              <X size="24" />
            </button>
          </div>
          
          <form class="space-y-4" @submit.prevent="changePassword">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">当前密码</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="请输入当前密码"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">新密码</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="请输入新密码"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">确认新密码</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="请再次输入新密码"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                class="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
              >
                确认修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Camera, User, UserCircle, Lock, Plus, X, LogOut } from 'lucide-vue-next'
import { showToast } from 'vant'
import { useUserStore } from '@/store/user'
import { updateSetting, changePassword as apiChangePassword } from '@/api/auth'
import { fileToBase64 } from '@/utils/helper'

const router = useRouter()
const userStore = useUserStore()

const profileForm = ref({
  username: '',
  diseases: []
})
const newDisease = ref('')

const avoidFoods = ref([])
const newAvoidFood = ref('')

const showPasswordModal = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const avatarFile = ref(null)
const avatarPreviewUrl = ref('')

onMounted(() => {
  profileForm.value.username = userStore.username || ''
  profileForm.value.diseases = userStore.sick ? userStore.sick.split('|#|').filter(Boolean) : []
  avoidFoods.value = userStore.taboo ? userStore.taboo.split('|#|').filter(Boolean) : []
  if (userStore.avatar) {
    avatarPreviewUrl.value = userStore.avatar
  }
})

const goBack = () => {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const onPickAvatar = () => {
  const input = document.getElementById('avatar-input')
  if (input) input.click()
}

const onAvatarChange = (event) => {
  const file = event?.target?.files?.[0]
  if (!file) return

  if (avatarPreviewUrl.value && avatarPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }

  avatarFile.value = file
  avatarPreviewUrl.value = URL.createObjectURL(file)
}

const addDisease = () => {
  const value = newDisease.value.trim()
  if (!value) return
  if (profileForm.value.diseases.includes(value)) {
    newDisease.value = ''
    return
  }
  profileForm.value.diseases = [...profileForm.value.diseases, value].slice(0, 20)
  newDisease.value = ''
}

const removeDisease = (value) => {
  profileForm.value.diseases = profileForm.value.diseases.filter((item) => item !== value)
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
    let finalAvatar = userStore.avatar; // 默认使用当前存储的头像

    // 只有当用户选择了新文件时，才进行转换和更新
    if (avatarFile.value) {
      try {
        finalAvatar = await fileToBase64(avatarFile.value);
        // 可选：调试打印，确认转换后的字符串长度是否正常
        // console.log('New Avatar Length:', finalAvatar.length);
      } catch (e) {
        console.error('图片转换失败', e);
        showToast('图片处理失败，请重试');
        return;
      }
    } else {
      // 如果没有选择新图片，finalAvatar 保持为 userStore.avatar
      // 如果 userStore.avatar 也是空的，说明用户本来就没有头像，这通常是合法的
      console.log('未更换头像，使用现有头像或空值');
    }

    const sickStr = profileForm.value.diseases.join('|#|');
    const tabooStr = avoidFoods.value.join('|#|');

    // 构造提交数据
    const payload = {
      userid: userStore.userId,
      username: profileForm.value.username,
      sick: sickStr,
      taboo: tabooStr,
      // 关键点：确保这里传的是最终确定的值
      avatar: finalAvatar
    };

    // 调试：在发送前打印查看
    console.log('Submitting payload:', payload);

    // 如果后端严格要求不能传空字符串表示“不修改”，你可能需要在这里删除该字段
    // if (!avatarFile.value) { delete payload.avatar; }

    await updateSetting(payload);

    // 更新本地 Store
    userStore.username = profileForm.value.username;
    userStore.sick = sickStr;
    userStore.taboo = tabooStr;
    // 只有当确实有新值（或者是原本就有值）时才更新，避免意外清空
    userStore.avatar = finalAvatar;

    const oldToken =userStore.token;
    localStorage.setItem("token" ,updateToken(oldToken,finalAvatar));

    showToast('设置已保存');
  } catch (error) {
    console.error(error);
    showToast(error?.message || '保存失败');
  }
}

const changePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    showToast('请填写完整密码信息')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showToast('两次输入的新密码不一致')
    return
  }

  try {
    await apiChangePassword(
      userStore.userId,
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    showToast('密码修改成功')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    showPasswordModal.value = false
  } catch (error) {
    showToast(error?.message || '修改密码失败')
  }
}


function updateToken(rawToken,avatar) {

  const decodedOuter = rawToken;

  const SEPARATOR = '|#|';

  const parts = decodedOuter.split(SEPARATOR);

  if (parts.length !== 3) {
    throw new Error(`Token 格式错误：期望 3 个部分，实际得到 ${parts.length}`);
  }

  return parts[0]+"|#|"+parts[1]+"|#|"+avatar;
}


const handleLogout = () => {
  userStore.logout()
  router.replace('/login')
}

onUnmounted(() => {
  if (avatarPreviewUrl.value && avatarPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }
})
</script>

<style scoped>
/* Scoped styles kept minimal */
</style>

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
      <h1 class="text-lg font-bold text-gray-800 flex-1 text-center pr-8">三餐分析</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 max-w-lg mx-auto w-full">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- 1. Meal Type Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">餐型选择</label>
          <div class="grid grid-cols-3 gap-3">
            <label 
              v-for="type in mealTypes" 
              :key="type.value"
              class="relative cursor-pointer group"
            >
              <input
                type="radio"
                v-model="form.mealType"
                :value="type.value"
                class="peer sr-only"
              />
              <div class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                border-gray-200 bg-white text-gray-600
                peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary
                group-hover:border-gray-300 peer-checked:group-hover:border-primary">
                <span class="text-2xl mb-1">{{ type.icon }}</span>
                <span class="text-sm font-medium">{{ type.label }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 2. Food Name Input -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">食物名称</label>
          <input
            type="text"
            v-model="form.foodName"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400
            focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="例如：牛肉面、沙拉..."
            maxlength="50"
          />
        </div>

        <!-- 3. Image Upload -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">食物图片</label>
          
          <!-- Image Preview -->
          <div v-if="form.imageUrl" class="relative w-full aspect-square sm:aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
            <img :src="form.imageUrl" alt="食物预览" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            <button 
              type="button" 
              class="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
              @click="deleteImage"
            >
              <X size="18" />
            </button>
          </div>

          <!-- Upload Button -->
          <button 
            v-else
            type="button" 
            class="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400
            hover:border-primary hover:text-primary hover:bg-primary/5 transition-all gap-3 bg-white"
            @click="selectImage"
          >
            <CameraIcon size="32" stroke-width="1.5" />
            <span class="text-sm font-medium">拍照或选择图片</span>
          </button>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 
            active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            :disabled="!form.mealType || !form.foodName || !form.imageUrl"
          >
            提交记录
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, CameraResultType } from '@capacitor/camera'
import { X, ArrowLeft, Camera as CameraIcon } from 'lucide-vue-next'

const router = useRouter()

const mealTypes = [
  { value: 'breakfast', label: '早餐', icon: '🍳' },
  { value: 'lunch', label: '午餐', icon: '🍱' },
  { value: 'dinner', label: '晚餐', icon: '🥗' }
]

const form = ref({
  mealType: '',
  foodName: '',
  imageUrl: ''
})

const goBack = () => {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const selectImage = async () => {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      quality: 80,
      allowEditing: true,
      width: 800, // Increased resolution slightly
      height: 800
    })
    console.log('Image captured:', image)
    form.value.imageUrl = image.webPath
  } catch (error) {
    console.error('图片选择失败：', error)
    // alert('图片选择失败，请重新尝试') // Optional: remove alert for cleaner UX
  }
}

const deleteImage = () => {
  form.value.imageUrl = ''
}

const onSubmit = () => {
  const mealTypeLabels = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐'
  }
  
  const submitData = {
    mealType: mealTypeLabels[form.value.mealType],
    foodName: form.value.foodName,
    imageUrl: form.value.imageUrl,
    time: new Date().toLocaleString()
  }
  
  console.log('提交的记录：', submitData)
  alert('记录提交成功！\n' + JSON.stringify(submitData, null, 2))
  
  // Reset form
  form.value = { mealType: '', foodName: '', imageUrl: '' }
  router.push('/')
}
</script>

<style scoped>
/* Scoped styles can be removed or minimal if using Tailwind completely */
</style>

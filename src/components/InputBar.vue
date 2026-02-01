<script setup>
import { Plus, Mic, Send } from 'lucide-vue-next'
import { Camera, CameraResultType } from '@capacitor/camera'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputValue = ref('')

async function takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })
    console.log('Image captured:', image)
    // Here you would typically handle the image, e.g., display it or upload it
    alert('图片已获取: ' + image.webPath)
  } catch (error) {
    console.error('Camera error:', error)
  }
}
// 第二步：再定义使用router的函数
function handleClick(buttonText) {
  console.log('点击了按钮:', buttonText)
  if (buttonText === 'FoodRecord') {
      router.push({ name: 'FoodRecord' })
      console.log('路由跳转指令已发送，目标路由：FoodRecord')
  }
  if (buttonText === 'SnackAnalysis') {
      router.push({ name: 'SnackAnalysis' })
      console.log('路由跳转指令已发送，目标路由：SnackAnalysis')
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 pb-4">
    <!-- Functional Buttons -->
    <div class="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
      <!-- 第一个功能按钮 -->
      <button class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary/50 transition-colors whitespace-nowrap shadow-sm"  @click="handleClick('FoodRecord')">
        三餐分析
      </button>
      <!-- 第二个功能按钮 -->
      <button class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary/50 transition-colors whitespace-nowrap shadow-sm"  @click="handleClick('SnackAnalysis')">
        零食分析
      </button>
      <!-- 第三个功能按钮 -->
      <button class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary/50 transition-colors whitespace-nowrap shadow-sm">
        功能三
      </button>
      <!-- 第四个功能按钮 -->
      <button class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary/50 transition-colors whitespace-nowrap shadow-sm">
        功能四
      </button>
    </div>

    <!-- Input Area -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex items-end gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
      <!-- Add Button -->
      <button 
        @click="takePicture"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        title="上传图片"
      >
        <Plus :size="24" />
      </button>

      <!-- Text Input -->
      <textarea 
        v-model="inputValue"
        placeholder="向AAA提问"
        rows="1"
        class="flex-1 max-h-32 py-3 bg-transparent border-none outline-none text-gray-700 resize-none placeholder:text-gray-400"
        @input="$event.target.style.height = 'auto'; $event.target.style.height = $event.target.scrollHeight + 'px'"
      ></textarea>

      <!-- Right Actions -->
      <div class="flex items-center gap-1 pb-1">
        <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="语音输入">
          <Mic :size="22" />
        </button>
        <button 
          class="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!inputValue.trim()"
        >
          <Send :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

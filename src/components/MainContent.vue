<script setup>
import InputBar from './InputBar.vue'
import { Menu } from 'lucide-vue-next'
import { useSidebarStore } from '../store/sidebar'
import { ref, onMounted } from 'vue'

const sidebarStore = useSidebarStore()
const hasUserInteracted = ref(false)

// 添加触摸事件处理
const handleMenuClick = (event) => {
  event.preventDefault()
  event.stopPropagation()

  // 标记用户已交互
  if (!hasUserInteracted.value) {
    hasUserInteracted.value = true
  }

  // 只有在用户交互后才添加触觉反馈
  if (hasUserInteracted.value && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10)
    } catch (error) {
      // 忽略触觉反馈错误
      console.warn('触觉反馈不可用:', error)
    }
  }

  // 切换侧边栏状态
  sidebarStore.toggle()
}

// 添加触摸事件监听
onMounted(() => {
  const menuButton = document.querySelector('.menu-button')
  if (menuButton) {
    // 添加触摸事件处理
    menuButton.addEventListener('touchstart', handleMenuClick, { passive: false })

    // 添加点击事件来标记用户交互
    menuButton.addEventListener('click', () => {
      hasUserInteracted.value = true
    })
  }
})
</script>

<template>
  <div class="flex flex-col h-full relative">
    <!-- Header (Mobile Menu Trigger) -->
    <div class="absolute top-0 left-0 p-4 z-10 md:hidden">
      <button
          @click="handleMenuClick"
          class="menu-button p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors select-none"
          style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
      >
        <Menu :size="24" />
      </button>
    </div>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col items-center justify-center p-4">
      <div class="text-center mb-12">
        <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg shadow-primary/30">
          A
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">你好，我是AAA</h1>
        <p class="text-gray-500">我可以帮你写代码、解答问题、激发灵感</p>
      </div>
    </div>

    <!-- Input Section -->
    <InputBar />
  </div>
</template>

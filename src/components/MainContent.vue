<script setup>
import InputBar from './InputBar.vue'
import { Menu } from 'lucide-vue-next'
import { useSidebarStore } from '../store/sidebar'

const sidebarStore = useSidebarStore()
</script>

<template>
  <div class="flex flex-col h-full relative">
    <!-- Header (Mobile Menu Trigger) -->
    <div class="absolute top-0 left-0 p-4 z-10 md:hidden">
      <button 
        @click="sidebarStore.toggle()"
        class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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

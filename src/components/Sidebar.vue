<script setup>
import { MessageSquarePlus, MessageSquare, User } from 'lucide-vue-next'

const recentChats = [
  '如何做番茄炒蛋',
  'Vue3 响应式原理',
  '写一首关于春天的诗',
  '周末去哪里玩',
  '解释量子纠缠'
]
</script>

<template>
  <div class="w-64 h-full bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-gray-100">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mr-2 shadow-sm">
        A
      </div>
      <span class="text-xl font-bold text-gray-800">AAA</span>
    </div>

    <!-- New Chat Button -->
    <div class="p-4">
      <button class="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 py-2.5 rounded-lg transition-colors font-medium">
        <MessageSquarePlus :size="20" />
        <span>新对话</span>
      </button>
    </div>

    <!-- Categories / Tags -->
    <div class="px-4 pb-2">
      <div class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">最近对话</div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto px-2 space-y-1">
      <button 
        v-for="(chat, index) in recentChats" 
        :key="index"
        class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 truncate transition-colors group"
      >
        <MessageSquare :size="16" class="shrink-0 text-gray-400 group-hover:text-gray-600" />
        <span class="truncate">{{ chat }}</span>
      </button>
    </div>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-gray-100 space-y-2">
        <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <User :size="18" class="text-gray-500" />
            <span>我的空间</span>
        </button>
    </div>
  </div>
</template>

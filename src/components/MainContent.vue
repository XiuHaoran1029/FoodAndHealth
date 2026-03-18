<script setup>
import InputBar from './InputBar.vue'
import { Menu } from 'lucide-vue-next'
import { useSidebarStore } from '../store/sidebar'
import { ref, watch, onMounted, nextTick } from 'vue'
import { getMessageList } from '@/api/message'
import { useUserStore } from '@/store/user'
import { showToast } from 'vant'
import { extractAndNormalizeMessages, normalizeMessage } from '@/utils/messageNormalization'

const props = defineProps({
  conversationId: {
    type: Number,
    default: null
  }
})

const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const hasUserInteracted = ref(false)
const messages = ref([])
const messagesContainer = ref(null)

// 添加触摸事件处理
const handleMenuClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  if (!hasUserInteracted.value) hasUserInteracted.value = true
  if (hasUserInteracted.value && 'vibrate' in navigator) {
    try { navigator.vibrate(10) } catch (e) { /* ignore */ }
  }
  sidebarStore.toggle()
}

onMounted(() => {
  const menuButton = document.querySelector('.menu-button')
  if (menuButton) {
    menuButton.addEventListener('touchstart', handleMenuClick, { passive: false })
    menuButton.addEventListener('click', () => { hasUserInteracted.value = true })
  }
})

async function loadMessages(conversationId) {
  if (!conversationId) return
  try {
    const res = await getMessageList(conversationId, userStore.userId)
    
    console.log('API Response:', res)
    
    // 使用工具函数提取和标准化消息
    const normalizedMessages = extractAndNormalizeMessages(res)
    
    messages.value = normalizedMessages
    await nextTick()
    scrollToBottom()
  } catch (e) {
    console.error('Load messages error:', e)
    showToast(e.message || '加载消息失败')
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function appendMessage(msg) {
  const normalizedMsg = normalizeMessage(msg)
  if (normalizedMsg) {
    messages.value.push(normalizedMsg)
    console.log('Appended message:', normalizedMsg)
    nextTick(scrollToBottom)
  }
}

watch(() => props.conversationId, (newId) => {
  messages.value = []
  loadMessages(newId)
}, { immediate: true })

defineExpose({ appendMessage })
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

    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 pt-16 pb-2 space-y-4"
    >
      <!-- Empty state -->
      <div v-if="!conversationId || messages.length === 0" class="flex flex-col items-center justify-center h-full">
        <div class="text-center mb-12">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg shadow-primary/30">
            A
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">你好，我是AAA</h1>
          <p class="text-gray-500">我可以帮你写代码、解答问题、激发灵感</p>
        </div>
      </div>

      <!-- Message list -->
      <template v-else>
        <div
          v-for="msg in messages"
          :key="msg.id || msg.sequence"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- AI avatar -->
          <div v-if="msg.role !== 'user'" class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-2 shrink-0 self-end">
            A
          </div>
          <div
            class="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
            :class="msg.role === 'user'
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'"
          >
            <!-- Image preview if present -->
            <img v-if="msg.img && msg.role === 'user'" :src="msg.img" class="max-w-full rounded-lg mb-2" />
            {{ msg.content }}
          </div>
        </div>
      </template>
    </div>

    <!-- Input Section -->
    <InputBar :conversation-id="conversationId" @message-sent="appendMessage" />
  </div>
</template>

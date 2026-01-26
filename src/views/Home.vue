<script setup>
import Sidebar from '../components/Sidebar.vue'
import MainContent from '../components/MainContent.vue'
import { useSidebarStore } from '../store/sidebar'
import { storeToRefs } from 'pinia'
import { useMediaQuery } from '@vueuse/core'
import { watch, onMounted } from 'vue'

const sidebarStore = useSidebarStore()
const { isOpen } = storeToRefs(sidebarStore)
const isLargeScreen = useMediaQuery('(min-width: 768px)')

// Initialize sidebar state based on screen size
onMounted(() => {
    if (!isLargeScreen.value) {
        sidebarStore.setOpen(false)
    }
})

// Watch screen size changes
watch(isLargeScreen, (newVal) => {
    if (newVal) {
        sidebarStore.setOpen(true)
    } else {
        sidebarStore.setOpen(false)
    }
})
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden relative">
    <!-- Mobile Overlay -->
    <div 
      v-if="!isLargeScreen && isOpen" 
      class="fixed inset-0 bg-black/50 z-20 transition-opacity"
      @click="sidebarStore.setOpen(false)"
    ></div>

    <!-- Sidebar -->
    <Sidebar 
      class="transition-transform duration-300 ease-in-out z-30"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isLargeScreen ? 'relative translate-x-0' : 'fixed inset-y-0 left-0'
      ]" 
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full w-full relative transition-all duration-300">
      <MainContent />
    </div>
  </div>
</template>

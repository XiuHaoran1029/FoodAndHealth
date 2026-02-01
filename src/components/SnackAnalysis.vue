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
      <h1 class="text-lg font-bold text-gray-800 flex-1 text-center pr-8">添加零食</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 max-w-lg mx-auto w-full">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- 零食名称输入框 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">零食名称</label>
          <input
              v-model="form.name"
              type="text"
              placeholder="请输入零食名称（如可乐、薯片）"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
          />
        </div>

        <!-- 零食种类选择 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">零食种类</label>
          <div class="grid grid-cols-2 gap-3">
            <label
                class="relative cursor-pointer group"
            >
              <input
                  type="radio"
                  name="snackType"
                  value="drink"
                  v-model="form.type"
                  class="peer sr-only"
                  required
              />
              <div class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                border-gray-200 bg-white text-gray-600
                peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary
                group-hover:border-gray-300 peer-checked:group-hover:border-primary">
                <Coffee size="24" class="mb-1" />
                <span class="text-sm font-medium">饮品</span>
              </div>
            </label>
            <label
                class="relative cursor-pointer group"
            >
              <input
                  type="radio"
                  name="snackType"
                  value="bag"
                  v-model="form.type"
                  class="peer sr-only"
                  required
              />
              <div class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                border-gray-200 bg-white text-gray-600
                peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary
                group-hover:border-gray-300 peer-checked:group-hover:border-primary">
                <Package size="24" class="mb-1" />
                <span class="text-sm font-medium">袋装零食</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 数量输入框 + 联动单位 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">数量</label>
          <div class="flex items-center gap-3">
            <input
                v-model.number="form.num"
                type="number"
                min="1"
                step="1"
                placeholder="请输入数量"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
            />
            <!-- 单位展示：根据种类自动切换，禁用状态美化 -->
            <div class="px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-200 w-20 text-center font-medium">
              {{ form.type === 'drink' ? 'ml' : form.type === 'bag' ? 'g' : '-' }}
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="pt-4">
          <button
              type="submit"
              class="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 
              active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              :disabled="!form.name || !form.type || !form.num"
          >
            提交保存
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ArrowLeft, Coffee, Package } from 'lucide-vue-next'

const router = useRouter()

// 保留原有返回功能
const goBack = () => {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

// 表单核心数据：绑定视图，type联动单位
const form = ref({
  name: '', // 零食名称
  type: '', // 种类：drink(饮品)/bag(袋装零食)
  num: ''   // 数量（数字类型）
})

// 表单提交处理函数
const onSubmit = () => {
  // 基础校验
  if (!form.value.name || !form.value.type || !form.value.num || form.value.num < 1) {
    return
  }

  // 构造最终提交数据
  const submitData = {
    ...form.value,
    unit: form.value.type === 'drink' ? 'ml' : 'g', // 自动生成单位
    typeName: form.value.type === 'drink' ? '饮品' : '袋装零食' // 种类中文名称
  }

  // *************************
  // 此处替换为你的实际业务逻辑：
  // 如调用接口保存、存入localStorage、跳转到列表页等
  // *************************
  console.log('零食提交数据：', submitData)
  
  alert('零食添加成功！\n' + JSON.stringify(submitData, null, 2))

  // 重置表单并返回
  form.value = { name: '', type: '', num: '' }
  router.push('/')
}
</script>

<style scoped>
/* Scoped styles can be removed or minimal if using Tailwind completely */
</style>

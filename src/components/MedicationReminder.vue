<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, X, Pill, Calendar, Clock, Check } from 'lucide-vue-next'
import { showToast } from 'vant'
import { sendMessage } from '@/api/message'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  medicineName: '',
  dailyTimes: '',
  dosePills: '',
  endDate: ''
})

const touched = ref({
  medicineName: false,
  dailyTimes: false,
  dosePills: false,
  endDate: false
})

const commonMedicines = [
  '阿莫西林', '头孢克肟', '布洛芬', '对乙酰氨基酚', '奥美拉唑',
  '氯雷他定', '西替利嗪', '甲硝唑', '蒙脱石散', '维生素C',
  '复方甘草片', '氨溴索', '阿昔洛韦', '二甲双胍', '阿托伐他汀'
]

const suggestionsOpen = ref(false)
const suggestionsLoading = ref(false)
const medicineFocused = ref(false)

const today = computed(() => {
  const d = new Date()
  const y = String(d.getFullYear())
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const filteredSuggestions = computed(() => {
  const q = form.value.medicineName.trim().toLowerCase()
  if (!q) return []
  return commonMedicines
    .filter((name) => name.toLowerCase().includes(q))
    .slice(0, 8)
})

function goBack() {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

function markTouched(key) {
  touched.value[key] = true
}

function sanitizePositiveInt(input) {
  const raw = String(input ?? '').replace(/[^\d]/g, '')
  if (!raw) return ''
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return ''
  return String(Math.floor(n))
}

function onDailyTimesInput(e) {
  form.value.dailyTimes = sanitizePositiveInt(e?.target?.value)
  touched.value.dailyTimes = true
}

function onDosePillsInput(e) {
  form.value.dosePills = sanitizePositiveInt(e?.target?.value)
  touched.value.dosePills = true
}

const errors = computed(() => {
  const e = {
    medicineName: '',
    dailyTimes: '',
    dosePills: '',
    endDate: ''
  }

  const name = form.value.medicineName.trim()
  if (!name) e.medicineName = '请输入药品名称'

  const daily = Number(form.value.dailyTimes)
  if (!form.value.dailyTimes) e.dailyTimes = '请输入每日次数'
  else if (!Number.isInteger(daily) || daily <= 0) e.dailyTimes = '需为正整数'

  const dose = Number(form.value.dosePills)
  if (!form.value.dosePills) e.dosePills = '请输入单次粒数'
  else if (!Number.isInteger(dose) || dose <= 0) e.dosePills = '需为正整数'

  const end = form.value.endDate
  if (!end) e.endDate = '请选择停药日期'
  else if (end < today.value) e.endDate = '停药日期不能早于今天'

  return e
})

const canSave = computed(() => {
  return !errors.value.medicineName && !errors.value.dailyTimes && !errors.value.dosePills && !errors.value.endDate
})

function clearForm() {
  form.value = {
    medicineName: '',
    dailyTimes: '',
    dosePills: '',
    endDate: ''
  }
  touched.value = {
    medicineName: false,
    dailyTimes: false,
    dosePills: false,
    endDate: false
  }
  suggestionsOpen.value = false
  medicineFocused.value = false
}

function onPickSuggestion(name) {
  form.value.medicineName = name
  suggestionsOpen.value = false
  medicineFocused.value = false
  nextTick(() => {
    const el = document.getElementById('daily-times-input')
    if (el) el.focus()
  })
}

function onMedicineFocus() {
  medicineFocused.value = true
  suggestionsOpen.value = true
}

function onMedicineBlur() {
  medicineFocused.value = false
  window.setTimeout(() => {
    suggestionsOpen.value = false
  }, 120)
}

function onClearMedicine() {
  form.value.medicineName = ''
  suggestionsOpen.value = false
  markTouched('medicineName')
  nextTick(() => {
    const el = document.getElementById('medicine-name-input')
    if (el) el.focus()
  })
}

const dateInputRef = ref(null)

function openDatePicker() {
  markTouched('endDate')
  const el = dateInputRef.value
  if (!el) return
  if (typeof el.showPicker === 'function') {
    el.showPicker()
    return
  }
  if (typeof el.click === 'function') {
    el.click()
  }
  if (typeof el.focus === 'function') {
    el.focus()
  }
}

async function onSave() {
  touched.value = {
    medicineName: true,
    dailyTimes: true,
    dosePills: true,
    endDate: true
  }

  if (!canSave.value) return

  const payload = {
    ...form.value,
    dailyTimes: Number(form.value.dailyTimes),
    dosePills: Number(form.value.dosePills),
    createdAt: new Date().toISOString()
  }

  try {
    const key = 'medicationPlans'
    const current = JSON.parse(localStorage.getItem(key) || '[]')
    const next = Array.isArray(current) ? [...current, payload] : [payload]
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }

  try {
    await sendMessage({
      userId: userStore.userId,
      content: `用药提醒：${payload.medicineName}，每日${payload.dailyTimes}次，每次${payload.dosePills}粒，截止日期${payload.endDate}`,
      role: 'user',
      function_type: 'medication_reminder'
    })
  } catch {
    // ignore send errors, local save already succeeded
  }

  showToast('添加成功')
  goBack()
}

watch(
  () => form.value.medicineName,
  async (val) => {
    if (!medicineFocused.value) return
    if (!val.trim()) {
      suggestionsOpen.value = false
      return
    }
    suggestionsLoading.value = true
    await new Promise((r) => window.setTimeout(r, 80))
    suggestionsLoading.value = false
    suggestionsOpen.value = true
  }
)
</script>

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
      <h1 class="text-lg font-bold text-gray-800 flex-1 text-center pr-8">添加用药计划</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
      
      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6">
        <h2 class="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Pill size="20" class="text-primary" />
          用药信息
        </h2>

        <!-- Medicine Name -->
        <div class="space-y-2 relative">
          <label class="block text-sm font-medium text-gray-700">
            药品名称 <span class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <input
              id="medicine-name-input"
              v-model="form.medicineName"
              type="text"
              autocomplete="off"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              :class="touched.medicineName && errors.medicineName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
              placeholder="请输入药品通用名 / 商品名"
              @focus="onMedicineFocus"
              @blur="onMedicineBlur"
              @input="markTouched('medicineName')"
            />

            <button
              v-if="form.medicineName"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              @click="onClearMedicine"
            >
              <X size="16" />
            </button>
          </div>

          <!-- Suggestions Dropdown -->
          <div
            v-if="suggestionsOpen && (filteredSuggestions.length || suggestionsLoading)"
            class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20"
          >
            <div v-if="suggestionsLoading" class="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              正在联想...
            </div>
            <button
              v-for="name in filteredSuggestions"
              :key="name"
              type="button"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between group"
              @pointerdown.prevent="onPickSuggestion(name)"
            >
              {{ name }}
              <Check size="14" class="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
            </button>
          </div>

          <p v-if="touched.medicineName && errors.medicineName" class="text-xs text-red-500 flex items-center gap-1">
             {{ errors.medicineName }}
          </p>
        </div>

        <!-- Frequency and Dose Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Daily Times -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              每日次数 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="daily-times-input"
                :value="form.dailyTimes"
                type="number"
                inputmode="numeric"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-10"
                :class="touched.dailyTimes && errors.dailyTimes ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
                placeholder="0"
                @input="onDailyTimesInput"
                @blur="markTouched('dailyTimes')"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">次</span>
            </div>
          </div>

          <!-- Dose Pills -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              单次粒数 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                :value="form.dosePills"
                type="number"
                inputmode="numeric"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-10"
                :class="touched.dosePills && errors.dosePills ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
                placeholder="0"
                @input="onDosePillsInput"
                @blur="markTouched('dosePills')"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">粒</span>
            </div>
          </div>
        </div>
        
        <div v-if="(touched.dailyTimes && errors.dailyTimes) || (touched.dosePills && errors.dosePills)" class="text-xs text-red-500">
           {{ errors.dailyTimes || errors.dosePills }}
        </div>

        <!-- End Date -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            用药截止时间 <span class="text-red-500">*</span>
          </label>
          <div class="relative group cursor-pointer" @click="openDatePicker">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size="18" class="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <input
              :value="form.endDate"
              type="text"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              :class="touched.endDate && errors.endDate ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
              readonly
              placeholder="请选择停药日期"
            />
            <input
              ref="dateInputRef"
              v-model="form.endDate"
              type="date"
              class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              :min="today"
              tabindex="-1"
              @change="markTouched('endDate')"
            />
          </div>
          <p v-if="touched.endDate && errors.endDate" class="text-xs text-red-500">
            {{ errors.endDate }}
          </p>
        </div>

        <div class="bg-blue-50 text-blue-600 text-xs p-3 rounded-xl leading-relaxed flex items-start gap-2">
           <Clock size="14" class="mt-0.5 shrink-0" />
           请准确填写用药信息，避免用药错误；长期用药可选择最远日期。
        </div>

      </div>

      <!-- Action Button -->
      <button
        type="button"
        class="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center gap-2"
        :disabled="!canSave"
        @click="onSave"
      >
        <Check size="20" />
        保存计划
      </button>

      <!-- Safe Area -->
      <div class="h-6"></div>
    </main>
  </div>
</template>

<style scoped>
/* Scoped styles kept minimal */
</style>

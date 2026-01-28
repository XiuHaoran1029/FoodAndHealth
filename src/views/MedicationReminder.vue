<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowLeft, X } from 'lucide-vue-next'

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
  '阿莫西林',
  '头孢克肟',
  '布洛芬',
  '对乙酰氨基酚',
  '奥美拉唑',
  '氯雷他定',
  '西替利嗪',
  '甲硝唑',
  '蒙脱石散',
  '维生素C',
  '复方甘草片',
  '氨溴索',
  '阿昔洛韦',
  '二甲双胍',
  '阿托伐他汀'
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
  if (window.history.length > 1) {
    window.history.back()
    return
  }
  window.location.href = '/'
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
  else if (!Number.isInteger(daily) || daily <= 0) e.dailyTimes = '每日次数需为正整数'

  const dose = Number(form.value.dosePills)
  if (!form.value.dosePills) e.dosePills = '请输入单次粒数'
  else if (!Number.isInteger(dose) || dose <= 0) e.dosePills = '单次粒数需为正整数'

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

function onCancel() {
  clearForm()
  goBack()
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

function onSave() {
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
  }

  window.alert('添加成功')
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
  <div class="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm flex flex-col h-[calc(100vh-2rem)] max-h-[860px]">
      <div class="shrink-0 bg-white border-b border-gray-200">
        <div class="h-14 px-3 flex items-center">
          <button
            type="button"
            class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
            @click="goBack"
            aria-label="返回"
          >
            <ArrowLeft :size="22" />
          </button>

          <div class="flex-1 text-center font-bold text-gray-900 select-none">
            添加用药计划
          </div>

          <div class="w-10 h-10"></div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto bg-gray-50">
        <div class="px-4 pt-4 pb-4">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-5">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              药品名称<span class="text-red-500 ml-1">*</span>
            </label>

            <div class="relative">
              <input
                id="medicine-name-input"
                v-model="form.medicineName"
                type="text"
                autocomplete="off"
                class="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                :class="touched.medicineName && errors.medicineName ? 'border-red-400' : 'border-gray-300'"
                placeholder="请输入药品通用名 / 商品名"
                @focus="onMedicineFocus"
                @blur="onMedicineBlur"
                @input="markTouched('medicineName')"
              />

              <button
                v-if="form.medicineName"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
                @click="onClearMedicine"
                aria-label="清空"
              >
                <X :size="18" />
              </button>

              <div
                v-if="suggestionsOpen && (filteredSuggestions.length || suggestionsLoading)"
                class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10"
              >
                <div v-if="suggestionsLoading" class="px-4 py-3 text-sm text-gray-500">
                  正在联想…
                </div>
                <button
                  v-for="name in filteredSuggestions"
                  :key="name"
                  type="button"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
                  @pointerdown.prevent="onPickSuggestion(name)"
                >
                  {{ name }}
                </button>
              </div>
            </div>

            <div v-if="touched.medicineName && errors.medicineName" class="text-xs text-red-500">
              {{ errors.medicineName }}
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              服用频率<span class="text-red-500 ml-1">*</span>
            </label>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 flex-1">
                <div class="text-sm text-gray-600 shrink-0">每日</div>
                <input
                  id="daily-times-input"
                  :value="form.dailyTimes"
                  type="number"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  step="1"
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  :class="touched.dailyTimes && errors.dailyTimes ? 'border-red-400' : 'border-gray-300'"
                  placeholder="0"
                  @input="onDailyTimesInput"
                  @blur="markTouched('dailyTimes')"
                />
                <div class="text-sm text-gray-600 shrink-0">次</div>
              </div>

              <div class="flex items-center gap-2 flex-1">
                <div class="text-sm text-gray-600 shrink-0">单次</div>
                <input
                  :value="form.dosePills"
                  type="number"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  step="1"
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  :class="touched.dosePills && errors.dosePills ? 'border-red-400' : 'border-gray-300'"
                  placeholder="0"
                  @input="onDosePillsInput"
                  @blur="markTouched('dosePills')"
                />
                <div class="text-sm text-gray-600 shrink-0">粒</div>
              </div>
            </div>

            <div v-if="(touched.dailyTimes && errors.dailyTimes) || (touched.dosePills && errors.dosePills)" class="text-xs text-red-500">
              <span v-if="touched.dailyTimes && errors.dailyTimes">{{ errors.dailyTimes }}</span>
              <span v-else-if="touched.dosePills && errors.dosePills">{{ errors.dosePills }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              用药截至时间<span class="text-red-500 ml-1">*</span>
            </label>

            <div class="relative" @click="openDatePicker">
              <input
                :value="form.endDate"
                type="text"
                class="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                :class="touched.endDate && errors.endDate ? 'border-red-400' : 'border-gray-300'"
                readonly
                placeholder="请选择停药日期"
              />

              <input
                ref="dateInputRef"
                v-model="form.endDate"
                type="date"
                class="absolute inset-0 opacity-0 pointer-events-none"
                :min="today"
                tabindex="-1"
                aria-hidden="true"
                @change="markTouched('endDate')"
              />
            </div>

            <div v-if="touched.endDate && errors.endDate" class="text-xs text-red-500">
              {{ errors.endDate }}
            </div>
          </div>

          <div class="text-xs text-gray-500 leading-relaxed">
            请准确填写用药信息，避免用药错误；长期用药可选择最远日期
          </div>
        </div>
      </div>
    </div>

      <div class="shrink-0 bg-white border-t border-gray-200">
        <div class="px-4 py-3">
        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-900 active:scale-95 transition-all"
            style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
            @click="onCancel"
          >
            取消
          </button>
          <button
            type="button"
            class="flex-1 py-3 rounded-lg font-semibold text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            :class="canSave ? 'bg-primary hover:bg-primary/90' : 'bg-primary/60'"
            style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
            :disabled="!canSave"
            @click="onSave"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

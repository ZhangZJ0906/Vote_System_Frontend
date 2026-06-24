<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- 頁首 -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-black text-slate-800">投票項目管理</h1>
          <p class="text-sm text-slate-400 mt-0.5">共 {{ voteList.length }} 個題目</p>
        </div>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          新增題目
        </button>
      </div>

      <!-- 載入中 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <!-- 列表 -->
      <div v-else class="space-y-4">

        <!-- 空白狀態 -->
        <div v-if="voteList.length === 0"
          class="bg-white rounded-2xl shadow border border-slate-200 flex flex-col items-center justify-center py-20 text-slate-400">
          <svg class="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75"/>
          </svg>
          <p class="text-sm">目前沒有投票題目</p>
        </div>

        <!-- 每個 Question 卡片 -->
        <div
          v-for="question in voteList"
          :key="question.questionId"
          class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <!-- Question Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div>
              <h2 class="font-bold text-slate-800 text-base">{{ question.questionTitle }}</h2>
              <p v-if="question.questionDescription" class="text-xs text-slate-400 mt-0.5">
                {{ question.questionDescription }}
              </p>
            </div>
            <button
              @click="confirmDelete(question)"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              刪除
            </button>
          </div>

          <!-- Items 表格 -->
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left px-6 py-2.5 text-xs font-semibold text-slate-400 w-12">#</th>
                <th class="text-left px-6 py-2.5 text-xs font-semibold text-slate-400">選項名稱</th>
                <th class="text-center px-6 py-2.5 text-xs font-semibold text-slate-400 w-24">票數</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="(item, idx) in question.items"
                :key="item.itemId"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-3 text-slate-400 text-xs">{{ idx + 1 }}</td>
                <td class="px-6 py-3 font-medium text-slate-700">{{ item.itemName }}</td>
                <td class="px-6 py-3 text-center">
                  <span class="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                    {{ item.voteCount ?? 0 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 新增 Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <Transition name="slide-up">
          <div v-if="showModal" class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-black text-slate-800">新增投票題目</h2>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold text-slate-600 mb-1.5">
                題目標題 <span class="text-red-400">*</span>
              </label>
              <input v-model="form.title" type="text" placeholder="請輸入題目標題" maxlength="100"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"/>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold text-slate-600 mb-1.5">說明（選填）</label>
              <textarea v-model="form.description" placeholder="請輸入題目說明" rows="2"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"/>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-600 mb-1.5">
                投票選項 <span class="text-red-400">*</span>
              </label>
              <div v-for="(opt, i) in form.itemNames" :key="i" class="flex gap-2 mb-2">
                <input v-model="form.itemNames[i]" type="text" :placeholder="`選項 ${i + 1}`"
                  class="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"/>
                <button v-if="form.itemNames.length > 2" @click="removeItem(i)"
                  class="px-2.5 text-slate-400 hover:text-red-400 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button @click="form.itemNames.push('')"
                class="mt-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                新增選項
              </button>
            </div>

            <div class="flex gap-3">
              <button @click="closeModal"
                class="flex-1 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-150">
                取消
              </button>
              <button @click="submitAdd" :disabled="submitting"
                class="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ submitting ? '新增中...' : '確認新增' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { voteApi } from '@/Services/VoteApi'

const voteList   = ref([])
const loading    = ref(false)
const showModal  = ref(false)
const submitting = ref(false)

const form = ref({ title: '', description: '', itemNames: ['', ''] })

// 取得列表
async function fetchList() {
  loading.value = true
  try {
    const res = await voteApi.getVoteList()
    voteList.value = res.list ?? []
  } catch {
    Swal.fire({ icon: 'error', title: '載入失敗', text: '無法取得投票項目', confirmButtonColor: '#4f46e5' })
  } finally {
    loading.value = false
  }
}

// 新增 Modal
function openAddModal() {
  form.value = { title: '', description: '', itemNames: ['', ''] }
  showModal.value = true
}
function closeModal() { showModal.value = false }
function removeItem(i) { form.value.itemNames.splice(i, 1) }

// 送出新增
async function submitAdd() {
  if (!form.value.title.trim()) {
    Swal.fire({ icon: 'warning', title: '請填寫題目標題', confirmButtonColor: '#4f46e5' })
    return
  }
  const validItems = form.value.itemNames.filter(n => n.trim())
  if (validItems.length < 2) {
    Swal.fire({ icon: 'warning', title: '至少需要兩個選項', confirmButtonColor: '#4f46e5' })
    return
  }

  submitting.value = true
  try {
    await voteApi.addVote({
      title:       form.value.title.trim(),
      description: form.value.description.trim(),
      itemNames:   validItems
    })
    closeModal()
    await Swal.fire({ icon: 'success', title: '新增成功', timer: 1200, showConfirmButton: false })
    fetchList()
  } catch {
    Swal.fire({ icon: 'error', title: '新增失敗', text: '請稍後再試', confirmButtonColor: '#4f46e5' })
  } finally {
    submitting.value = false
  }
}

// 刪除整題
async function confirmDelete(question) {
  const result = await Swal.fire({
    icon: 'warning',
    title: '確認刪除？',
    text: `將刪除「${question.questionTitle}」及其所有選項，此操作無法復原`,
    showCancelButton: true,
    confirmButtonText: '確認刪除',
    cancelButtonText: '取消',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8'
  })
  if (!result.isConfirmed) return

  try {
    await voteApi.deleteVote(question.questionId)
    await Swal.fire({ icon: 'success', title: '刪除成功', timer: 1200, showConfirmButton: false })
    fetchList()
  } catch {
    Swal.fire({ icon: 'error', title: '刪除失敗', text: '請稍後再試', confirmButtonColor: '#4f46e5' })
  }
}

onMounted(fetchList)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
.slide-up-enter-active { transition: all 0.25s ease }
.slide-up-leave-active { transition: all 0.2s ease }
.slide-up-enter-from { opacity: 0; transform: translateY(16px) }
.slide-up-leave-to { opacity: 0; transform: translateY(8px) }
</style>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <div class="max-w-2xl mx-auto">

      <div class="text-center mb-8">
        <h2 class="text-2xl font-black text-slate-800">參與投票</h2>
        <p class="text-sm text-slate-400 mt-1">請選擇您支持的選項後送出</p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="voteQuestions.length === 0"
        class="text-center py-16 text-slate-400 bg-white rounded-2xl shadow border border-slate-200">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
        </svg>
        <p class="text-sm">目前沒有開放的投票項目</p>
      </div>

      <div v-else class="space-y-5">
        <div
          v-for="question in voteQuestions"
          :key="question.questionId"
          class="bg-white rounded-2xl shadow-xl border transition-all duration-300"
          :class="hasVotedQuestion(question.questionId) ? 'border-emerald-200' : 'border-slate-200'"
        >
          <!-- 題目 Header -->
          <div class="px-6 pt-5 pb-4 border-b border-slate-100">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base font-bold text-slate-800">{{ question.questionTitle }}</h3>
                <p v-if="question.questionDescription" class="text-sm text-slate-400 mt-0.5">
                  {{ question.questionDescription }}
                </p>
              </div>
              <span v-if="hasVotedQuestion(question.questionId)"
                class="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                已投票
              </span>
            </div>
          </div>

          <!-- 選項 -->
          <div class="px-6 py-4 space-y-2">
            <label
              v-for="item in question.items"
              :key="item.itemId"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150"
              :class="[
                hasVotedQuestion(question.questionId)
                  ? 'cursor-not-allowed border-slate-100 bg-slate-50'
                  : isItemSelected(question.questionId, item.itemId)
                    ? 'cursor-pointer border-indigo-300 bg-indigo-50'
                    : 'cursor-pointer border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50'
              ]"
            >
              <input
                type="checkbox"
                :value="item.itemId"
                :checked="isItemChecked(item.itemId) || isItemSelected(question.questionId, item.itemId)"
                :disabled="hasVotedQuestion(question.questionId)"
                class="w-4 h-4 accent-indigo-600 shrink-0"
                @change="toggleSelect(question.questionId, item.itemId)"
              />
              <span class="flex-1 text-sm font-medium"
                :class="hasVotedQuestion(question.questionId) ? 'text-slate-400' : 'text-slate-700'">
                {{ item.itemName }}
              </span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="hasVotedQuestion(question.questionId)
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-indigo-50 text-indigo-500'">
                {{ item.voteCount ?? 0 }} 票
              </span>
            </label>
          </div>

          <!-- 送出按鈕 -->
          <div class="px-6 pb-5">
            <button
              @click="submitVote(question.questionId)"
              :disabled="hasVotedQuestion(question.questionId) || !selectedItems[question.questionId]?.length"
              class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
              :class="hasVotedQuestion(question.questionId) || !selectedItems[question.questionId]?.length
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'"
            >
              {{ hasVotedQuestion(question.questionId) ? '已投票完成（無法重複投票）' : '確認送出投票' }}
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { voteApi } from '@/Services/VoteApi'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const authStore     = useAuthStore()
const currentUserId = computed(() => authStore.userId)

const loading       = ref(false)
const voteQuestions = ref([])
const userHistory   = ref([])
const selectedItems = ref({})

const initData = async () => {
  loading.value = true
  try {
    const listRes = await voteApi.getVoteList()
    if (listRes?.code === 200 && listRes.list) {
      voteQuestions.value = listRes.list
    }

    if (currentUserId.value) {
      const historyRes = await voteApi.getVoteHistory(currentUserId.value)
      if (historyRes?.code === 200) {
        userHistory.value = historyRes.list || []
      }
    }
  } catch (error) {
    console.error('資料載入失敗：', error)
    Swal.fire({ icon: 'error', title: '載入失敗', text: '無法載入投票清單，請確認後端連線', confirmButtonColor: '#4f46e5' })
  } finally {
    loading.value = false
  }
}

// 該題是否投過（整題鎖定）
const hasVotedQuestion = (questionId) =>
  userHistory.value.some(h => Number(h.questionId) === Number(questionId))

// 某個 item 是否已投過（顯示勾選狀態用）
const isItemChecked = (itemId) =>
  userHistory.value.some(h =>
    h.items?.some(i => Number(i.itemId) === Number(itemId))
  )

// 某個 item 是否被新勾選（尚未送出）
const isItemSelected = (questionId, itemId) =>
  selectedItems.value[questionId]?.includes(itemId) ?? false

// 切換勾選（已投過的題目不允許操作）
const toggleSelect = (questionId, itemId) => {
  if (hasVotedQuestion(questionId)) return
  if (!selectedItems.value[questionId]) selectedItems.value[questionId] = []
  const index = selectedItems.value[questionId].indexOf(itemId)
  if (index > -1) selectedItems.value[questionId].splice(index, 1)
  else selectedItems.value[questionId].push(itemId)
}

const submitVote = async (questionId) => {
  if (hasVotedQuestion(questionId)) {
    Swal.fire({ icon: 'warning', title: '已投票', text: '您已參與過此投票，無法重複投票！', confirmButtonColor: '#4f46e5' })
    return
  }

  const itemIds = selectedItems.value[questionId]
  if (!itemIds || itemIds.length === 0) return

  if (!currentUserId.value) {
    Swal.fire({ icon: 'warning', title: '請先登入', text: '登入後才能進行投票！', confirmButtonColor: '#4f46e5' })
    return
  }

  try {
    const res = await voteApi.castVotes({
      userId: Number(currentUserId.value),
      itemIds
    })
    if (res?.code === 200) {
      await Swal.fire({ icon: 'success', title: '投票成功！', text: '感謝您的參與', timer: 1500, showConfirmButton: false })
      delete selectedItems.value[questionId]
      await initData()
    } else {
      Swal.fire({ icon: 'error', title: '投票失敗', text: res.message || '請稍後再試', confirmButtonColor: '#4f46e5' })
    }
  } catch (error) {
    console.error('投票發生錯誤：', error)
    Swal.fire({ icon: 'error', title: '系統異常', text: '網路或系統異常，請稍後再試', confirmButtonColor: '#4f46e5' })
  }
}

onMounted(initData)
</script>

<template>
  <div class="vote-container">
    <h2>📊 參與投票</h2>

    <div v-if="loading" class="loading-status">資料載入中...</div>

    <div v-else-if="voteQuestions.length > 0">
      <div v-for="question in voteQuestions" :key="question.id" class="question-card"
        :class="{ 'voted-card': hasVotedQuestion(question.id) }">
        <h3>{{ question.title }}</h3>
        <p class="description">{{ question.description }}</p>

        <span v-if="hasVotedQuestion(question.id)" class="badge-voted">
          ✓ 您已參與此投票
        </span>

        <div class="items-list">
          <div v-for="item in question.items" :key="item.id" class="item-option">
            <label :class="{ 'disabled-label': hasVotedQuestion(question.id) }">
              <input type="checkbox" :value="item.id" :checked="isItemChecked(item.id)"
                :disabled="hasVotedQuestion(question.id)" @change="toggleSelect(question.id, item.id)" />
              <span class="item-name">{{ item.name }}</span>
              <span class="vote-count">({{ item.voteCount }} 票)</span>
            </label>
          </div>
        </div>

        <button class="btn-submit" :disabled="hasVotedQuestion(question.id) || !selectedItems[question.id]?.length"
          @click="submitVote(question.id)">
          {{ hasVotedQuestion(question.id) ? '已投票完成' : '確認送出投票' }}
        </button>
      </div>
    </div>

    <div v-else class="no-data">目前沒有開放的投票項目。</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { voteApi } from '@/Services/VoteApi'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

// 狀態管理
const authStore = useAuthStore()
// 安全取得目前登入者的 userId (支援 string 或 number 轉換)
const currentUserId = computed(() => authStore.id || authStore.userId)

const loading = ref(false)
const voteQuestions = ref([])   // 重組後，給模板渲染的巢狀問卷清單
const userHistory = ref([])     // 該使用者投過的紀錄清單 (由歷史 API 撈出)

// 紀錄使用者目前在網頁上勾選的暫存狀態 (格式: { 題目ID: [選項ID, 選項ID, ...] })
const selectedItems = ref({})

// 初始化載入資料
const initData = async () => {
  loading.value = true
  try {
    // 1. 獲取所有投票項目及累積票數 (後端回傳平鋪陣列)
    const listRes = await voteApi.getVoteList()

    // 💡 關鍵修正 1：對應後端實體回傳的欄位是 .code 與 .list
    if (listRes && listRes.code === 200 && listRes.list) {

      // 💡 關鍵修正 2：將後端平鋪的選項資料，依據 question_id 分組重組成巢狀結構
      const groupMap = {}

      listRes.list.forEach(row => {
        const qId = row.question_id

        // 如果這個問卷大題還沒建立過，先初始化大題結構
        if (!groupMap[qId]) {
          groupMap[qId] = {
            id: qId,
            title: row.question_title,
            description: row.question_description,
            items: []
          }
        }

        // 將該行選項塞入對應大題的 items 陣列中
        groupMap[qId].items.push({
          id: row.item_id,
          name: row.item_name,
          voteCount: row.vote_count || 0 // 對應後端 SQL 查出來的 vote_count
        })
      })

      // 將 Map 物件轉回 Array 陣列，這時長度就會大於 0，順利觸發渲染！
      voteQuestions.value = Object.values(groupMap)
    }

    // 2. 如果使用者已登入，獲取其投票歷史紀錄
    if (currentUserId.value) {
      const historyRes = await voteApi.getVoteHistory(currentUserId.value)
      if (historyRes && historyRes.code === 200) {
        // 確保有拿到 list 陣列
        userHistory.value = historyRes.list || []
      }
    }
  } catch (error) {
    console.error('資料載入失敗：', error)
    Swal.fire('錯誤', '無法載入投票清單，請確認後端連線', 'error')
  } finally {
    loading.value = false
  }
}

// 💡 關鍵修正 3：修正歷史紀錄判定欄位名稱 (確認型態一致)
// 判斷這題大題目，使用者是不是已經投過了
const hasVotedQuestion = (questionId) => {
  return userHistory.value.some(history => Number(history.question_id) === Number(questionId))
}

// 判斷某個特定選項，是不是在歷史紀錄裡被選過 (用來初始渲染打勾)
const isItemChecked = (itemId) => {
  return userHistory.value.some(history => Number(history.item_id) === Number(itemId))
}

// 處理 Checkbox 勾選與取消勾選暫存
const toggleSelect = (questionId, itemId) => {
  if (!selectedItems.value[questionId]) {
    selectedItems.value[questionId] = []
  }

  const index = selectedItems.value[questionId].indexOf(itemId)
  if (index > -1) {
    selectedItems.value[questionId].splice(index, 1) // 取消勾選
  } else {
    selectedItems.value[questionId].push(itemId)    // 加入勾選
  }
}

// 送出投票
const submitVote = async (questionId) => {
  const itemIds = selectedItems.value[questionId]
  if (!itemIds || itemIds.length === 0) return

  if (!currentUserId.value) {
    Swal.fire('提示', '請先登入後再進行投票！', 'warning')
    return
  }

  // 組裝符合後端升級版 CastVoteDTO 的請求體
  const payload = {
    userId: Number(currentUserId.value),
    itemIds: itemIds
  }

  try {
    const res = await voteApi.castVotes(payload)

    // 💡 關鍵修正 4：成功響應改為檢查 .code
    if (res && res.code === 200) {
      Swal.fire('成功', '投票成功！感謝您的參與', 'success')

      // 清空該題暫存的勾選資料
      delete selectedItems.value[questionId]

      // 重新整理資料，讓總票數實時更新，並鎖定已投票區塊
      await initData()
    } else {
      Swal.fire('失敗', res.message || '投票失敗', 'error')
    }
  } catch (error) {
    console.error('投票發生錯誤：', error)
    Swal.fire('異常', '網路或系統異常，請稍後再試', 'error')
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.vote-container {
  max-width: 650px;
  margin: 30px auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

.loading-status,
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
}

.question-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 25px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.question-card h3 {
  margin-top: 0;
  color: #222;
}

.description {
  color: #666;
  font-size: 0.95em;
  margin-bottom: 15px;
}

.voted-card {
  background: #fcfdfd;
  border-color: #b4e3db;
}

.badge-voted {
  display: inline-block;
  color: #1e7e78;
  font-weight: bold;
  font-size: 0.85em;
  background: #e6f7f4;
  padding: 5px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.items-list {
  margin: 20px 0;
}

.item-option {
  margin: 12px 0;
}

.item-option label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
}

.item-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.item-name {
  color: #333;
  font-size: 1em;
}

.vote-count {
  color: #999;
  font-size: 0.9em;
  margin-left: 8px;
}

.disabled-label {
  cursor: not-allowed !important;
  color: #888;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1em;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-submit:disabled {
  background-color: #d6d6d6;
  color: #8e8e8e;
  cursor: not-allowed;
}
</style>

<template>
  <div class="page">
    <AppHeader />
    <div class="page-content" style="max-width: 1100px;">
      <div class="admin-header">
        <h1>在庫管理</h1>
        <div class="header-actions">
          <button class="btn-ghost" @click="showReceive = true">＋ 入庫登録</button>
          <button class="btn-primary refresh-btn" @click="load">更新</button>
        </div>
      </div>

      <div v-if="loading" class="loading">読み込み中...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <div v-else class="card table-card">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>商品名</th>
                <th>サイズ</th>
                <th>現在庫数</th>
                <th>最終更新</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="inventory.inventory.length === 0">
                <td colspan="5" style="text-align:center;color:var(--color-text-muted)">在庫データがありません</td>
              </tr>
              <tr
                v-for="item in inventory.inventory"
                :key="item.id"
                :class="{ 'low-stock': item.CurrentStock === 0 }"
              >
                <td>{{ item.Category }}</td>
                <td>{{ item.ProductName }}</td>
                <td>{{ item.Size }}</td>
                <td class="stock-cell">
                  <span :class="item.CurrentStock === 0 ? 'badge badge-red' : item.CurrentStock <= 3 ? 'badge badge-yellow' : ''">
                    {{ item.CurrentStock }}
                  </span>
                </td>
                <td>{{ formatDate(item.LastUpdated) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 入出庫履歴 -->
      <div class="history-section">
        <div class="history-header">
          <h2>入出庫履歴</h2>
          <div class="filter-row">
            <select v-model="historyFilter" @change="loadHistory" style="max-width:160px; min-height:44px;">
              <option value="">すべて</option>
              <option value="入庫">入庫のみ</option>
              <option value="出庫">出庫のみ</option>
            </select>
          </div>
        </div>
        <div class="card table-card">
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>区分</th>
                  <th>商品名</th>
                  <th>サイズ</th>
                  <th>数量</th>
                  <th>変動前</th>
                  <th>変動後</th>
                  <th>関連注文</th>
                  <th>担当者</th>
                  <th>日時</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="inventory.history.length === 0">
                  <td colspan="9" style="text-align:center;color:var(--color-text-muted)">履歴がありません</td>
                </tr>
                <tr v-for="h in inventory.history" :key="h.id">
                  <td>
                    <span class="badge" :class="h.MovementType === '入庫' ? 'badge-green' : 'badge-blue'">
                      {{ h.MovementType }}
                    </span>
                  </td>
                  <td>{{ h.ProductName }}</td>
                  <td>{{ h.Size }}</td>
                  <td>{{ h.Quantity }}</td>
                  <td>{{ h.StockBefore }}</td>
                  <td>{{ h.StockAfter }}</td>
                  <td class="mono" style="font-size:13px">{{ h.RelatedOrderId || '-' }}</td>
                  <td>{{ h.OperatedBy }}</td>
                  <td>{{ formatDate(h.MovementDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 入庫モーダル -->
    <div v-if="showReceive" class="modal-overlay" @click.self="showReceive = false">
      <div class="modal card">
        <h2>入庫登録</h2>
        <div class="form-grid">
          <label>カテゴリ</label>
          <select v-model="receiveForm.category" @change="receiveForm.productName = ''; receiveForm.size = ''">
            <option value="">選択してください</option>
            <option v-for="cat in products.categories" :key="cat.id" :value="cat.categoryName">{{ cat.categoryName }}</option>
          </select>

          <label>商品名</label>
          <select v-model="receiveForm.productName" @change="receiveForm.size = ''" :disabled="!receiveForm.category">
            <option value="">選択してください</option>
            <option v-for="p in currentCategoryProducts" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>

          <label>サイズ</label>
          <select v-model="receiveForm.size" :disabled="!receiveForm.productName">
            <option value="">選択してください</option>
            <option v-for="s in currentProductSizes" :key="s" :value="s">{{ s }}</option>
          </select>

          <label>数量</label>
          <input type="number" v-model.number="receiveForm.quantity" min="1" style="min-height:52px;" />

          <label>備考</label>
          <input type="text" v-model="receiveForm.notes" placeholder="任意" />
        </div>
        <div v-if="receiveError" class="error-msg" style="margin-top:12px">{{ receiveError }}</div>
        <div class="modal-buttons">
          <button class="btn-ghost" @click="showReceive = false">キャンセル</button>
          <button class="btn-primary" @click="submitReceive" :disabled="receiveLoading || !receiveFormValid">
            {{ receiveLoading ? '登録中...' : '入庫登録' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useProductStore } from '@/stores/productStore';

const inventory = useInventoryStore();
const products = useProductStore();

const loading = ref(false);
const error = ref('');
const historyFilter = ref('');
const showReceive = ref(false);
const receiveLoading = ref(false);
const receiveError = ref('');

const receiveForm = ref({ category: '', productName: '', size: '', quantity: 1, notes: '' });

const currentCategoryProducts = computed(() => {
  const cat = products.categories.find((c) => c.categoryName === receiveForm.value.category);
  return cat?.products || [];
});
const currentProductSizes = computed(() => {
  const p = currentCategoryProducts.value.find((p) => p.name === receiveForm.value.productName);
  return p?.sizes || [];
});
const receiveFormValid = computed(() =>
  receiveForm.value.category && receiveForm.value.productName && receiveForm.value.size && receiveForm.value.quantity >= 1
);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    await inventory.fetchInventory();
  } catch (err) {
    error.value = typeof err === 'string' ? err : '読み込みに失敗しました';
  } finally {
    loading.value = false;
  }
}

async function loadHistory() {
  try {
    const params = historyFilter.value ? { type: historyFilter.value } : {};
    await inventory.fetchHistory(params);
  } catch {/* silent */}
}

async function submitReceive() {
  receiveLoading.value = true;
  receiveError.value = '';
  try {
    await inventory.receiveStock({ ...receiveForm.value });
    showReceive.value = false;
    receiveForm.value = { category: '', productName: '', size: '', quantity: 1, notes: '' };
    await Promise.all([load(), loadHistory()]);
  } catch (err) {
    receiveError.value = typeof err === 'string' ? err : '入庫登録に失敗しました';
  } finally {
    receiveLoading.value = false;
  }
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

onMounted(() => Promise.all([load(), loadHistory()]));
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.admin-header h1 { font-size: var(--font-xl); }
.header-actions { display: flex; gap: 12px; }
.refresh-btn { min-height: 44px; }
.table-card { padding: 0; overflow: hidden; }
.table-scroll { overflow-x: auto; }
.stock-cell { font-size: var(--font-lg); font-weight: bold; }
.low-stock { background: #fff5f5; }
.history-section { margin-top: 40px; }
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.history-header h2 { font-size: var(--font-lg); }
.filter-row { display: flex; gap: 12px; align-items: center; }
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  max-width: 520px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal h2 { font-size: var(--font-lg); margin-bottom: 16px; }
.form-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px 16px;
  align-items: center;
}
.form-grid label { font-weight: 600; font-size: 15px; }
.modal-buttons { display: flex; gap: 12px; margin-top: 20px; }
.mono { font-family: monospace; font-size: 13px; }
</style>

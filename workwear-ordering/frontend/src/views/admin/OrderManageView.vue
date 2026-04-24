<template>
  <div class="page">
    <AppHeader />
    <div class="page-content" style="max-width: 1100px;">
      <div class="admin-header">
        <h1>注文管理</h1>
        <button class="btn-primary refresh-btn" @click="load">更新</button>
      </div>

      <div class="filters card" style="margin-bottom:16px;">
        <div class="filter-row">
          <label>ステータス</label>
          <select v-model="filterStatus" @change="load">
            <option value="">すべて</option>
            <option value="注文済">注文済</option>
            <option value="出庫済">出庫済</option>
            <option value="キャンセル">キャンセル</option>
          </select>
          <label>カテゴリ</label>
          <select v-model="filterCategory" @change="load">
            <option value="">すべて</option>
            <option v-for="cat in products.categories" :key="cat.id" :value="cat.categoryName">
              {{ cat.categoryName }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">読み込み中...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <div v-else class="card table-card">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>注文番号</th>
                <th>氏名</th>
                <th>部署</th>
                <th>商品名</th>
                <th>サイズ</th>
                <th>数量</th>
                <th>注文日時</th>
                <th>経路</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="order.orders.length === 0">
                <td colspan="10" style="text-align:center; color:var(--color-text-muted)">注文がありません</td>
              </tr>
              <tr v-for="o in order.orders" :key="o.id">
                <td class="mono">{{ o.Title }}</td>
                <td>{{ o.EmployeeName }}</td>
                <td>{{ o.Department }}</td>
                <td>{{ o.ProductName }}</td>
                <td>{{ o.Size }}</td>
                <td>{{ o.Quantity }}</td>
                <td>{{ formatDate(o.OrderDate) }}</td>
                <td>
                  <span class="badge" :class="o.OrderChannel === 'WebApp' ? 'badge-blue' : 'badge-yellow'">
                    {{ o.OrderChannel === 'WebApp' ? '現地' : 'Forms' }}
                  </span>
                </td>
                <td><StatusBadge :status="o.Status" /></td>
                <td>
                  <div class="action-buttons">
                    <button
                      v-if="o.Status === '注文済'"
                      class="btn-issue"
                      @click="issueOrder(o)"
                    >出庫</button>
                    <button
                      v-if="o.Status === '注文済'"
                      class="btn-cancel"
                      @click="cancelOrder(o)"
                    >取消</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 出庫確認モーダル -->
      <div v-if="issueTarget" class="modal-overlay" @click.self="issueTarget = null">
        <div class="modal card">
          <h2>出庫確認</h2>
          <p style="margin:16px 0">
            <strong>{{ issueTarget.ProductName }}</strong> ({{ issueTarget.Size }}) ×{{ issueTarget.Quantity }}点を出庫します。<br>
            在庫が減少します。よろしいですか？
          </p>
          <div v-if="actionError" class="error-msg">{{ actionError }}</div>
          <div class="modal-buttons">
            <button class="btn-ghost" @click="issueTarget = null">キャンセル</button>
            <button class="btn-primary" @click="confirmIssue" :disabled="actionLoading">
              {{ actionLoading ? '処理中...' : '出庫する' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { useOrderStore } from '@/stores/orderStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useProductStore } from '@/stores/productStore';

const order = useOrderStore();
const inventory = useInventoryStore();
const products = useProductStore();

const loading = ref(false);
const error = ref('');
const filterStatus = ref('');
const filterCategory = ref('');
const issueTarget = ref(null);
const actionLoading = ref(false);
const actionError = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const params = {};
    if (filterStatus.value) params.status = filterStatus.value;
    if (filterCategory.value) params.category = filterCategory.value;
    await order.fetchOrders(params);
  } catch (err) {
    error.value = typeof err === 'string' ? err : '読み込みに失敗しました';
  } finally {
    loading.value = false;
  }
}

function issueOrder(o) {
  issueTarget.value = o;
  actionError.value = '';
}

async function confirmIssue() {
  actionLoading.value = true;
  actionError.value = '';
  try {
    await inventory.issueStock(issueTarget.value.id);
    issueTarget.value = null;
    await load();
  } catch (err) {
    actionError.value = typeof err === 'string' ? err : '出庫処理に失敗しました';
  } finally {
    actionLoading.value = false;
  }
}

async function cancelOrder(o) {
  if (!confirm(`注文「${o.Title}」をキャンセルしますか？`)) return;
  try {
    await order.cancelOrder(o.id);
    await load();
  } catch (err) {
    alert(typeof err === 'string' ? err : '取消に失敗しました');
  }
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

onMounted(load);
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.admin-header h1 { font-size: var(--font-xl); }
.refresh-btn { min-height: 44px; }
.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.filter-row label { font-weight: 600; white-space: nowrap; }
.filter-row select { min-height: 48px; max-width: 200px; }
.table-card { padding: 0; overflow: hidden; }
.table-scroll { overflow-x: auto; }
.mono { font-family: monospace; font-size: 14px; }
.action-buttons { display: flex; gap: 8px; }
.btn-issue {
  background: var(--color-primary);
  color: white;
  min-height: 40px;
  padding: 0 12px;
  font-size: 14px;
  border-radius: 6px;
}
.btn-cancel {
  background: white;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
  min-height: 40px;
  padding: 0 12px;
  font-size: 14px;
  border-radius: 6px;
}
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
  max-width: 480px;
  width: 90%;
}
.modal h2 { font-size: var(--font-lg); margin-bottom: 8px; }
.modal-buttons { display: flex; gap: 12px; margin-top: 16px; }
</style>

const { graphRequest } = require('./sharepointAuth');
const config = require('../config/sharepoint');
const inventoryService = require('./inventoryService');
const orderService = require('./orderService');

const movListPath = () =>
  `/sites/${config.siteId}/lists/${config.listIds.stockMovements}/items`;

function generateMovementId() {
  return `MOV-${Date.now()}`;
}

async function recordMovement({ type, category, productName, size, quantity, stockBefore, stockAfter, relatedOrderId, operatedBy, notes }) {
  const fields = {
    Title: generateMovementId(),
    MovementType: type,
    Category: category,
    ProductName: productName,
    Size: size,
    Quantity: quantity,
    StockBefore: stockBefore,
    StockAfter: stockAfter,
    RelatedOrderId: relatedOrderId || '',
    MovementDate: new Date().toISOString(),
    OperatedBy: operatedBy,
    Notes: notes || '',
  };
  await graphRequest('POST', movListPath(), { fields });
}

async function receiveStock({ category, productName, size, quantity, operatedBy, notes }) {
  const sku = `${productName}-${size}`;
  let item = await inventoryService.findBySku(sku);

  const stockBefore = item ? item.CurrentStock : 0;
  const stockAfter = stockBefore + quantity;

  if (item) {
    await inventoryService.updateStock(item.id, stockAfter);
  } else {
    await inventoryService.createSkuItem(sku, category, productName, size, stockAfter);
  }

  await recordMovement({ type: '入庫', category, productName, size, quantity, stockBefore, stockAfter, operatedBy, notes });
  return { newStockLevel: stockAfter };
}

async function issueStock({ orderId, operatedBy, notes }) {
  const order = await orderService.getOrder(orderId);
  if (!order || order.Status !== '注文済') {
    const err = new Error('注文が見つからないか、既に処理済みです');
    err.status = 400;
    throw err;
  }

  const sku = `${order.ProductName}-${order.Size}`;
  const item = await inventoryService.findBySku(sku);

  if (!item) {
    const err = new Error(`在庫が見つかりません: ${sku}`);
    err.status = 400;
    throw err;
  }
  if (item.CurrentStock < order.Quantity) {
    const err = new Error(`在庫が不足しています（現在: ${item.CurrentStock}、必要: ${order.Quantity}）`);
    err.status = 400;
    throw err;
  }

  const stockBefore = item.CurrentStock;
  const stockAfter = stockBefore - order.Quantity;

  await inventoryService.updateStock(item.id, stockAfter);

  try {
    await orderService.updateOrderStatus(orderId, '出庫済', operatedBy);
  } catch (err) {
    // 在庫は減らしたが注文更新失敗 → 在庫を戻す補償処理
    await inventoryService.updateStock(item.id, stockBefore).catch(() => {});
    console.error('[RECONCILIATION REQUIRED] 在庫を戻しましたが確認が必要:', { orderId, sku });
    throw err;
  }

  await recordMovement({
    type: '出庫',
    category: order.Category,
    productName: order.ProductName,
    size: order.Size,
    quantity: order.Quantity,
    stockBefore,
    stockAfter,
    relatedOrderId: order.Title,
    operatedBy,
    notes,
  });

  return { newStockLevel: stockAfter };
}

async function listHistory({ type, from } = {}) {
  const filters = [];
  if (type) filters.push(`fields/MovementType eq '${type}'`);
  if (from) filters.push(`fields/MovementDate ge '${from}'`);

  let path = `${movListPath()}?$expand=fields&$orderby=fields/MovementDate desc&$top=500`;
  if (filters.length > 0) path += `&$filter=${encodeURIComponent(filters.join(' and '))}`;

  const data = await graphRequest('GET', path);
  return (data.value || []).map((item) => ({ id: item.id, ...item.fields }));
}

module.exports = { receiveStock, issueStock, listHistory };

const { graphRequest } = require('./sharepointAuth');
const config = require('../config/sharepoint');

const listPath = () =>
  `/sites/${config.siteId}/lists/${config.listIds.inventory}/items`;

async function listInventory() {
  const data = await graphRequest(
    'GET',
    `${listPath()}?$expand=fields&$orderby=fields/Category,fields/ProductName&$top=500`
  );
  return (data.value || []).map((item) => ({ id: item.id, ...item.fields }));
}

async function findBySku(sku) {
  const encoded = encodeURIComponent(`fields/Title eq '${sku}'`);
  const data = await graphRequest('GET', `${listPath()}?$filter=${encoded}&$expand=fields&$top=1`);
  if (!data.value || data.value.length === 0) return null;
  return { id: data.value[0].id, ...data.value[0].fields };
}

async function createSkuItem(sku, category, productName, size, initialStock = 0) {
  const fields = {
    Title: sku,
    Category: category,
    ProductName: productName,
    Size: size,
    CurrentStock: initialStock,
    LastUpdated: new Date().toISOString(),
  };
  const data = await graphRequest('POST', listPath(), { fields });
  return { id: data.id, ...data.fields };
}

async function updateStock(id, newStock) {
  await graphRequest('PATCH', `${listPath()}/${id}/fields`, {
    CurrentStock: newStock,
    LastUpdated: new Date().toISOString(),
  });
}

module.exports = { listInventory, findBySku, createSkuItem, updateStock };

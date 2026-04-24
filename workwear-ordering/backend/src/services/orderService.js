const { graphRequest } = require('./sharepointAuth');
const config = require('../config/sharepoint');

const listPath = () =>
  `/sites/${config.siteId}/lists/${config.listIds.orders}/items`;

function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `ORD-${date}-${rand}`;
}

async function createOrder({ employee, category, productName, size, quantity, notes }) {
  const orderId = generateOrderId();
  const fields = {
    Title: orderId,
    EmployeeName: employee.employeeName,
    EmployeeId: employee.employeeId,
    Department: employee.department,
    Category: category,
    ProductName: productName,
    Size: size,
    Quantity: quantity,
    OrderDate: new Date().toISOString(),
    OrderChannel: 'WebApp',
    Status: '注文済',
    Notes: notes || '',
  };
  await graphRequest('POST', listPath(), { fields });
  return orderId;
}

async function listOrders({ status, category, from } = {}) {
  const filters = [];
  if (status) filters.push(`fields/Status eq '${status}'`);
  if (category) filters.push(`fields/Category eq '${category}'`);
  if (from) filters.push(`fields/OrderDate ge '${from}'`);

  let path = `${listPath()}?$expand=fields&$orderby=fields/OrderDate desc&$top=200`;
  if (filters.length > 0) path += `&$filter=${encodeURIComponent(filters.join(' and '))}`;

  const data = await graphRequest('GET', path);
  return (data.value || []).map((item) => ({ id: item.id, ...item.fields }));
}

async function getOrder(id) {
  const data = await graphRequest('GET', `${listPath()}/${id}?$expand=fields`);
  return { id: data.id, ...data.fields };
}

async function updateOrderStatus(id, status, adminName) {
  const fields = { Status: status };
  if (status === '出庫済') {
    fields.IssuedDate = new Date().toISOString();
    fields.IssuedBy = adminName;
  }
  await graphRequest('PATCH', `${listPath()}/${id}/fields`, fields);
}

module.exports = { createOrder, listOrders, getOrder, updateOrderStatus };

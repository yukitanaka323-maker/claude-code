module.exports = {
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  siteId: process.env.SHAREPOINT_SITE_ID,
  listIds: {
    employees: process.env.EMPLOYEE_LIST_ID,
    orders: process.env.ORDERS_LIST_ID,
    inventory: process.env.INVENTORY_LIST_ID,
    stockMovements: process.env.STOCK_MOVEMENTS_LIST_ID,
  },
  graphBase: 'https://graph.microsoft.com/v1.0',
};

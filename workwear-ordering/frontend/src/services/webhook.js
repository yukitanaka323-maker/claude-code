const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `ORD-${date}-${rand}`;
}

export async function submitOrder({ employee, category, productName, size, quantity }) {
  if (!WEBHOOK_URL) throw new Error('VITE_WEBHOOK_URL が設定されていません');

  const payload = {
    OrderId:      generateOrderId(),
    EmployeeName: employee.name,
    Department:   employee.department,
    Category:     category,
    ProductName:  productName,
    Size:         size,
    Quantity:     quantity,
    OrderDate:    new Date().toISOString(),
    OrderChannel: 'WebApp',
    Status:       '注文済',
  };

  const res = await fetch(WEBHOOK_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`送信失敗 (${res.status})`);
  return payload.OrderId;
}

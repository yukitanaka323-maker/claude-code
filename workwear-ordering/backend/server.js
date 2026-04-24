require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`作業服注文システム バックエンド起動: http://localhost:${PORT}`);
});

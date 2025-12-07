const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 计算接口
app.post('/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;

  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return res.status(400).json({ error: '请输入有效的数字' });
  }

  let result;
  switch (operation) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '*': result = num1 * num2; break;
    case '/':
      if (num2 === 0) return res.status(400).json({ error: '不能除以 0' });
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: '无效的操作符' });
  }

  res.json({ result });
});

// ==================== 关键：同时支持本地和 Vercel ====================
// Vercel 会自动把 server.js 当成 Serverless Function
// 所以我们加一个兜底：如果不是被 Vercel require，就自己启动 listen
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`本地服务器运行中 → http://localhost:${PORT}`);
  });
}

// Vercel 需要 export app
module.exports = app;
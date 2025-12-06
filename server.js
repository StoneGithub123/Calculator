const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // 使用 Vercel 的环境变量，如果本地运行就使用 3000 端口

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.get('/calculate', (req, res) => {
  const { num1, operator, num2 } = req.query;

  let result;

  // Convert inputs to numbers
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  switch (operator) {
    case '+':
      result = n1 + n2;
      break;
    case '-':
      result = n1 - n2;
      break;
    case '*':
      result = n1 * n2;
      break;
    case '/':
      if (n2 === 0) {
        result = 'Error: Division by zero';
      } else {
        result = n1 / n2;
      }
      break;
    default:
      result = 'Error: Invalid operator';
  }

  res.json({ result });
});

// 启动应用程序并监听端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

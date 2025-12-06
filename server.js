const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));  // Serve static files from 'public'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/calculate', (req, res) => {
  const { num1, operator, num2 } = req.query;

  console.log(`Received calculation request: num1=${num1}, operator=${operator}, num2=${num2}`);

  let result;

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    result = 'Error: Invalid numbers';
  } else {
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
  }

  console.log(`Calculated result: ${result}`);

  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

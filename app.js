// 安装express模块
// 在命令行执行 npm install express

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 

app.use(express.static('public')); // 设置静态文件目录

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


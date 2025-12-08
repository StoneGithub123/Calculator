const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== 在这里改你的唯一密码（想换就改这行）==========
const LOGIN_PASSWORD = "abc123456";   // ←←←← 改成你想要的密码
// =====================================================

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 根目录跳转登录页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 登录接口
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === LOGIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false, msg: '密码错误' });
  };
  }
);

// 生成密钥（后端保密，不补零，支持1-6位）
app.post('/api/generate-key', (req, res) => {
  let code = req.body.code?.toString().replace(/\D/g, '').slice(0,6);
  if (!code) return res.json({ success: false, msg: '请输入数字' });

  let num = parseInt(code, 10);
  for (let i = 0; i < 7; i++) {
    num = (num * 823 + 778899) % 31234;
  }
  res.json({ success: true, key: num.toString() });
});

app.listen(PORT, () => {
  console.log(`运行中 → http://localhost:${PORT}`);
});
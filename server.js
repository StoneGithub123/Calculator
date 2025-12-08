const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
//          改密码只改这里！
const LOGIN_PASSWORD = "abc123456";   // ← 改成你的密码
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 安全中间件（关键修复！）
app.use((req, res, next) => {
  const url = req.path;

  // 必须放行的路径（一定要全！）
  if (
    url === '/' ||
    url === '/login.html' ||
    url === '/login' ||                     // 登录接口
    url === '/api/generate-key' ||          // 生成密钥接口
    url.startsWith('/__') ||                // Vercel 内部路径
    (url.includes('.') && !url.endsWith('.html'))  // 所有静态资源 css/js/png 等
  ) {
    return next();
  }

  // 已登录（cookie 正确）
  if (req.cookies?.auth === LOGIN_PASSWORD) {
    return next();
  }

  // 没登录 → 强制回登录页
  res.redirect('/login.html');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 登录接口（路径就是 /login）
app.post('/login', (req, res) => {
  if (req.body.password === LOGIN_PASSWORD) {
    res.cookie('auth', LOGIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Vercel 自动是 production
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000
    });
    res.json({ success: true });
  } else {
    res.json({ success: false, msg: '密码错误' });
  }
});

// 生成密钥接口
app.post('/api/generate-key', (req, res) => {
  const input = req.body.code?.toString() || '';
  const code = input.replace(/\D/g, '').slice(0, 6);
  if (!code) return res.json({ success: false, msg: '请输入1-6位数字' });

  let num = parseInt(code, 10);
  for (let i = 0; i < 7; i++) {
    num = (num * 823 + 778899) % 31234;
  }
  res.json({ success: true, key: num.toString() });
});

app.listen(PORT, () => {
  console.log(`服务器运行中 → http://localhost:${PORT}`);
});
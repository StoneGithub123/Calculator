const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
//          改密码只改这里！！！
const LOGIN_PASSWORD = "abc123456";   // ← 改成你想要的密码
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 安全中间件：用 HttpOnly Cookie 判断登录
app.use((req, res, next) => {
  const url = req.path;

  // 放行登录页、登录接口、静态资源
  if (
    url === '/' ||
    url === '/login.html' ||
    url === '/login' ||
    (url.includes('.') && !url.endsWith('.html'))
  ) {
    return next();
  }

  // 其他页面检查 cookie
  if (req.cookies.auth === LOGIN_PASSWORD) {
    return next();
  }

  // 没登录就踢回登录页
  res.redirect('/login.html');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 登录接口（成功后写 cookie）
app.post('/login', (req, res) => {
  if (req.body.password === LOGIN_PASSWORD) {
    res.cookie('auth', LOGIN_PASSWORD, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000   // 10 分钟过期
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

app.listen(PORT, () => console.log(`运行中 → http://localhost:${PORT}`));
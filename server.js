const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 填写你自己的小程序APPID和APPSECRET
const APPID = '';
const SECRET = '';

// 角色白名单 填入真实openid
const ROLE = {
  admin: [],
  rider: []
};

app.post('/api/wxlogin', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.json({ code: -1, msg: '缺少code' });
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
    const wx = await axios.get(url);
    const { openid } = wx.data;
    if (!openid) return res.json({ code: -1, msg: '获取openid失败' });

    let role = 'user';
    if (ROLE.admin.includes(openid)) role = 'admin';
    else if (ROLE.rider.includes(openid)) role = 'rider';

    const token = Date.now() + '_' + openid;
    res.json({ code: 0, openid, role, token });
  } catch (e) {
    res.json({ code: -1, msg: '服务器错误' });
  }
});

app.get('/', (req, res) => res.send('服务正常运行'));
const PORT = process.env.PORT || 3000;
app.listen(PORT);
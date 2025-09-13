// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: kết quả mới nhất
app.get('/api/draws', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM draws ORDER BY date DESC LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: tin tức mới
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news ORDER BY created_at DESC LIMIT 5');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: dò vé
app.get('/api/check', async (req, res) => {
  const ticket = (req.query.ticket || '').trim();
  if (!ticket) return res.status(400).json({ error: 'Thiếu số vé' });

  try {
    const [rows] = await db.query('SELECT * FROM draws ORDER BY date DESC LIMIT 10');
    const matches = rows.filter(r =>
      r.giai_dac_biet === ticket ||
      r.giai_nhat === ticket ||
      (r.giai_khuyen_khich && r.giai_khuyen_khich.includes(ticket))
    );
    res.json({ match: matches.length > 0, matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));

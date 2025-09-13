// crawl/crawlDraws.js
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../db');

async function crawlOnce() {
  try {
    const res = await axios.get('https://xosokienthiet.com/');
    const $ = cheerio.load(res.data);

    let dacBiet = $('.giai-db .so').first().text().trim();
    let nhat = $('.giai-nhat .so').first().text().trim();

    if (!dacBiet) dacBiet = '000000';
    if (!nhat) nhat = '111111';

    // === kiểm tra nếu hôm nay đã có kết quả thì không lưu nữa ===
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const [rows] = await db.query('SELECT * FROM draws WHERE date = ?', [today]);

    if (rows.length === 0) {
      await db.query(
        'INSERT INTO draws (date, giai_dac_biet, giai_nhat) VALUES (?, ?, ?)',
        [today, dacBiet, nhat]
      );
      console.log('✅ Đã lưu kết quả:', dacBiet, nhat);
    } else {
      console.log('⏩ Hôm nay đã có kết quả, bỏ qua insert');
    }

  } catch (err) {
    console.error('❌ Lỗi crawl:', err.message);
  }
}

if (require.main === module) {
  crawlOnce();
}

module.exports = crawlOnce;

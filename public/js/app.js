async function loadDraws() {
  const res = await fetch('/api/draws');
  const data = await res.json();
  document.getElementById('results').innerHTML = `
    <p><strong>Ngày:</strong> ${data.date || ''}</p>
    <p><strong>Đặc Biệt:</strong> ${data.giai_dac_biet || '(chưa có)'}</p>
    <p><strong>Nhất:</strong> ${data.giai_nhat || '(chưa có)'}</p>
    <p><strong>Khuyến khích:</strong> ${data.giai_khuyen_khich || '(chưa có)'}</p>
  `;
}

async function loadNews() {
  const res = await fetch('/api/news');
  const data = await res.json();
  document.getElementById('news').innerHTML =
    data.map(n => `<li class="list-group-item">${n.title}</li>`).join('');
}

async function checkTicket() {
  const ticket = document.getElementById('ticketInput').value.trim();
  if (!ticket) { alert('Nhập vé số!'); return; }
  const res = await fetch(`/api/check?ticket=${ticket}`);
  const data = await res.json();
  alert(data.match ? '🎉 Vé trúng!' : '😢 Không trúng.');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkBtn').addEventListener('click', checkTicket);
  loadDraws();
  loadNews();
});

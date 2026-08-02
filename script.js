const baseLabels = ['トリオン', '攻撃', '防御・支援', '機動', '技術', '射程', '指揮', '特殊戦術'];

// レーダーチャート初期化
const ctx = document.getElementById('radarChart').getContext('2d');
let radarChart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: baseLabels.map(label => `${label}: 0`),
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(0, 210, 255, 0.3)',
      borderColor: '#00d2ff',
      pointBackgroundColor: '#00d2ff',
      pointBorderColor: '#fff',
      borderWidth: 2
    }]
  },
  options: {
    responsive: false,
    animation: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: {
          color: '#00d2ff',
          font: { size: 9.5, family: 'sans-serif', weight: 'bold' }
        },
        ticks: { display: false, stepSize: 3, max: 15, min: 0 },
        suggestedMin: 0,
        suggestedMax: 15
      }
    },
    plugins: { legend: { display: false } }
  }
});

// 表示更新処理
function updateDisplay() {
  document.getElementById('displayName').textContent = document.getElementById('charName').value || '―';
  document.getElementById('displayPosition').textContent = document.getElementById('position').value;

  // トリガーリスト更新
  const mainInputs = document.querySelectorAll('.main-trig');
  const subInputs = document.querySelectorAll('.sub-trig');
  const mainList = document.getElementById('displayMainTriggers');
  const subList = document.getElementById('displaySubTriggers');
  
  mainList.innerHTML = '';
  subList.innerHTML = '';

  mainInputs.forEach(input => {
    const li = document.createElement('li');
    li.className = 'trigger-item';
    li.textContent = input.value || '―';
    mainList.appendChild(li);
  });

  subInputs.forEach(input => {
    const li = document.createElement('li');
    li.className = 'trigger-item';
    li.textContent = input.value || '―';
    subList.appendChild(li);
  });

  // パラメータ取得
  const params = [
    parseInt(document.getElementById('p-trion').value) || 0,
    parseInt(document.getElementById('p-attack').value) || 0,
    parseInt(document.getElementById('p-defense').value) || 0,
    parseInt(document.getElementById('p-mobility').value) || 0,
    parseInt(document.getElementById('p-technique').value) || 0,
    parseInt(document.getElementById('p-range').value) || 0,
    parseInt(document.getElementById('p-command').value) || 0,
    parseInt(document.getElementById('p-tactics').value) || 0,
  ];

  // ラベル側に数値を追加表記（例: 「トリオン: 2」）
  radarChart.data.labels = baseLabels.map((label, index) => `${label}: ${params[index]}`);
  radarChart.data.datasets[0].data = params;
  radarChart.update();

  const total = params.reduce((sum, val) => sum + val, 0);
  document.getElementById('totalScore').textContent = total;
}

// イベント割り当て
document.querySelectorAll('input, select').forEach(input => {
  input.addEventListener('input', updateDisplay);
  input.addEventListener('change', updateDisplay);
});

// 画像アップロード処理
document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const targetWidth = 360;
      const targetHeight = 480;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth / 2) - (img.width / 2) * scale;
      const y = (targetHeight / 2) - (img.height / 2) * scale;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const resizedDataUrl = canvas.toDataURL('image/png');
      const imgDisplay = document.getElementById('avatarDisplay');
      imgDisplay.src = resizedDataUrl;
      imgDisplay.style.display = 'block';
      document.getElementById('avatarPlaceholder').style.display = 'none';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// PNG画像出力
document.getElementById('exportBtn').addEventListener('click', function() {
  const card = document.getElementById('cardToExport');
  const btn = this;
  btn.textContent = '⏳ 画像を生成中...';
  btn.disabled = true;

  html2canvas(card, {
    backgroundColor: '#08101a',
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const charName = document.getElementById('charName').value || '隊員';
    const link = document.createElement('a');
    link.download = `ワールドトリガー_${charName}_パラメータ.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    btn.textContent = '📷 カード画像を出力 (PNG)';
    btn.disabled = false;
  }).catch(err => {
    console.error(err);
    alert('画像の生成に失敗しました。');
    btn.textContent = '📷 カード画像を出力 (PNG)';
    btn.disabled = false;
  });
});

// 初期化
updateDisplay();
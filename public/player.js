// ============================================================
// Logique cote joueur - Quiz BTS E4
// ============================================================
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 800,
  reconnectionDelayMax: 4000,
  reconnectionAttempts: Infinity,
});

const $ = id => document.getElementById(id);
const connStatus = $('connStatus');

let myName = null;
let myAvatar = null;
let timerInterval = null;
let myChoice = null;
let lastBroadcastDeadline = null;

// pre-remplir le pseudo et code session
const savedName = localStorage.getItem('playerName');
if (savedName) $('name').value = savedName;
const url = new URL(window.location.href);
const codeFromUrl = url.searchParams.get('code');
if (codeFromUrl) $('sessionCode').value = codeFromUrl;

function setConnStatus(state) {
  if (!connStatus) return;
  connStatus.className = 'conn-status conn-' + state;
  connStatus.textContent =
    state === 'connected' ? '🟢 Connecte' :
    state === 'connecting' ? '🟡 Connexion...' :
    state === 'reconnecting' ? '🟠 Reconnexion...' : '🔴 Hors ligne';
}

socket.on('connect', () => {
  setConnStatus('connected');
  if (myName) socket.emit('player:join', myName);
});
socket.on('disconnect', () => setConnStatus('reconnecting'));
socket.on('connect_error', () => setConnStatus('reconnecting'));
socket.io.on('reconnect_attempt', () => setConnStatus('reconnecting'));
socket.io.on('reconnect', () => setConnStatus('connected'));

$('btnJoin').addEventListener('click', () => {
  const name = $('name').value.trim();
  if (!name) { toast('Entre un prenom'); return; }
  localStorage.setItem('playerName', name);
  SFX.click();
  socket.emit('player:join', name);
});

$('btnHost').addEventListener('click', () => {
  window.location.href = '/host.html';
});

$('btnAgain').addEventListener('click', () => {
  SFX.click();
  $('end-card').classList.add('hidden');
  $('waiting-card').classList.remove('hidden');
});

socket.on('player:joined', ({ name, avatar }) => {
  myName = name;
  myAvatar = avatar;
  $('myName').textContent = name;
  if (avatar) {
    $('myAvatar').textContent = avatar.emoji;
    $('myAvatar').style.background = avatar.color;
  }
  $('join-card').classList.add('hidden');
  $('waiting-card').classList.remove('hidden');
});

socket.on('lobby:update', data => {
  const box = $('lobbyPlayers');
  if (!box) return;
  if (!data.players.length) {
    box.innerHTML = '<p class="sub">Aucun autre joueur connecte pour le moment.</p>';
    return;
  }
  box.innerHTML = data.players.map(p => `
    <div class="score-card">
      <div class="avatar" style="background:${p.avatar ? p.avatar.color : '#fbbf24'}">${p.avatar ? p.avatar.emoji : '👤'}</div>
      <div class="info">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="pts">${p.score} pts</div>
      </div>
    </div>
  `).join('');
});

socket.on('game:start', ({ total, category, mode }) => {
  $('waiting-card').classList.add('hidden');
  $('end-card').classList.add('hidden');
  $('scores-card').classList.remove('hidden');
  $('game-card').classList.remove('hidden');
  toast(`🎯 ${total} questions${mode === 'survival' ? ' · MODE SURVIE 💀' : ''}`);
  SFX.victory();
});

socket.on('game:question', ({ index, total, category, question, formula, svg, difficulty, choices, duration }) => {
  myChoice = null;
  lastBroadcastDeadline = Date.now() + duration;
  $('answerStatus').classList.add('hidden');
  $('answerStatus').textContent = '';
  $('explanationBox').classList.add('hidden');
  $('explanationBox').innerHTML = '';
  $('phaseLabel').textContent = '⏱️ Reponds mentalement !';
  $('phaseLabel').classList.remove('phase-reveal');
  $('timerBar').classList.remove('urgent');

  const diffBadge = difficulty === 'F' ? '<span class="diff diff-F">🟢 Facile</span>'
                  : difficulty === 'M' ? '<span class="diff diff-M">🟡 Moyen</span>'
                  : difficulty === 'D' ? '<span class="diff diff-D">🔴 Difficile</span>' : '';
  $('catTag').innerHTML = escapeHtml(category) + ' ' + diffBadge;
  $('progress').textContent = `Question ${index + 1} / ${total}`;
  $('qText').textContent = question;

  const f = $('qFormula');
  if (formula) { f.textContent = '📐 ' + formula; f.classList.remove('hidden'); }
  else { f.classList.add('hidden'); f.textContent = ''; }
  const v = $('qVisual');
  if (svg) { v.innerHTML = svg; v.classList.remove('hidden'); }
  else { v.classList.add('hidden'); v.innerHTML = ''; }

  const choicesBox = $('choices');
  choicesBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(c)}</span>`;
    btn.addEventListener('click', () => {
      if (myChoice !== null) return;
      myChoice = i;
      SFX.click();
      [...choicesBox.children].forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      socket.emit('player:answer', { choice: i });
      $('answerStatus').classList.remove('hidden');
      $('answerStatus').textContent = '✓ Reponse envoyee, on attend les autres...';
    });
    choicesBox.appendChild(btn);
  });

  const start = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  let lastTickSec = Math.ceil(duration / 1000);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 100 - (elapsed / duration) * 100);
    $('timerBarInner').style.width = pct + '%';
    const remainSec = Math.ceil((duration - elapsed) / 1000);
    if (remainSec <= 5 && remainSec !== lastTickSec) {
      lastTickSec = remainSec;
      $('timerBar').classList.add('urgent');
      if (remainSec > 0) SFX.countdown();
    }
    if (pct <= 0) clearInterval(timerInterval);
  }, 80);
});

socket.on('game:reveal', ({ correctIndex, correctText, explanation, formula, svg, results, duration }) => {
  if (timerInterval) clearInterval(timerInterval);
  $('timerBarInner').style.width = '0%';
  $('timerBar').classList.remove('urgent');
  $('phaseLabel').textContent = '💡 Explication';
  $('phaseLabel').classList.add('phase-reveal');

  const choicesBox = $('choices');
  [...choicesBox.children].forEach((b, i) => {
    b.classList.remove('selected');
    if (i === correctIndex) b.classList.add('correct');
    else if (i === myChoice) b.classList.add('wrong');
    else b.classList.add('dim');
  });

  const myResult = results.find(r => r.name === myName);
  if (myResult) {
    $('answerStatus').classList.remove('hidden');
    if (myResult.correct) {
      $('answerStatus').textContent = `✅ +${myResult.gained} pts${myResult.comboBonus ? ` (combo ×${myResult.streak} : +${myResult.comboBonus})` : ''}`;
      SFX.correct();
      if (myResult.streak >= 3 && window.showCombo) {
        window.showCombo(`COMBO ×${myResult.streak} 🔥`);
        SFX.combo();
      }
    } else {
      $('answerStatus').textContent = `❌ La bonne reponse : ${correctText}`;
      SFX.wrong();
    }
    if (myResult.eliminated) {
      toast('💀 Elimine !');
    }
  } else if (myChoice === null) {
    SFX.timesUp();
  }

  const expBox = $('explanationBox');
  let html = `<div class="exp-title">✅ <span class="exp-answer">${escapeHtml(correctText)}</span></div>`;
  if (formula) html += `<div class="exp-formula">📐 ${escapeHtml(formula)}</div>`;
  if (explanation) html += `<div class="exp-text">${escapeHtml(explanation)}</div>`;
  expBox.innerHTML = html;
  expBox.classList.remove('hidden');

  if (svg && !$('qVisual').innerHTML) {
    $('qVisual').innerHTML = svg;
    $('qVisual').classList.remove('hidden');
  }

  if (duration) {
    const start = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      $('timerBarInner').style.width = pct + '%';
      if (pct <= 0) clearInterval(timerInterval);
    }, 80);
  }
});

socket.on('game:scores', ({ scores }) => {
  const box = $('scores');
  if (!box) return;
  box.innerHTML = scores.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const streak = s.streak >= 2 ? `<div class="streak">🔥${s.streak}</div>` : '';
    const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}">${s.avatar.emoji}</div>` : '';
    return `<div class="score-card ${cls}">${av}<div class="info"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>${streak}</div>`;
  }).join('');
});

socket.on('game:end', ({ ranking, awards }) => {
  $('game-card').classList.add('hidden');
  $('scores-card').classList.add('hidden');
  $('end-card').classList.remove('hidden');

  // Podium top 3
  const podium = $('podium');
  podium.innerHTML = '';
  const top3 = ranking.slice(0, 3);
  const positions = [2, 1, 3]; // ordre d'affichage : 2eme a gauche, 1er au centre, 3eme a droite
  const medals = ['🥇', '🥈', '🥉'];
  top3.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = `podium-spot podium-${i + 1}`;
    const av = p.avatar ? `<div class="avatar" style="background:${p.avatar.color}">${p.avatar.emoji}</div>` : '';
    div.innerHTML = `
      <div class="medal">${medals[i]}</div>
      ${av}
      <div class="name">${escapeHtml(p.name)}</div>
      <div class="pts">${p.score} pts</div>
    `;
    podium.appendChild(div);
  });

  // Awards / prix speciaux
  if (awards) {
    let awardsHtml = '🏅 ';
    if (awards.fastest) awardsHtml += `<strong>⚡ Plus rapide</strong> : ${escapeHtml(awards.fastest)}. `;
    if (awards.bestStreak && awards.bestStreakValue >= 3) awardsHtml += `<strong>🔥 Meilleur combo</strong> : ${escapeHtml(awards.bestStreak)} (×${awards.bestStreakValue}). `;
    $('awards').innerHTML = awardsHtml;
  }

  // Mes stats
  const me = ranking.find(p => p.name === myName);
  if (me && me.stats) {
    $('myStats').innerHTML = `
      <div class="stat"><div class="stat-value">${me.stats.correct}/${me.stats.answered}</div><div class="stat-label">Bonnes reponses</div></div>
      <div class="stat"><div class="stat-value">${me.stats.accuracy}%</div><div class="stat-label">Precision</div></div>
      <div class="stat"><div class="stat-value">${me.stats.avgTime}s</div><div class="stat-label">Temps moyen</div></div>
      <div class="stat"><div class="stat-value">×${me.stats.bestStreak}</div><div class="stat-label">Meilleur combo</div></div>
    `;
    $('endSub').textContent = me === ranking[0] ? '🏆 Bravo, tu remportes la partie !' : `Tu termines en ${ranking.indexOf(me) + 1}ᵉ position.`;
  } else {
    $('endSub').textContent = 'Resultats de la partie';
  }

  // Classement complet
  const rankBox = $('ranking');
  rankBox.innerHTML = ranking.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}">${s.avatar.emoji}</div>` : '';
    return `<div class="score-card ${cls}">${av}<div class="info"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div></div>`;
  }).join('');

  if (me === ranking[0]) {
    SFX.victory();
    if (window.fireConfetti) {
      window.fireConfetti(180);
      setTimeout(() => window.fireConfetti(120), 600);
      setTimeout(() => window.fireConfetti(80), 1200);
    }
  }
});

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

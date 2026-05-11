// ============================================================
// Logique cote animateur - Quiz BTS E4
// ============================================================
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 800,
  reconnectionDelayMax: 4000,
  reconnectionAttempts: Infinity,
});
const $ = id => document.getElementById(id);

let selectedCategory = '__ALL__';
let isHost = false;
let timerInterval = null;
let waitingForStart = null;

// Jeton persistant
function getHostToken() {
  let t = localStorage.getItem('hostToken');
  if (!t) {
    t = 'h_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('hostToken', t);
  }
  return t;
}
const HOST_TOKEN = getHostToken();
function claim() { socket.emit('host:claim', { token: HOST_TOKEN }); }

$('btnClaim').addEventListener('click', () => { SFX.click(); claim(); });

$('btnStart').addEventListener('click', () => {
  if (!isHost) { claim(); flashMsg('🔄 Reconnexion au role d\'animateur...', 'warn'); return; }
  const nb = parseInt($('nbQuestions').value, 10);
  const diff = $('difficulty').value || null;
  const mode = $('mode').value || 'classic';
  const diffLabel = diff === 'F' ? 'Facile' : diff === 'M' ? 'Moyen' : diff === 'D' ? 'Difficile' : 'toutes';
  SFX.click();
  flashMsg(`🚀 Lancement... ${diffLabel} · ${mode === 'survival' ? 'SURVIE' : 'classique'}`, 'info');
  socket.emit('host:start', { category: selectedCategory, nbQuestions: nb, difficulty: diff, mode });
  if (waitingForStart) clearTimeout(waitingForStart);
  waitingForStart = setTimeout(() => {
    flashMsg('⚠️ Pas de reponse du serveur. Au moins 1 joueur connecte ?', 'warn');
  }, 3000);
});

$('btnNext').addEventListener('click', () => { if (isHost) { SFX.click(); socket.emit('host:next'); } });
$('btnStopGame').addEventListener('click', () => {
  if (!isHost) return;
  if (confirm('Arreter la partie en cours ? Le classement sera fige.')) socket.emit('host:stop');
});
$('btnReset').addEventListener('click', () => {
  if (!isHost) return;
  if (confirm('Reinitialiser TOUTE la session ? Tous les joueurs seront deconnectes et un nouveau code session sera genere.')) {
    SFX.click();
    socket.emit('host:reset');
  }
});

const btnClearHist = document.getElementById('btnClearHistory');
if (btnClearHist) {
  btnClearHist.addEventListener('click', () => {
    if (!isHost) return;
    if (confirm('Vider l\'historique des questions deja vues ? (Toutes les questions redeviennent tirables.)')) {
      SFX.click();
      socket.emit('host:clearHistory');
    }
  });
}

async function refreshHistoryStats() {
  try {
    const r = await fetch('/api/history-stats');
    const data = await r.json();
    const el = document.getElementById('historyStats');
    if (el) el.textContent = `${data.seen} question(s) deja vue(s) ne seront pas re-posees.`;
  } catch (e) {}
}
setInterval(refreshHistoryStats, 4000);
refreshHistoryStats();

socket.on('history:cleared', () => { refreshHistoryStats(); flashMsg('🧹 Historique efface.', 'info'); });
socket.on('host:info', msg => flashMsg(msg, 'info'));
$('btnAgain').addEventListener('click', () => {
  SFX.click();
  $('end-card').classList.add('hidden');
  $('qr-card').classList.remove('hidden');
  $('config-card').classList.remove('hidden');
});

socket.on('connect', claim);

socket.on('host:granted', granted => {
  isHost = granted;
  $('claimMsg').classList.remove('hidden');
  if (granted) {
    $('claimMsg').textContent = '✅ Vous etes l\'animateur.';
    $('claim-card').classList.add('hidden');
    $('qr-card').classList.remove('hidden');
    $('config-card').classList.remove('hidden');
    loadLanUrl();
  } else {
    $('claimMsg').textContent = '⚠️ Un autre poste est deja animateur.';
  }
});

socket.on('host:error', msg => {
  if (waitingForStart) { clearTimeout(waitingForStart); waitingForStart = null; }
  flashMsg('❌ ' + msg, 'err');
});

async function loadLanUrl() {
  try {
    const r = await fetch('/api/lan-urls');
    const data = await r.json();
    const url = (data.urls && data.urls[0]) || `${window.location.protocol}//${window.location.host}/`;
    $('lanUrl').textContent = url;
  } catch (e) {
    $('lanUrl').textContent = window.location.origin + '/';
  }
}

socket.on('lobby:update', data => {
  // Code session
  if (data.sessionCode) $('sessionCodeDisplay').textContent = data.sessionCode;

  // categories : on met le "Programme complet" en premier, les generateurs sont deja inclus
  const list = $('catList');
  const cats = ['__ALL__', ...data.categories];
  list.innerHTML = cats.map(c => {
    const label = c === '__ALL__' ? '🎓 Programme complet (questions ecrites + generateurs)' : c;
    return `<div class="cat-item ${c===selectedCategory?'selected':''}" data-cat="${escapeAttr(c)}">${escapeHtml(label)}</div>`;
  }).join('');
  list.querySelectorAll('.cat-item').forEach(el => {
    el.addEventListener('click', () => {
      SFX.click();
      selectedCategory = el.dataset.cat;
      list.querySelectorAll('.cat-item').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  // joueurs en attente (utilise playersForHost si dispo : contient les socket IDs pour kick)
  const playersList = data.playersForHost || data.players.map(p => ({ ...p, id: null }));
  $('playerCount').textContent = playersList.length;
  const box = $('players');
  if (playersList.length === 0) {
    box.innerHTML = '<p class="sub">Aucun joueur connecte. Demande-leur de scanner le QR ou de taper le code session.</p>';
  } else {
    box.innerHTML = playersList.map(p => {
      const av = p.avatar ? `<div class="avatar" style="background:${p.avatar.color}">${p.avatar.emoji}</div>` : '';
      const kickBtn = p.id ? `<button class="kick-btn" data-id="${escapeAttr(p.id)}" data-name="${escapeAttr(p.name)}" title="Retirer ce joueur" aria-label="Kick">❌</button>` : '';
      return `<div class="score-card player-row">${av}<div class="info"><div class="name">${escapeHtml(p.name)}</div><div class="pts">Pret a jouer</div></div>${kickBtn}</div>`;
    }).join('');
    box.querySelectorAll('.kick-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pid = btn.dataset.id;
        const pname = btn.dataset.name;
        if (confirm(`Retirer ${pname} de la partie ?`)) {
          SFX.click();
          socket.emit('host:kick', { playerId: pid });
        }
      });
    });
  }
});

socket.on('session:reset', () => {
  $('end-card').classList.add('hidden');
  $('live-card').classList.add('hidden');
  $('scores-card').classList.add('hidden');
  $('qr-card').classList.remove('hidden');
  $('config-card').classList.remove('hidden');
  flashMsg('🔄 Session reinitialisee, nouveau code genere.', 'info');
});

socket.on('game:start', ({ mode }) => {
  $('qr-card').classList.add('hidden');
  $('config-card').classList.add('hidden');
  $('end-card').classList.add('hidden');
  $('live-card').classList.remove('hidden');
  $('scores-card').classList.remove('hidden');
  if (mode === 'survival') flashMsg('💀 Mode SURVIE active !', 'warn');
});

socket.on('game:question', ({ index, total, category, question, formula, svg, difficulty, choices, duration }) => {
  $('explanationBox').classList.add('hidden');
  $('explanationBox').innerHTML = '';
  $('phaseLabel').textContent = '⏱️ Question en cours - les joueurs repondent...';
  $('phaseLabel').classList.remove('phase-reveal');
  $('btnNext').textContent = '⏭️ Reveler maintenant';
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
    const div = document.createElement('div');
    div.className = 'choice';
    div.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(c)}</span>`;
    choicesBox.appendChild(div);
  });

  const start = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  let lastSec = Math.ceil(duration / 1000);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 100 - (elapsed / duration) * 100);
    $('timerBarInner').style.width = pct + '%';
    const remain = Math.ceil((duration - elapsed) / 1000);
    if (remain <= 5 && remain !== lastSec) {
      lastSec = remain;
      $('timerBar').classList.add('urgent');
      if (remain > 0) SFX.countdown();
    }
    if (pct <= 0) clearInterval(timerInterval);
  }, 80);
});

socket.on('game:answered', ({ statuses }) => {
  const box = $('answeredList');
  if (!box) return;
  box.innerHTML = statuses.map(p => {
    const av = `<div class="avatar" style="background:${p.avatar ? p.avatar.color : '#fbbf24'}">${p.avatar ? p.avatar.emoji : '👤'}</div>`;
    const label = p.answered ? '✅ A repondu' : '⏳ En reflexion';
    return `<div class="score-card ${p.answered ? 'answered' : ''}">${av}<div class="info"><div class="name">${escapeHtml(p.name)}</div><div class="pts" style="font-size:0.9rem; color:${p.answered ? '#34d399' : '#94a3b8'}">${label}</div></div></div>`;
  }).join('');
});

socket.on('game:reveal', ({ correctIndex, correctText, explanation, formula, svg, results, duration }) => {
  if (timerInterval) clearInterval(timerInterval);
  $('timerBarInner').style.width = '0%';
  $('timerBar').classList.remove('urgent');
  $('phaseLabel').textContent = '💡 Explication (' + Math.round((duration||20000)/1000) + 's)';
  $('phaseLabel').classList.add('phase-reveal');
  $('btnNext').textContent = '⏭️ Question suivante';

  const choicesBox = $('choices');
  [...choicesBox.children].forEach((b, i) => {
    if (i === correctIndex) b.classList.add('correct');
    else b.classList.add('dim');
  });
  SFX.correct();

  const goodPlayers = results.filter(r => r.correct);
  const expBox = $('explanationBox');
  let html = `<div class="exp-title">✅ Bonne reponse : <span class="exp-answer">${escapeHtml(correctText)}</span></div>`;
  if (formula) html += `<div class="exp-formula">📐 ${escapeHtml(formula)}</div>`;
  if (explanation) html += `<div class="exp-text">${escapeHtml(explanation)}</div>`;
  if (goodPlayers.length) {
    html += `<div class="exp-players">🏆 Trouvee par : ${goodPlayers.map(p => escapeHtml(p.name) + (p.streak >= 3 ? ` 🔥×${p.streak}` : '')).join(', ')}</div>`;
  } else {
    html += `<div class="exp-players">😶 Personne n'a trouve.</div>`;
  }
  expBox.innerHTML = html;
  expBox.classList.remove('hidden');

  if (duration) {
    const start = Date.now();
    timerInterval = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      $('timerBarInner').style.width = pct + '%';
      if (pct <= 0) clearInterval(timerInterval);
    }, 80);
  }
});

socket.on('game:scores', ({ scores, eliminated, teamTotals }) => {
  const box = $('scores');
  const teamBox = $('teamScores');
  if (teamTotals) {
    teamBox.classList.remove('hidden');
    teamBox.innerHTML = `
      <div class="team-totals">
        <div class="team-badge team-red">🟥 ROUGE : <strong>${teamTotals.red}</strong> pts</div>
        <div class="team-badge team-blue">🟦 BLEU : <strong>${teamTotals.blue}</strong> pts</div>
      </div>`;
  } else {
    teamBox.classList.add('hidden');
  }
  let html = scores.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const teamClass = s.team ? ` team-${s.team}` : '';
    const streak = s.streak >= 2 ? `<div class="streak">🔥${s.streak}</div>` : '';
    const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}">${s.avatar.emoji}</div>` : '';
    return `<div class="score-card ${cls}${teamClass}">${av}<div class="info"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>${streak}</div>`;
  }).join('');
  if (eliminated && eliminated.length) {
    html += eliminated.map(s => {
      const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}; opacity:0.4">${s.avatar.emoji}</div>` : '';
      return `<div class="score-card" style="opacity:0.5">${av}<div class="info"><div class="name">💀 ${escapeHtml(s.name)}</div><div class="pts">Elimine</div></div></div>`;
    }).join('');
  }
  box.innerHTML = html;
});

socket.on('game:end', ({ ranking, awards }) => {
  $('live-card').classList.add('hidden');
  $('scores-card').classList.add('hidden');
  $('end-card').classList.remove('hidden');

  const podium = $('podium');
  podium.innerHTML = '';
  const top3 = ranking.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];
  top3.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = `podium-spot podium-${i + 1}`;
    const av = p.avatar ? `<div class="avatar" style="background:${p.avatar.color}">${p.avatar.emoji}</div>` : '';
    div.innerHTML = `<div class="medal">${medals[i]}</div>${av}<div class="name">${escapeHtml(p.name)}</div><div class="pts">${p.score} pts</div>`;
    podium.appendChild(div);
  });

  if (awards) {
    let awardsHtml = '🏅 ';
    if (awards.fastest) awardsHtml += `<strong>⚡ Plus rapide</strong> : ${escapeHtml(awards.fastest)}. `;
    if (awards.bestStreak && awards.bestStreakValue >= 3) awardsHtml += `<strong>🔥 Meilleur combo</strong> : ${escapeHtml(awards.bestStreak)} (×${awards.bestStreakValue}).`;
    $('awards').innerHTML = awardsHtml;
  }

  const rankBox = $('ranking');
  rankBox.innerHTML = ranking.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}">${s.avatar.emoji}</div>` : '';
    const stat = s.stats ? `<div style="font-size:0.78rem; color:#94a3b8">${s.stats.correct}/${s.stats.answered} · ${s.stats.accuracy}%</div>` : '';
    return `<div class="score-card ${cls}">${av}<div class="info"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div>${stat}</div></div>`;
  }).join('');

  SFX.victory();
  if (window.fireConfetti) {
    window.fireConfetti(180);
    setTimeout(() => window.fireConfetti(120), 600);
    setTimeout(() => window.fireConfetti(80), 1200);
  }
});

function flashMsg(text, kind) {
  const el = document.createElement('div');
  el.className = 'toast';
  if (kind === 'err') el.style.borderColor = '#f87171';
  if (kind === 'warn') el.style.borderColor = '#fbbf24';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function escapeAttr(s) { return escapeHtml(s); }

// ============================================================
// PUPITRE ANIMATEUR - Quiz BTS E4
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
let lastQuestionChoices = null;
let lastQuestionCategory = null;

// === Jeton persistant ===
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

// === Boutons principaux ===
$('btnClaim').addEventListener('click', () => { SFX.click(); claim(); });

$('btnStart').addEventListener('click', () => {
  if (!isHost) { claim(); flashMsg('🔄 Reconnexion en tant qu\'animateur…', 'warn'); return; }
  const nb = parseInt($('nbQuestions').value, 10);
  const diff = $('difficulty').value || null;
  const mode = $('mode').value || 'classic';
  SFX.click();
  flashMsg('🚀 Lancement…', 'info');
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
  if (confirm('Reinitialiser TOUTE la session ? Tous les joueurs seront deconnectes.')) {
    SFX.click();
    socket.emit('host:reset');
  }
});

$('btnAgain').addEventListener('click', () => {
  SFX.click();
  $('end-card').classList.add('hidden');
  $('qr-card').classList.remove('hidden');
  $('config-card').classList.remove('hidden');
});

$('btnCopyUrl').addEventListener('click', () => {
  const t = $('lanUrl').textContent;
  navigator.clipboard.writeText(t).then(() => flashMsg('📋 URL copiee', 'info'));
});

const btnClearHist = $('btnClearHistory');
if (btnClearHist) btnClearHist.addEventListener('click', () => {
  if (!isHost) return;
  if (confirm('Vider l\'historique des questions ? Toutes seront a nouveau tirables.')) {
    SFX.click(); socket.emit('host:clearHistory');
  }
});

// === Indicateur de connexion (sticky en haut) ===
function setConn(s) {
  const el = $('connStatus');
  el.className = 'host-pill conn-status conn-' + s;
  el.textContent = s === 'connected' ? '🟢 Connecte' : s === 'reconnecting' ? '🟠 Reconnexion' : '⏳ Connexion';
}
socket.on('connect', () => { setConn('connected'); claim(); });
socket.on('disconnect', () => setConn('reconnecting'));
socket.on('connect_error', () => setConn('reconnecting'));

// === Claim host ===
socket.on('host:granted', granted => {
  isHost = granted;
  $('claimMsg').classList.remove('hidden');
  if (granted) {
    $('claimMsg').textContent = '✅ Tu es l\'animateur de cette session.';
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
socket.on('host:info', msg => flashMsg(msg, 'info'));

// === Charge l'URL publique a afficher ===
async function loadLanUrl() {
  try {
    const r = await fetch('/api/lan-urls');
    const data = await r.json();
    const url = data.primary || (data.urls && data.urls[0]) || (window.location.origin + '/');
    $('lanUrl').textContent = url;
  } catch (e) {
    $('lanUrl').textContent = window.location.origin + '/';
  }
}

// === Lobby (joueurs + categories + code session) ===
socket.on('lobby:update', data => {
  if (data.sessionCode) {
    $('sessionCodeDisplay').textContent = data.sessionCode;
    $('topCode').textContent = '🔢 ' + data.sessionCode;
  }
  $('topPlayers').textContent = '👥 ' + (data.players || []).length + ' joueur' + ((data.players||[]).length > 1 ? 's' : '');
  if (data.mode) {
    const labels = { classic:'🎮 Classique', survival:'💀 Survie', marathon:'🏃 Marathon', buzzer:'⚡ Buzzer', teams:'🟦🟥 Equipes' };
    $('topMode').textContent = labels[data.mode] || data.mode;
  }

  // categories
  const list = $('catList');
  const cats = ['__ALL__', ...data.categories];
  list.innerHTML = cats.map(c => {
    const label = c === '__ALL__' ? '🎓 Programme complet (statiques + generateurs)' : c;
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

  // joueurs en attente (kick possible)
  const playersList = data.playersForHost || data.players.map(p => ({ ...p, id: null }));
  $('playerCount').textContent = playersList.length;
  const box = $('players');
  if (playersList.length === 0) {
    box.innerHTML = '<div class="empty-state">Aucun joueur connecte. Demande-leur de scanner le QR ou de taper le code session.</div>';
  } else {
    box.innerHTML = playersList.map(p => playerCardLobby(p)).join('');
    box.querySelectorAll('.kick-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm(`Retirer ${btn.dataset.name} de la partie ?`)) {
          SFX.click();
          socket.emit('host:kick', { playerId: btn.dataset.id });
        }
      });
    });
  }
});

function playerCardLobby(p) {
  const av = p.avatar ? `<div class="avatar" style="background:${p.avatar.color}">${p.avatar.emoji}</div>` : '';
  const kick = p.id ? `<button class="kick-btn" data-id="${escapeAttr(p.id)}" data-name="${escapeAttr(p.name)}" title="Retirer">❌</button>` : '';
  return `<div class="score-card player-row">${av}<div class="info"><div class="name">${escapeHtml(p.name)}</div><div class="pts" style="font-size:0.8rem; color:#94a3b8">✅ Pret a jouer</div></div>${kick}</div>`;
}

socket.on('session:reset', () => {
  $('end-card').classList.add('hidden');
  $('live-card').classList.add('hidden');
  $('scores-card').classList.add('hidden');
  $('qr-card').classList.remove('hidden');
  $('config-card').classList.remove('hidden');
  flashMsg('🔄 Session reinitialisee, nouveau code genere.', 'info');
});

// === Stats historique ===
async function refreshHistoryStats() {
  try {
    const r = await fetch('/api/history-stats');
    const data = await r.json();
    const el = $('historyStats');
    if (el) el.textContent = `${data.seen} question(s) deja vue(s) ne seront pas re-posees.`;
  } catch (e) {}
}
setInterval(refreshHistoryStats, 4000);
refreshHistoryStats();
socket.on('history:cleared', () => { refreshHistoryStats(); flashMsg('🧹 Historique vide.', 'info'); });

// === Demarrage partie ===
socket.on('game:start', ({ mode, modeLabel }) => {
  $('qr-card').classList.add('hidden');
  $('config-card').classList.add('hidden');
  $('end-card').classList.add('hidden');
  $('live-card').classList.remove('hidden');
  $('scores-card').classList.remove('hidden');
  if (modeLabel) flashMsg('🎬 ' + modeLabel, 'info');
});

// === Question affichee ===
socket.on('game:question', ({ index, total, category, question, formula, svg, difficulty, choices, duration }) => {
  lastQuestionChoices = choices;
  lastQuestionCategory = category;

  $('explanationBox').classList.add('hidden');
  $('explanationBox').innerHTML = '';
  $('answerDist').classList.add('hidden');
  $('answerDistBars').innerHTML = '';
  $('phaseLabel').textContent = '⏱️ Question en cours – les joueurs reflechissent…';
  $('phaseLabel').classList.remove('phase-reveal');
  $('btnNext').textContent = '⏭️ Reveler maintenant';
  $('timerBar').classList.remove('urgent');
  $('liveTitle').textContent = '📡 En direct : qui a deja repondu';

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

// === En direct : qui a repondu (avant reveal) ===
socket.on('game:answered', ({ statuses }) => {
  const box = $('answeredList');
  if (!box) return;
  box.innerHTML = statuses.map(p => {
    const av = `<div class="avatar avatar-sm" style="background:${p.avatar ? p.avatar.color : '#fbbf24'}">${p.avatar ? p.avatar.emoji : '👤'}</div>`;
    const tag = p.answered
      ? `<span class="ans-tag tag-answered">✅ Repondu</span>`
      : `<span class="ans-tag tag-thinking">⏳ En reflexion</span>`;
    return `<div class="feed-row ${p.answered ? 'feed-answered' : ''}">${av}<span class="feed-name">${escapeHtml(p.name)}</span>${tag}</div>`;
  }).join('');
});

// === Reveal : reponse + histogramme + detail joueurs ===
socket.on('game:reveal', ({ correctIndex, correctText, explanation, formula, svg, results, distribution, playerDetails, duration }) => {
  if (timerInterval) clearInterval(timerInterval);
  $('timerBarInner').style.width = '0%';
  $('timerBar').classList.remove('urgent');
  $('phaseLabel').textContent = '💡 Explication';
  $('phaseLabel').classList.add('phase-reveal');
  $('btnNext').textContent = '⏭️ Question suivante';
  $('liveTitle').textContent = '📋 Detail des reponses par joueur';

  const choicesBox = $('choices');
  [...choicesBox.children].forEach((b, i) => {
    if (i === correctIndex) b.classList.add('correct');
    else b.classList.add('dim');
  });
  SFX.correct();

  // === HISTOGRAMME ===
  if (distribution && Array.isArray(distribution)) {
    const total = distribution.reduce((a, b) => a + b, 0) || 1;
    const letters = ['A', 'B', 'C', 'D'];
    $('answerDistBars').innerHTML = distribution.map((count, i) => {
      const pct = Math.round((count / total) * 100);
      const isCorrect = i === correctIndex;
      return `
        <div class="dist-row dist-${letters[i]}">
          <span class="dist-letter">${letters[i]} ${isCorrect ? '✓' : ''}</span>
          <div class="dist-bar-wrap"><div class="dist-bar dist-bar-${letters[i]} ${isCorrect ? 'is-correct' : ''}" style="width:${pct}%"></div></div>
          <span class="dist-count">${count}</span>
        </div>
      `;
    }).join('');
    $('answerDist').classList.remove('hidden');
  }

  // === EXPLICATION ===
  const expBox = $('explanationBox');
  let html = `<div class="exp-title">✅ Bonne reponse : <span class="exp-answer">${escapeHtml(correctText)}</span></div>`;
  if (formula) html += `<div class="exp-formula">📐 ${escapeHtml(formula)}</div>`;
  if (explanation) html += `<div class="exp-text">${escapeHtml(explanation)}</div>`;
  expBox.innerHTML = html;
  expBox.classList.remove('hidden');

  // === DETAIL PAR JOUEUR ===
  if (playerDetails && lastQuestionChoices) {
    const letters = ['A', 'B', 'C', 'D'];
    $('answeredList').innerHTML = playerDetails.map(p => {
      const av = `<div class="avatar avatar-sm" style="background:${p.avatar ? p.avatar.color : '#fbbf24'}">${p.avatar ? p.avatar.emoji : '👤'}</div>`;
      const myLetter = (p.answer !== null && p.answer >= 0) ? letters[p.answer] : '–';
      const cls = p.answer === null ? 'tag-noanswer' : (p.correct ? 'tag-correct' : 'tag-wrong');
      const txt = p.answer === null ? 'Pas repondu' : (p.correct ? `+${p.gained} pts` : 'Mauvaise');
      const letterBadge = p.answer !== null
        ? `<span class="ans-letter letter-${myLetter}">${myLetter}</span>`
        : `<span class="ans-letter letter-none">–</span>`;
      const streak = p.streak >= 2 ? ` 🔥×${p.streak}` : '';
      const lives = (p.lives !== undefined && p.lives !== null) ? ` ${'❤️'.repeat(Math.max(0, p.lives))}${p.lives <= 0 ? '💀' : ''}` : '';
      const accu = p.totalAnswered ? `<span class="ans-accu">${p.totalCorrect}/${p.totalAnswered}</span>` : '';
      return `<div class="feed-row reveal-row ${p.correct ? 'reveal-ok' : (p.answer === null ? 'reveal-none' : 'reveal-ko')}">
        ${av}
        <span class="feed-name">${escapeHtml(p.name)}${streak}${lives}</span>
        ${letterBadge}
        <span class="ans-tag ${cls}">${txt}</span>
        ${accu}
      </div>`;
    }).join('');
  }

  // Barre du timer pour la phase d'explication
  if (duration) {
    const start = Date.now();
    timerInterval = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      $('timerBarInner').style.width = pct + '%';
      if (pct <= 0) clearInterval(timerInterval);
    }, 80);
  }
});

// === Scores live ===
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
      return `<div class="score-card eliminated">${av}<div class="info"><div class="name">💀 ${escapeHtml(s.name)}</div><div class="pts">Elimine</div></div></div>`;
    }).join('');
  }
  box.innerHTML = html;
});

// === Fin de partie ===
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
    let html = '🏅 ';
    if (awards.fastest) html += `<strong>⚡ Plus rapide</strong> : ${escapeHtml(awards.fastest)}. `;
    if (awards.bestStreak && awards.bestStreakValue >= 3) html += `<strong>🔥 Meilleur combo</strong> : ${escapeHtml(awards.bestStreak)} (×${awards.bestStreakValue}).`;
    $('awards').innerHTML = html;
  }

  $('ranking').innerHTML = ranking.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const av = s.avatar ? `<div class="avatar" style="background:${s.avatar.color}">${s.avatar.emoji}</div>` : '';
    const stat = s.stats ? `<div class="card-stats">${s.stats.correct}/${s.stats.answered} · ${s.stats.accuracy}%</div>` : '';
    return `<div class="score-card ${cls}">${av}<div class="info"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div>${stat}</div></div>`;
  }).join('');

  SFX.victory();
  if (window.fireConfetti) {
    window.fireConfetti(180);
    setTimeout(() => window.fireConfetti(120), 600);
    setTimeout(() => window.fireConfetti(80), 1200);
  }
});

// === Utils ===
function flashMsg(text, kind) {
  const el = document.createElement('div');
  el.className = 'toast';
  if (kind === 'err') el.style.borderColor = '#f87171';
  if (kind === 'warn') el.style.borderColor = '#fbbf24';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function escapeAttr(s) { return escapeHtml(s); }

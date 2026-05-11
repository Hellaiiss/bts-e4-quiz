// Logique cote animateur
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
let waitingForStart = null; // timeout pour detecter l'absence de game:start

// Jeton persistant : permet de garder le role d'animateur meme apres reconnexion
function getHostToken() {
  let t = localStorage.getItem('hostToken');
  if (!t) {
    t = 'h_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('hostToken', t);
  }
  return t;
}
const HOST_TOKEN = getHostToken();

function claim() {
  socket.emit('host:claim', { token: HOST_TOKEN });
}

$('btnClaim').addEventListener('click', claim);

$('btnStart').addEventListener('click', () => {
  if (!isHost) {
    // tentative de re-claim avant d'echouer
    claim();
    flashMsg('🔄 Tentative de reconnexion en tant qu\'animateur... reclique dans 1 s.', 'warn');
    return;
  }
  const nb = parseInt($('nbQuestions').value, 10);
  const diff = $('difficulty').value || null;
  const diffLabel = diff === 'F' ? 'Facile' : diff === 'M' ? 'Moyen' : diff === 'D' ? 'Difficile' : 'toutes';
  console.log('[HOST] envoi host:start', { category: selectedCategory, nbQuestions: nb, difficulty: diff });
  flashMsg(`🚀 Lancement... (categorie : ${selectedCategory === '__ALL__' ? 'Programme complet' : selectedCategory}, ${diffLabel})`, 'info');
  socket.emit('host:start', { category: selectedCategory, nbQuestions: nb, difficulty: diff });
  // securite : si rien n'arrive sous 3 s, on previent
  if (waitingForStart) clearTimeout(waitingForStart);
  waitingForStart = setTimeout(() => {
    flashMsg('⚠️ Pas de reponse du serveur. Verifie qu\'au moins un joueur a rejoint la partie, ou recharge la page.', 'warn');
  }, 3000);
});

$('btnStop').addEventListener('click', () => {
  if (!isHost) return;
  if (confirm('Arreter la partie en cours ?')) socket.emit('host:stop');
});

// Bouton "Suivant" pendant la partie : revele ou passe selon la phase
$('btnNext').addEventListener('click', () => {
  if (!isHost) return;
  socket.emit('host:next');
});
$('btnStopGame').addEventListener('click', () => {
  if (!isHost) return;
  if (confirm('Arreter la partie ?')) socket.emit('host:stop');
});

$('btnAgain').addEventListener('click', () => {
  $('end-card').classList.add('hidden');
  $('config-card').classList.remove('hidden');
});

socket.on('connect', () => {
  // auto-claim avec jeton (re-prise du role apres reconnexion)
  claim();
});

socket.on('host:granted', granted => {
  isHost = granted;
  $('claimMsg').classList.remove('hidden');
  if (granted) {
    $('claimMsg').textContent = '✅ Vous etes l\'animateur. Configurez puis lancez la partie.';
    $('claim-card').classList.add('hidden');
    $('qr-card').classList.remove('hidden');
    $('config-card').classList.remove('hidden');
    loadLanUrl();
  } else {
    $('claimMsg').textContent = '⚠️ Un autre poste est deja animateur sur ce serveur.';
  }
});

// Recuperer l'URL LAN pour l'afficher en gros
async function loadLanUrl() {
  try {
    const r = await fetch('/api/lan-urls');
    const data = await r.json();
    const url = (data.urls && data.urls[0]) || `http://localhost:${data.port}/`;
    $('lanUrl').textContent = url;
  } catch (e) {
    $('lanUrl').textContent = 'http://<adresse-de-ce-poste>:3000/';
  }
}

socket.on('host:error', msg => {
  if (waitingForStart) { clearTimeout(waitingForStart); waitingForStart = null; }
  flashMsg('❌ ' + msg, 'err');
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

socket.on('lobby:update', data => {
  // construire la liste des categories
  const list = $('catList');
  const cats = ['__ALL__', ...data.categories];
  list.innerHTML = cats.map(c => {
    const label = c === '__ALL__' ? '🎓 Programme complet (toutes parties)' : c;
    return `<div class="cat-item ${c===selectedCategory?'selected':''}" data-cat="${escapeAttr(c)}">${escapeHtml(label)}</div>`;
  }).join('');
  list.querySelectorAll('.cat-item').forEach(el => {
    el.addEventListener('click', () => {
      selectedCategory = el.dataset.cat;
      list.querySelectorAll('.cat-item').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  // joueurs
  const box = $('players');
  box.innerHTML = data.players.length
    ? data.players.map(p => `<div class="score-card"><div class="name">${escapeHtml(p.name)}</div><div class="pts">${p.score} pts</div></div>`).join('')
    : '<p class="sub">Aucun joueur connecte pour le moment.</p>';
});

socket.on('game:start', () => {
  if (waitingForStart) { clearTimeout(waitingForStart); waitingForStart = null; }
  $('qr-card').classList.add('hidden');
  $('config-card').classList.add('hidden');
  $('end-card').classList.add('hidden');
  $('live-card').classList.remove('hidden');
  $('scores-card').classList.remove('hidden');
});

socket.on('game:question', ({ index, total, category, question, formula, svg, difficulty, choices, duration }) => {
  $('explanationBox').classList.add('hidden');
  $('explanationBox').innerHTML = '';
  $('phaseLabel').textContent = '⏱️ Question en cours - reponse mentale !';
  $('phaseLabel').classList.remove('phase-reveal');
  $('btnNext').classList.remove('hidden');
  $('btnNext').textContent = '⏭️ Reveler maintenant';
  const diffBadge = difficulty === 'F' ? '<span class="diff diff-F">🟢 Facile</span>'
                  : difficulty === 'M' ? '<span class="diff diff-M">🟡 Moyen</span>'
                  : difficulty === 'D' ? '<span class="diff diff-D">🔴 Difficile</span>'
                  : '';
  $('catTag').innerHTML = escapeHtml(category) + ' ' + diffBadge;
  $('progress').textContent = `Question ${index + 1} / ${total}`;
  $('qText').textContent = question;
  // formule
  const f = $('qFormula');
  if (formula) { f.innerHTML = '📐 ' + escapeHtml(formula); f.classList.remove('hidden'); }
  else { f.classList.add('hidden'); f.innerHTML = ''; }
  // visuel SVG
  const v = $('qVisual');
  if (svg) { v.innerHTML = svg; v.classList.remove('hidden'); }
  else { v.classList.add('hidden'); v.innerHTML = ''; }

  const choicesBox = $('choices');
  choicesBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  choices.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'choice';
    div.innerHTML = `<span class="letter">${letters[i]}</span>${escapeHtml(c)}`;
    choicesBox.appendChild(div);
  });
  const start = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
    $('timerBar').style.width = pct + '%';
    if (pct <= 0) clearInterval(timerInterval);
  }, 50);
});

socket.on('game:reveal', ({ correctIndex, correctText, explanation, formula, svg, results, duration }) => {
  if (timerInterval) clearInterval(timerInterval);
  $('timerBar').style.width = '0%';
  $('phaseLabel').textContent = '💡 Explication';
  $('phaseLabel').classList.add('phase-reveal');
  $('btnNext').classList.remove('hidden');
  $('btnNext').textContent = '⏭️ Question suivante';
  const choicesBox = $('choices');
  [...choicesBox.children].forEach((b, i) => {
    if (i === correctIndex) b.classList.add('correct');
  });
  const goodPlayers = results.filter(r => r.correct).map(r => r.name);
  const expBox = $('explanationBox');
  let html = `<div class="exp-title">✅ Bonne reponse : <span class="exp-answer">${escapeHtml(correctText)}</span></div>`;
  if (formula) html += `<div class="exp-formula">📐 ${escapeHtml(formula)}</div>`;
  if (explanation) html += `<div class="exp-text">${escapeHtml(explanation)}</div>`;
  html += `<div class="exp-players">${goodPlayers.length ? '🏆 Trouvee par : ' + goodPlayers.map(escapeHtml).join(', ') : '😶 Personne n\'a trouve.'}</div>`;
  expBox.innerHTML = html;
  expBox.classList.remove('hidden');

  // barre de progression pour la phase d'explication
  if (duration) {
    const start = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      $('timerBar').style.width = pct + '%';
      if (pct <= 0) clearInterval(timerInterval);
    }, 50);
  }
});

socket.on('game:scores', ({ scores }) => {
  const box = $('scores');
  box.innerHTML = scores.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    return `<div class="score-card ${cls}"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>`;
  }).join('');
});

socket.on('game:end', ({ ranking }) => {
  $('live-card').classList.add('hidden');
  $('qr-card').classList.remove('hidden');
  $('config-card').classList.remove('hidden');
  $('end-card').classList.remove('hidden');
  const box = $('ranking');
  box.innerHTML = ranking.map((s, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    return `<div class="score-card ${cls}"><div class="name">${medal} ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>`;
  }).join('');
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(s) { return escapeHtml(s); }

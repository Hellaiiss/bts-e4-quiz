// Logique cote joueur - reconnexion automatique + indicateur de statut
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 800,
  reconnectionDelayMax: 4000,
  reconnectionAttempts: Infinity,
});

const $ = id => document.getElementById(id);
const joinCard = $('join-card');
const waitingCard = $('waiting-card');
const gameCard = $('game-card');
const scoresCard = $('scores-card');
const endCard = $('end-card');
const connStatus = $('connStatus');

let myName = null;
let timerInterval = null;
let myChoice = null;
let isHost = false;

// pre-remplir le pseudo si deja saisi
const savedName = localStorage.getItem('playerName');
if (savedName) $('name').value = savedName;

function setConnStatus(state) {
  if (!connStatus) return;
  connStatus.className = 'conn-status conn-' + state;
  connStatus.textContent =
    state === 'connected' ? '🟢 Connecte' :
    state === 'connecting' ? '🟡 Connexion...' :
    state === 'reconnecting' ? '🟠 Reconnexion...' :
    '🔴 Hors ligne';
}

socket.on('connect', () => {
  setConnStatus('connected');
  // si on avait deja rejoint avec un pseudo : auto-rejoin apres reconnexion
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
  socket.emit('player:join', name);
});

$('btnHost').addEventListener('click', () => {
  // bascule vers la page d'animation
  window.location.href = '/host.html';
});

$('btnAgain').addEventListener('click', () => {
  endCard.classList.add('hidden');
  waitingCard.classList.remove('hidden');
});

socket.on('player:joined', ({ name }) => {
  myName = name;
  $('myName').textContent = name;
  joinCard.classList.add('hidden');
  waitingCard.classList.remove('hidden');
});

socket.on('lobby:update', (data) => {
  // affichage des joueurs en attente
  const box = $('lobbyPlayers');
  if (box) {
    box.innerHTML = data.players.map(p => `
      <div class="score-card"><div class="name">${escapeHtml(p.name)}</div><div class="pts">${p.score} pts</div></div>
    `).join('') || '<p class="sub">Aucun joueur encore connecte.</p>';
  }
});

socket.on('game:start', ({ total, category }) => {
  waitingCard.classList.add('hidden');
  endCard.classList.add('hidden');
  scoresCard.classList.remove('hidden');
  gameCard.classList.remove('hidden');
  toast(`La partie commence ! ${total} questions`);
});

socket.on('game:question', ({ index, total, category, question, formula, svg, difficulty, choices, duration }) => {
  myChoice = null;
  $('answerStatus').classList.add('hidden');
  $('answerStatus').textContent = '';
  $('explanationBox').classList.add('hidden');
  $('explanationBox').innerHTML = '';
  $('phaseLabel').textContent = '⏱️ Reponds mentalement !';
  $('phaseLabel').classList.remove('phase-reveal');
  const diffBadge = difficulty === 'F' ? '<span class="diff diff-F">🟢 Facile</span>'
                  : difficulty === 'M' ? '<span class="diff diff-M">🟡 Moyen</span>'
                  : difficulty === 'D' ? '<span class="diff diff-D">🔴 Difficile</span>'
                  : '';
  $('catTag').innerHTML = escapeHtml(category) + ' ' + diffBadge;
  $('progress').textContent = `Question ${index + 1} / ${total}`;
  $('qText').textContent = question;

  const f = $('qFormula');
  if (formula) { f.innerHTML = '📐 ' + escapeHtml(formula); f.classList.remove('hidden'); }
  else { f.classList.add('hidden'); f.innerHTML = ''; }
  const v = $('qVisual');
  if (svg) { v.innerHTML = svg; v.classList.remove('hidden'); }
  else { v.classList.add('hidden'); v.innerHTML = ''; }

  const choicesBox = $('choices');
  choicesBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = `<span class="letter">${letters[i]}</span>${escapeHtml(c)}`;
    btn.addEventListener('click', () => {
      if (myChoice !== null) return;
      myChoice = i;
      [...choicesBox.children].forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      socket.emit('player:answer', { choice: i });
      $('answerStatus').classList.remove('hidden');
      $('answerStatus').textContent = '✓ Reponse envoyee, on attend les autres...';
    });
    choicesBox.appendChild(btn);
  });

  // timer
  const start = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
    $('timerBar').style.width = pct + '%';
    if (pct <= 0) clearInterval(timerInterval);
  }, 50);
});

socket.on('player:answer:ack', () => {
  // rien de special, juste un retour visuel deja gere
});

socket.on('game:reveal', ({ correctIndex, correctText, explanation, formula, svg, results, duration }) => {
  if (timerInterval) clearInterval(timerInterval);
  $('timerBar').style.width = '0%';
  $('phaseLabel').textContent = '💡 Explication';
  $('phaseLabel').classList.add('phase-reveal');
  const choicesBox = $('choices');
  [...choicesBox.children].forEach((b, i) => {
    b.classList.remove('selected');
    if (i === correctIndex) b.classList.add('correct');
    else if (i === myChoice) b.classList.add('wrong');
  });
  const myResult = results.find(r => r.name === myName);
  if (myResult) {
    $('answerStatus').classList.remove('hidden');
    if (myResult.correct) {
      $('answerStatus').textContent = `✅ Bonne reponse ! +${myResult.gained} pts`;
    } else {
      $('answerStatus').textContent = `❌ Mauvaise reponse. La bonne reponse est : ${correctText}`;
    }
  }
  // affichage de l'explication
  const expBox = $('explanationBox');
  let html = `<div class="exp-title">✅ <span class="exp-answer">${escapeHtml(correctText)}</span></div>`;
  if (formula) html += `<div class="exp-formula">📐 ${escapeHtml(formula)}</div>`;
  if (explanation) html += `<div class="exp-text">${escapeHtml(explanation)}</div>`;
  expBox.innerHTML = html;
  expBox.classList.remove('hidden');

  // mettre a jour visuel si fournie dans la reveal (par securite)
  if (svg && !$('qVisual').innerHTML) {
    $('qVisual').innerHTML = svg;
    $('qVisual').classList.remove('hidden');
  }

  // barre de progression de la phase explication
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
  if (!box) return;
  box.innerHTML = scores.map((s, i) => {
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    return `<div class="score-card ${cls}"><div class="name">${i+1}. ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>`;
  }).join('');
});

socket.on('game:end', ({ ranking }) => {
  gameCard.classList.add('hidden');
  scoresCard.classList.add('hidden');
  endCard.classList.remove('hidden');
  const box = $('ranking');
  box.innerHTML = ranking.map((s, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
    const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    return `<div class="score-card ${cls}"><div class="name">${medal} ${escapeHtml(s.name)}</div><div class="pts">${s.score} pts</div></div>`;
  }).join('');
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

// Serveur de jeu multijoueur local - BTS Electrotechnique E4
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const compression = require('compression');
const QRCode = require('qrcode');
const os = require('os');
const path = require('path');
const QUESTIONS = require('./questions');

const app = express();
const server = http.createServer(app);

// Socket.IO tuning pour mobiles / Wi-Fi instable :
// - WebSocket prioritaire (rapide), polling en secours pour reseaux qui le bloquent
// - pingTimeout genereux pour eviter les fausses deconnexions sur Wi-Fi pourri
// - maxHttpBufferSize raisonnable
const io = new Server(server, {
  pingInterval: 25000,
  pingTimeout: 60000,
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 1e6,
  cors: { origin: true },
});

// Compression gzip de tous les assets (gain enorme sur reseau lent)
app.use(compression());

// Cache court pour les assets statiques (1h) afin de soulager le reseau lors des relances
// Chemin du dossier public absolu (compatible pkg/.exe et lancement npm)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
}));

const PORT = process.env.PORT || 3000;

// Endpoint LAN : renvoie les URLs IPv4 locales pour partage rapide
function localIPs() {
  const ifs = os.networkInterfaces();
  const out = [];
  for (const name of Object.keys(ifs)) {
    for (const ni of ifs[name]) {
      if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address);
    }
  }
  return out;
}

app.get('/api/lan-urls', (req, res) => {
  res.json({
    port: PORT,
    urls: localIPs().map(ip => `http://${ip}:${PORT}/`),
  });
});

// QR code (PNG) qui pointe vers l'URL de connexion joueur
app.get('/qr.png', async (req, res) => {
  try {
    const ip = localIPs()[0] || 'localhost';
    const url = `http://${ip}:${PORT}/`;
    const buf = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      width: 360,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'no-store');
    res.send(buf);
  } catch (e) {
    res.status(500).send('QR generation error');
  }
});

// ===== Pool d'avatars (emoji + couleur) attribues automatiquement =====
const AVATAR_POOL = [
  { emoji: '🦊', color: '#f97316' }, { emoji: '🐼', color: '#64748b' },
  { emoji: '🦁', color: '#eab308' }, { emoji: '🐯', color: '#f59e0b' },
  { emoji: '🐸', color: '#22c55e' }, { emoji: '🦉', color: '#a78bfa' },
  { emoji: '🐺', color: '#94a3b8' }, { emoji: '🦄', color: '#ec4899' },
  { emoji: '🐙', color: '#a855f7' }, { emoji: '🦅', color: '#0ea5e9' },
  { emoji: '🐲', color: '#10b981' }, { emoji: '🦊', color: '#dc2626' },
  { emoji: '🐧', color: '#0284c7' }, { emoji: '🐝', color: '#facc15' },
  { emoji: '🦋', color: '#06b6d4' }, { emoji: '🐢', color: '#16a34a' },
  { emoji: '🦖', color: '#65a30d' }, { emoji: '🦈', color: '#0369a1' },
  { emoji: '🐉', color: '#7c3aed' }, { emoji: '🦩', color: '#f472b6' },
];
let avatarIdx = Math.floor(Math.random() * AVATAR_POOL.length);
function nextAvatar() {
  const a = AVATAR_POOL[avatarIdx % AVATAR_POOL.length];
  avatarIdx++;
  return { emoji: a.emoji, color: a.color };
}

// Code session 4 chiffres (regenere a chaque demarrage du serveur)
function genSessionCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Etat global du jeu
const state = {
  sessionCode: genSessionCode(),
  hostId: null,
  hostToken: null,    // jeton persistant cote client (localStorage)
  players: {},        // socketId -> { name, score, avatar, streak, answeredThisQuestion, lastAnswer, lastTime, totalAnswered, totalCorrect, avgTime }
  category: null,
  questions: [],      // sous-ensemble actif pour la partie
  currentIndex: -1,
  questionDeadline: null,
  questionTimer: null,
  questionDuration: 25000,    // ms pour repondre
  explanationTimer: null,
  explanationDuration: 20000, // ms pour lire l'explication
  inProgress: false,
  phase: 'idle',              // 'idle' | 'question' | 'explanation'
  history: [],                // suivi des questions posees (texte court)
  mode: 'classic',            // 'classic' | 'survival'
};

function playerPublic(p) {
  return {
    name: p.name,
    score: p.score,
    avatar: p.avatar,
    streak: p.streak || 0,
    answered: !!p.answeredThisQuestion,
    eliminated: !!p.eliminated,
  };
}

function broadcastLobby() {
  io.emit('lobby:update', {
    players: Object.values(state.players).map(playerPublic),
    categories: Object.keys(QUESTIONS),
    inProgress: state.inProgress,
    category: state.category,
    sessionCode: state.sessionCode,
  });
}

function broadcastScores() {
  io.emit('game:scores', {
    scores: Object.values(state.players)
      .filter(p => !p.eliminated)
      .map(playerPublic)
      .sort((a, b) => b.score - a.score),
    eliminated: Object.values(state.players)
      .filter(p => p.eliminated)
      .map(playerPublic),
  });
}

// Indicateur temps reel "qui a repondu" - throttle leger pour 10+ joueurs
let answeredTimeout = null;
function broadcastAnswered() {
  if (answeredTimeout) return;
  answeredTimeout = setTimeout(() => {
    answeredTimeout = null;
    io.emit('game:answered', {
      statuses: Object.values(state.players)
        .filter(p => !p.eliminated)
        .map(p => ({
          name: p.name,
          avatar: p.avatar,
          answered: !!p.answeredThisQuestion,
        })),
    });
  }, 100);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame(category, nbQuestions, difficulty, mode) {
  state.category = category;
  state.mode = mode === 'survival' ? 'survival' : 'classic';
  let all = category === '__ALL__'
    ? Object.entries(QUESTIONS).flatMap(([cat, qs]) => qs.map(q => ({ ...q, cat })))
    : QUESTIONS[category].map(q => ({ ...q, cat: category }));
  if (difficulty && ['F','M','D'].includes(difficulty)) {
    all = all.filter(q => q.d === difficulty);
  }
  if (all.length === 0) {
    all = Object.entries(QUESTIONS).flatMap(([cat, qs]) => qs.map(q => ({ ...q, cat })));
  }
  state.questions = shuffle(all).slice(0, nbQuestions || all.length);
  state.currentIndex = -1;
  state.inProgress = true;
  state.history = [];
  // remise a zero des scores + streaks + stats
  Object.values(state.players).forEach(p => {
    p.score = 0;
    p.streak = 0;
    p.totalAnswered = 0;
    p.totalCorrect = 0;
    p.totalTime = 0;
    p.bestStreak = 0;
    p.wrongQuestions = [];
    p.eliminated = false;
    p.lives = 3;
  });
  io.emit('game:start', {
    total: state.questions.length,
    category: state.category,
    mode: state.mode,
  });
  broadcastScores();
  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  if (state.explanationTimer) { clearTimeout(state.explanationTimer); state.explanationTimer = null; }
  state.currentIndex += 1;
  if (state.currentIndex >= state.questions.length) {
    return endGame();
  }
  const q = state.questions[state.currentIndex];
  Object.values(state.players).forEach(p => {
    p.answeredThisQuestion = false;
    p.lastAnswer = null;
    p.lastTime = null;
  });
  state.questionDeadline = Date.now() + state.questionDuration;
  state.phase = 'question';

  io.emit('game:question', {
    index: state.currentIndex,
    total: state.questions.length,
    category: q.cat,
    question: q.q,
    formula: q.formula || '',
    svg: q.svg || '',
    difficulty: q.d || '',
    choices: q.c,
    duration: state.questionDuration,
  });

  if (state.questionTimer) clearTimeout(state.questionTimer);
  state.questionTimer = setTimeout(revealAnswer, state.questionDuration + 200);
}

function revealAnswer() {
  const q = state.questions[state.currentIndex];
  if (!q) return;
  state.phase = 'explanation';

  // calcul scores : reponse correcte + bonus rapidite + bonus de combo
  const results = [];
  Object.entries(state.players).forEach(([id, p]) => {
    if (p.eliminated) {
      results.push({ name: p.name, correct: false, gained: 0, answer: null, streak: 0, eliminated: true });
      return;
    }
    const answered = p.lastAnswer !== null && p.lastAnswer !== undefined;
    const correct = answered && p.lastAnswer === q.r;
    let gained = 0;
    let comboBonus = 0;

    if (answered) {
      p.totalAnswered++;
      p.totalTime += (state.questionDuration - (p.lastTime || 0));
    }

    if (correct) {
      const elapsed = Math.max(0, (p.lastTime || state.questionDuration));
      const speedBonus = Math.floor((elapsed / state.questionDuration) * 500);
      const base = 500;
      // bonus de combo : +50 par question de la chaine, max +300
      p.streak = (p.streak || 0) + 1;
      comboBonus = Math.min(300, (p.streak - 1) * 100);
      gained = base + speedBonus + comboBonus;
      p.score += gained;
      p.totalCorrect++;
      if (p.streak > (p.bestStreak || 0)) p.bestStreak = p.streak;
    } else {
      p.streak = 0;
      if (answered && q.r !== undefined) {
        p.wrongQuestions.push({ q: q.q, cat: q.cat, good: q.c[q.r], mine: p.c && p.c[p.lastAnswer] });
      }
      // mode survival : perte d'une vie
      if (state.mode === 'survival') {
        p.lives = (p.lives || 3) - 1;
        if (p.lives <= 0) {
          p.eliminated = true;
        }
      }
    }
    results.push({
      name: p.name, avatar: p.avatar, correct, gained, comboBonus,
      streak: p.streak, answer: p.lastAnswer, eliminated: !!p.eliminated,
      lives: p.lives,
    });
  });

  state.history.push({ q: q.q, cat: q.cat, good: q.c[q.r] });

  io.emit('game:reveal', {
    correctIndex: q.r,
    correctText: q.c[q.r],
    explanation: q.explanation || '',
    formula: q.formula || '',
    svg: q.svg || '',
    results,
    duration: state.explanationDuration,
  });
  broadcastScores();

  // survival : si plus qu'un joueur, fin
  if (state.mode === 'survival') {
    const alive = Object.values(state.players).filter(p => !p.eliminated);
    if (alive.length <= 1 && Object.keys(state.players).length > 1) {
      setTimeout(endGame, 4000);
      return;
    }
  }

  if (state.explanationTimer) clearTimeout(state.explanationTimer);
  state.explanationTimer = setTimeout(nextQuestion, state.explanationDuration);
}

function endGame() {
  state.inProgress = false;
  const ranking = Object.values(state.players)
    .map(p => ({
      name: p.name,
      score: p.score,
      avatar: p.avatar,
      stats: {
        answered: p.totalAnswered || 0,
        correct: p.totalCorrect || 0,
        accuracy: p.totalAnswered ? Math.round((p.totalCorrect / p.totalAnswered) * 100) : 0,
        avgTime: p.totalAnswered ? Math.round((p.totalTime / p.totalAnswered) / 100) / 10 : 0,
        bestStreak: p.bestStreak || 0,
        eliminated: !!p.eliminated,
      },
    }))
    .sort((a, b) => b.score - a.score);
  // Recompenses
  const fastestPlayer = ranking.slice().sort((a, b) => a.stats.avgTime - b.stats.avgTime)[0];
  const bestStreakPlayer = ranking.slice().sort((a, b) => b.stats.bestStreak - a.stats.bestStreak)[0];
  io.emit('game:end', {
    ranking,
    history: state.history,
    awards: {
      fastest: fastestPlayer ? fastestPlayer.name : null,
      bestStreak: bestStreakPlayer ? bestStreakPlayer.name : null,
      bestStreakValue: bestStreakPlayer ? bestStreakPlayer.stats.bestStreak : 0,
    },
  });
  broadcastLobby();
}

io.on('connection', socket => {
  console.log(`[CONNECT] ${socket.id}`);
  // un client est par defaut joueur ; le premier qui demande devient host
  // Le client envoie un jeton (localStorage) ; on l'utilise pour permettre
  // de re-prendre la main apres une reconnexion sans perdre le statut.
  socket.on('host:claim', (payload) => {
    const token = (payload && typeof payload === 'object') ? payload.token : null;
    const sameOwner = token && state.hostToken && token === state.hostToken;
    if (!state.hostToken || sameOwner) {
      // premier demandeur OU meme animateur qui se reconnecte
      state.hostId = socket.id;
      if (!state.hostToken && token) state.hostToken = token;
      socket.emit('host:granted', true);
      console.log(`[HOST] claim accepte par ${socket.id} (token=${state.hostToken ? state.hostToken.slice(0,6) : 'aucun'})`);
    } else {
      socket.emit('host:granted', false);
      console.log(`[HOST] claim refuse pour ${socket.id} (deja anime par un autre)`);
    }
    broadcastLobby();
  });

  socket.on('player:join', name => {
    name = (name || 'Joueur').toString().slice(0, 20).trim() || 'Joueur';
    // Si pseudo deja pris (reco), on garde l'avatar precedent
    const existing = Object.values(state.players).find(p => p.name === name);
    const avatar = existing ? existing.avatar : nextAvatar();
    state.players[socket.id] = {
      name,
      score: 0,
      avatar,
      streak: 0,
      answeredThisQuestion: false,
      lastAnswer: null,
      lastTime: null,
      totalAnswered: 0,
      totalCorrect: 0,
      totalTime: 0,
      bestStreak: 0,
      wrongQuestions: [],
      eliminated: false,
      lives: 3,
    };
    socket.emit('player:joined', { name, avatar });
    broadcastLobby();
    broadcastScores();
  });

  socket.on('host:start', ({ category, nbQuestions, difficulty, mode } = {}) => {
    if (socket.id !== state.hostId) {
      console.log(`[START] refuse : ${socket.id} n'est pas l'animateur (host=${state.hostId})`);
      socket.emit('host:error', 'Vous n\'etes pas reconnu comme animateur (rechargez la page).');
      return;
    }
    if (state.inProgress) {
      console.log('[START] refuse : partie deja en cours');
      socket.emit('host:error', 'Une partie est deja en cours.');
      return;
    }
    if (!category || (category !== '__ALL__' && !QUESTIONS[category])) {
      console.log(`[START] refuse : categorie invalide (${category})`);
      socket.emit('host:error', 'Categorie invalide.');
      return;
    }
    const nbPlayers = Object.keys(state.players).length;
    if (nbPlayers === 0) {
      console.log('[START] refuse : aucun joueur connecte');
      socket.emit('host:error', 'Aucun joueur connecte. Demande aux joueurs de rejoindre depuis leur navigateur.');
      return;
    }
    console.log(`[START] ${category} - ${nbQuestions} questions - difficulte=${difficulty || 'toutes'} - mode=${mode || 'classic'} - ${nbPlayers} joueur(s)`);
    startGame(category, nbQuestions, difficulty, mode);
  });

  socket.on('host:stop', () => {
    if (socket.id !== state.hostId) return;
    if (state.questionTimer) clearTimeout(state.questionTimer);
    if (state.explanationTimer) clearTimeout(state.explanationTimer);
    endGame();
  });

  socket.on('host:next', () => {
    if (socket.id !== state.hostId) return;
    if (!state.inProgress) return;
    if (state.phase === 'explanation') {
      console.log('[NEXT] animateur passe a la question suivante');
      if (state.explanationTimer) { clearTimeout(state.explanationTimer); state.explanationTimer = null; }
      nextQuestion();
    } else if (state.phase === 'question') {
      // forcer la revelation immediate
      console.log('[NEXT] animateur revele immediatement la reponse');
      if (state.questionTimer) { clearTimeout(state.questionTimer); state.questionTimer = null; }
      revealAnswer();
    }
  });

  socket.on('player:answer', ({ choice }) => {
    const p = state.players[socket.id];
    if (!p || !state.inProgress || p.eliminated) return;
    if (p.answeredThisQuestion) return;
    if (typeof choice !== 'number' || choice < 0 || choice > 3) return;
    p.answeredThisQuestion = true;
    p.lastAnswer = choice;
    p.lastTime = Math.max(0, state.questionDeadline - Date.now());
    socket.emit('player:answer:ack', { choice });
    broadcastAnswered();

    // si tout le monde a repondu : on revele avant la fin du timer
    const activePlayers = Object.values(state.players).filter(pl => !pl.eliminated);
    const allAnswered = activePlayers.length > 0 && activePlayers.every(pl => pl.answeredThisQuestion);
    if (allAnswered) {
      if (state.questionTimer) clearTimeout(state.questionTimer);
      setTimeout(revealAnswer, 400);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] ${socket.id}`);
    if (state.hostId === socket.id) {
      // on garde hostToken : le meme animateur pourra re-prendre la main au retour
      state.hostId = null;
    }
    delete state.players[socket.id];
    broadcastLobby();
    broadcastScores();
  });
});

server.listen(PORT, () => {
  console.log('=================================================');
  console.log(' Quiz BTS Electrotechnique E4 - serveur demarre');
  console.log('=================================================');
  console.log(` Local       : http://localhost:${PORT}`);
  localIPs().forEach(ip => console.log(` Reseau LAN  : http://${ip}:${PORT}`));
  console.log('');
  console.log(' L\'animateur ouvre /host.html (pour piloter).');
  console.log(' Les joueurs scannent le QR code affiche cote animateur.');
  console.log('');
  console.log(' ⚠️ Si les joueurs distants n\'arrivent pas a se connecter :');
  console.log('   1) verifier qu\'ils sont sur le MEME reseau Wi-Fi');
  console.log('   2) autoriser node.exe sur le pare-feu Windows (reseau prive)');
  console.log('   3) couper temporairement le pare-feu Windows si besoin');
  console.log('=================================================');
});

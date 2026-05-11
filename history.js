// ============================================================
// Historique des questions : empeche que la meme question soit posee
// 2 fois (ni dans une partie, ni a travers plusieurs parties).
//
// Persistance : on tente d'ecrire dans un fichier .json local.
// Si echec (Render free tier = filesystem ephemere) : fallback memoire.
// ============================================================

const fs = require('fs');
const path = require('path');

const HIST_FILE = path.join(__dirname, '.question-history.json');

let seen = new Set();
let persistOk = true;

function load() {
  try {
    if (fs.existsSync(HIST_FILE)) {
      const data = JSON.parse(fs.readFileSync(HIST_FILE, 'utf8'));
      if (Array.isArray(data)) seen = new Set(data);
    }
  } catch (e) {
    console.warn('[HISTORY] impossible de charger l\'historique :', e.message);
    persistOk = false;
  }
}

function save() {
  if (!persistOk) return;
  try {
    fs.writeFileSync(HIST_FILE, JSON.stringify([...seen]));
  } catch (e) {
    console.warn('[HISTORY] impossible de sauvegarder :', e.message);
    persistOk = false;
  }
}

function signature(q) {
  if (!q) return '';
  // Hash compact : enonce + reponses jointes
  const choices = (q.c || []).slice().sort().join('|');
  return (q.q || '') + '##' + choices;
}

module.exports = {
  has(q) { return seen.has(signature(q)); },
  add(q) { seen.add(signature(q)); if (seen.size % 5 === 0) save(); },
  reset() { seen.clear(); save(); console.log('[HISTORY] historique reinitialise'); },
  size() { return seen.size; },
  load,
};

// chargement au demarrage
load();
console.log(`[HISTORY] ${seen.size} questions deja vues (chargees depuis disque)`);

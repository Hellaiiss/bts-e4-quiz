// Sons generes en Web Audio API (zero fichier audio a telecharger)
// API : SFX.correct(), SFX.wrong(), SFX.click(), SFX.tick(), SFX.victory(), SFX.timesUp(), SFX.combo()
(function () {
  let ctx = null;
  let enabled = true;
  // L'audio context doit etre demarre apres une interaction utilisateur (politique navigateur)
  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { enabled = false; return null; }
    }
    return ctx;
  }
  document.addEventListener('click', function once() {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume();
    document.removeEventListener('click', once);
  });

  function tone(freq, dur = 0.15, type = 'sine', vol = 0.15) {
    if (!enabled) return;
    const c = getCtx(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur + 0.02);
  }
  function seq(notes) {
    const c = getCtx(); if (!c) return;
    notes.forEach(([f, dly, dur, type, vol]) => {
      setTimeout(() => tone(f, dur || 0.15, type || 'triangle', vol || 0.15), dly * 1000);
    });
  }

  window.SFX = {
    enabled: () => enabled,
    setEnabled: v => { enabled = !!v; },
    click: () => tone(800, 0.04, 'square', 0.08),
    tick: () => tone(1200, 0.03, 'square', 0.05),
    correct: () => seq([
      [523, 0,    0.12, 'triangle', 0.15], // do
      [659, 0.10, 0.12, 'triangle', 0.15], // mi
      [784, 0.20, 0.20, 'triangle', 0.18], // sol
    ]),
    wrong: () => seq([
      [200, 0,    0.18, 'sawtooth', 0.12],
      [140, 0.18, 0.30, 'sawtooth', 0.12],
    ]),
    timesUp: () => seq([
      [440, 0,    0.10, 'square', 0.15],
      [330, 0.12, 0.10, 'square', 0.15],
      [220, 0.24, 0.30, 'square', 0.18],
    ]),
    victory: () => seq([
      [523, 0,    0.10, 'triangle', 0.15],
      [659, 0.12, 0.10, 'triangle', 0.15],
      [784, 0.24, 0.10, 'triangle', 0.15],
      [1047, 0.36, 0.30, 'triangle', 0.20],
    ]),
    combo: () => seq([
      [880,  0,    0.06, 'square', 0.12],
      [1175, 0.06, 0.06, 'square', 0.12],
      [1568, 0.12, 0.10, 'square', 0.14],
    ]),
    countdown: () => tone(800, 0.05, 'square', 0.08),
  };
})();

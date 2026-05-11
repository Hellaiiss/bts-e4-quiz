// ============================================================
// GENERATEURS DE QUESTIONS PARAMETRES
// Chaque generateur produit une question fraiche a chaque appel,
// avec des chiffres ronds tires aleatoirement (mental math friendly).
//
// Toutes les propositions sont equilibrees en longueur (~ meme nb
// de caracteres) pour empecher la triche "la plus longue = la bonne".
// La position de la bonne reponse est aleatoire.
// ============================================================

// ===== Utilitaires =====
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Format nombre joli : entier ou decimal court, virgule francaise
function fmt(n) {
  if (Number.isInteger(n)) return String(n);
  const s = Math.round(n * 100) / 100;
  return String(s).replace('.', ',');
}

// Melange 4 propositions et renvoie { c, r }
// On supprime les doublons (si un distractor egale la bonne reponse) et on complete si besoin
function buildChoices(correct, distractors, fallbacks = []) {
  const seen = new Set([correct]);
  const out = [correct];
  for (const d of distractors) {
    if (!seen.has(d) && out.length < 4) { seen.add(d); out.push(d); }
  }
  for (const f of fallbacks) {
    if (out.length >= 4) break;
    if (!seen.has(f)) { seen.add(f); out.push(f); }
  }
  // securite : si encore manque, ajoute des "X V/A/W" derives
  while (out.length < 4) out.push('Aucune de ces valeurs');
  // melange (Fisher-Yates)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return { c: out, r: out.indexOf(correct) };
}

// ===== Generateurs =====
const GENERATORS = {

  // -------- 1. Lois fondamentales --------
  loiOhm_U: () => {
    const R = rand([5, 10, 20, 25, 50, 100, 200, 500]);
    const I = rand([0.1, 0.2, 0.5, 1, 2, 5, 10]);
    const U = Math.round(R * I * 100) / 100;
    const correct = `${fmt(U)} V`;
    const dist = [
      `${fmt(U * 2)} V`,
      `${fmt(U / 2)} V`,
      `${fmt(Math.max(0.01, U - R/2))} V`,
      `${fmt(U + 1)} V`,
      `${fmt(R / I)} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Une resistance de ${R} Ω est traversee par ${fmt(I)} A. Quelle est la tension a ses bornes ?`,
      c, r, d: 'F',
      explanation: `Loi d'Ohm : U = R × I = ${R} × ${fmt(I)} = ${fmt(U)} V.`,
    };
  },

  loiOhm_I: () => {
    const R = rand([5, 10, 20, 50, 100, 200]);
    const Ichoice = rand([0.1, 0.5, 1, 2, 5, 10]);
    const U = Math.round(R * Ichoice * 100) / 100;
    const I = Math.round((U / R) * 100) / 100;
    const correct = `${fmt(I)} A`;
    const dist = [
      `${fmt(U * R)} A`,
      `${fmt(I * 10)} A`,
      `${fmt(I / 10)} A`,
      `${fmt(R / U)} A`,
      `${fmt(I + 1)} A`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Une resistance de ${R} Ω est soumise a ${fmt(U)} V. Quel est le courant qui la traverse ?`,
      c, r, d: 'F',
      explanation: `I = U / R = ${fmt(U)} / ${R} = ${fmt(I)} A.`,
    };
  },

  loiOhm_R: () => {
    const I = rand([0.5, 1, 2, 5, 10]);
    const Rch = rand([2, 5, 10, 20, 50, 100]);
    const U = Math.round(Rch * I * 100) / 100;
    const R = Math.round((U / I) * 100) / 100;
    const correct = `${fmt(R)} Ω`;
    const dist = [
      `${fmt(R * 2)} Ω`,
      `${fmt(R / 2)} Ω`,
      `${fmt(U * I)} Ω`,
      `${fmt(R + I)} Ω`,
      `${fmt(R - 1)} Ω`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Sous ${fmt(U)} V, un recepteur consomme ${fmt(I)} A. Quelle est sa resistance ?`,
      c, r, d: 'F',
      explanation: `R = U / I = ${fmt(U)} / ${fmt(I)} = ${fmt(R)} Ω.`,
    };
  },

  joule: () => {
    const R = rand([5, 10, 20, 50, 100]);
    const I = rand([1, 2, 3, 4, 5, 10]);
    const P = R * I * I;
    const correct = `${fmt(P)} W`;
    const dist = [
      `${fmt(R * I)} W`,
      `${fmt(P * 2)} W`,
      `${fmt(P / 2)} W`,
      `${fmt(P + R)} W`,
      `${fmt(I * I)} W`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Resistance de ${R} Ω traversee par ${I} A. Puissance dissipee par effet Joule ?`,
      c, r, d: 'M',
      explanation: `P = R × I² = ${R} × ${I}² = ${R} × ${I*I} = ${fmt(P)} W.`,
    };
  },

  serie2: () => {
    const R1 = rand([10, 20, 30, 50, 100, 200]);
    const R2 = rand([10, 20, 30, 50, 100, 200]);
    const Req = R1 + R2;
    const correct = `${fmt(Req)} Ω`;
    const dist = [
      `${fmt(R1 * R2)} Ω`,
      `${fmt(Math.abs(R1 - R2))} Ω`,
      `${fmt((R1 * R2) / (R1 + R2))} Ω`,
      `${fmt(Req * 2)} Ω`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Deux resistances ${R1} Ω et ${R2} Ω sont placees en serie. Resistance equivalente ?`,
      c, r, d: 'F',
      explanation: `En serie on additionne : ${R1} + ${R2} = ${fmt(Req)} Ω.`,
    };
  },

  parallele2: () => {
    const R = rand([10, 20, 30, 50, 100, 200]);
    const Req = R / 2;
    const correct = `${fmt(Req)} Ω`;
    const dist = [
      `${fmt(R * 2)} Ω`,
      `${fmt(R)} Ω`,
      `${fmt(R / 4)} Ω`,
      `${fmt(R * R)} Ω`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Deux resistances identiques de ${R} Ω sont placees en parallele. Resistance equivalente ?`,
      c, r, d: 'F',
      explanation: `Deux R identiques en parallele : Req = R/2 = ${R}/2 = ${fmt(Req)} Ω.`,
    };
  },

  parallele_n: () => {
    const R = rand([30, 60, 100, 200, 300]);
    const n = rand([2, 3, 4, 5]);
    const Req = R / n;
    const correct = `${fmt(Req)} Ω`;
    const dist = [
      `${fmt(R * n)} Ω`,
      `${fmt(R + n)} Ω`,
      `${fmt(R)} Ω`,
      `${fmt(R / (n + 1))} Ω`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `${n} resistances identiques de ${R} Ω sont placees en parallele. Resistance equivalente ?`,
      c, r, d: 'M',
      explanation: `n resistances identiques en parallele : Req = R/n = ${R}/${n} = ${fmt(Req)} Ω.`,
    };
  },

  pontDiv: () => {
    const k = rand([2, 3, 4, 5]); // R1/R2 ratio
    const R2 = rand([1, 2, 5, 10]);
    const R1 = R2 * (k - 1);
    const U = rand([10, 12, 24, 30, 60, 100]);
    const U2 = (U * R2) / (R1 + R2);
    const correct = `${fmt(U2)} V`;
    const dist = [
      `${fmt(U)} V`,
      `${fmt(U / 2)} V`,
      `${fmt(U - U2)} V`,
      `${fmt(U * R1 / (R1 + R2))} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Pont diviseur : U = ${U} V, R1 = ${R1} kΩ, R2 = ${R2} kΩ. Tension U2 aux bornes de R2 ?`,
      c, r, d: 'M',
      explanation: `U2 = U × R2/(R1+R2) = ${U} × ${R2}/${R1+R2} = ${fmt(U2)} V.`,
    };
  },

  // -------- 2. Energie / Rendement --------
  energie_kWh: () => {
    const P = rand([1, 2, 3, 5, 10, 20]);
    const t = rand([2, 3, 4, 5, 6, 8, 10]);
    const W = P * t;
    const correct = `${fmt(W)} kWh`;
    const dist = [
      `${fmt(P / t)} kWh`,
      `${fmt(W * 60)} kWh`,
      `${fmt(W / 60)} kWh`,
      `${fmt(P + t)} kWh`,
      `${fmt(W * 2)} kWh`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Un appareil de ${P} kW fonctionne pendant ${t} heures. Energie consommee ?`,
      c, r, d: 'F',
      explanation: `W = P × t = ${P} × ${t} = ${W} kWh.`,
    };
  },

  rendement: () => {
    const eta = rand([60, 70, 75, 80, 85, 90]) / 100;
    const Pa = rand([100, 200, 500, 1000, 2000]);
    const Pu = Math.round(Pa * eta);
    const correct = `${Math.round(eta * 100)} %`;
    const dist = [
      `${Math.round((1 - eta) * 100)} %`,
      `${Math.round(eta * 100) - 10} %`,
      `${Math.round(eta * 100) + 10} %`,
      `${Math.round((Pa / Pu) * 100)} %`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Un moteur absorbe ${Pa} W et fournit ${Pu} W mecaniques. Rendement ?`,
      c, r, d: 'M',
      explanation: `η = Pu / Pa = ${Pu}/${Pa} = ${eta} = ${Math.round(eta*100)} %.`,
    };
  },

  pertes: () => {
    const Pa = rand([100, 200, 500, 1000, 2000, 5000]);
    const ratio = rand([0.05, 0.1, 0.15, 0.2]);
    const pertes = Math.round(Pa * ratio);
    const Pu = Pa - pertes;
    const correct = `${pertes} W`;
    const dist = [
      `${Pa} W`,
      `${Pu} W`,
      `${Math.round(pertes / 2)} W`,
      `${Math.round(pertes * 2)} W`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Un convertisseur absorbe ${Pa} W et fournit ${Pu} W en sortie. Quelles sont les pertes ?`,
      c, r, d: 'F',
      explanation: `Pertes = Pa - Pu = ${Pa} - ${Pu} = ${pertes} W.`,
    };
  },

  batterie_Wh: () => {
    const U = rand([6, 12, 24, 48]);
    const Q = rand([5, 10, 20, 50, 100]);
    const W = U * Q;
    const correct = `${fmt(W)} Wh`;
    const dist = [
      `${fmt(W / 10)} Wh`,
      `${fmt(W * 10)} Wh`,
      `${fmt(U + Q)} Wh`,
      `${fmt(Q / U)} Wh`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Une batterie ${U} V / ${Q} Ah. Energie stockee ?`,
      c, r, d: 'F',
      explanation: `W = U × Q = ${U} × ${Q} = ${W} Wh.`,
    };
  },

  // -------- 3. Triphase --------
  V_to_U: () => {
    const V = rand([127, 230, 400]);
    const map = { 127: 220, 230: 400, 400: 690 };
    const U = map[V];
    const correct = `${U} V`;
    const dist = [
      `${V} V`,
      `${Math.round(V * 2)} V`,
      `${Math.round(V * 1.41)} V`,
      `${Math.round(V / 1.73)} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Reseau triphase de tension simple V = ${V} V. Tension composee U ?`,
      c, r, d: 'M',
      explanation: `U = V × √3 ≈ ${V} × 1,73 ≈ ${U} V.`,
    };
  },

  U_to_V: () => {
    const map = { 400: 230, 690: 400, 220: 127 };
    const U = rand(Object.keys(map).map(Number));
    const V = map[U];
    const correct = `${V} V`;
    const dist = [
      `${U} V`,
      `${Math.round(U / 2)} V`,
      `${Math.round(U * 1.73)} V`,
      `${Math.round(U / 1.41)} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Reseau triphase ${U} V. Tension simple V (phase-neutre) ?`,
      c, r, d: 'F',
      explanation: `V = U / √3 = ${U} / 1,73 ≈ ${V} V.`,
    };
  },

  triPhase_P: () => {
    const U = rand([400]);
    const I = rand([5, 10, 15, 20, 25]);
    const cosphi = rand([0.7, 0.8, 0.85, 0.9, 1]);
    const Pexact = Math.sqrt(3) * U * I * cosphi;
    const P = Math.round(Pexact / 100) * 100; // arrondi a la centaine pour cadre mental
    const correct = `≈ ${fmt(P/1000)} kW`;
    const dist = [
      `≈ ${fmt(U * I * cosphi / 1000)} kW`,
      `≈ ${fmt(P * 1.73 / 1000)} kW`,
      `≈ ${fmt(P * 2 / 1000)} kW`,
      `≈ ${fmt(P / 1.73 / 1000)} kW`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Reseau ${U} V triphase, charge equilibree : I = ${I} A, cos φ = ${fmt(cosphi)}. Puissance active P ?`,
      c, r, d: 'M',
      explanation: `P = √3·U·I·cos φ ≈ 1,73 × ${U} × ${I} × ${fmt(cosphi)} ≈ ${fmt(Pexact)} W ≈ ${fmt(P/1000)} kW.`,
    };
  },

  triPhase_S: () => {
    const P = rand([10, 20, 30, 50, 100]);
    const cosphi = rand([0.5, 0.6, 0.8, 1]);
    const S = Math.round(P / cosphi);
    const correct = `${S} kVA`;
    const dist = [
      `${P} kVA`,
      `${Math.round(P * cosphi)} kVA`,
      `${Math.round(P + cosphi * 10)} kVA`,
      `${Math.round(S * 2)} kVA`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Installation triphasee : P = ${P} kW, cos φ = ${fmt(cosphi)}. Puissance apparente S ?`,
      c, r, d: 'M',
      explanation: `S = P / cos φ = ${P} / ${fmt(cosphi)} = ${S} kVA.`,
    };
  },

  triangle_pq: () => {
    // triplets pythagore
    const cases = [
      { p: 3, q: 4, s: 5 }, { p: 6, q: 8, s: 10 }, { p: 30, q: 40, s: 50 },
      { p: 60, q: 80, s: 100 }, { p: 12, q: 16, s: 20 },
    ];
    const t = rand(cases);
    const correct = `${t.s} kVA`;
    const dist = [
      `${t.p + t.q} kVA`,
      `${Math.abs(t.p - t.q)} kVA`,
      `${t.s + 2} kVA`,
      `${t.s - 2} kVA`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Installation : P = ${t.p} kW et Q = ${t.q} kvar. Puissance apparente S ?`,
      c, r, d: 'M',
      explanation: `S = √(P² + Q²) = √(${t.p}² + ${t.q}²) = √${t.p*t.p + t.q*t.q} = ${t.s} kVA.`,
    };
  },

  // -------- 4. Machine asynchrone --------
  ns: () => {
    const p = rand([1, 2, 3, 4]);
    const f = 50;
    const ns = (60 * f) / p;
    const correct = `${ns} tr/min`;
    const dist = [
      `${ns * 2} tr/min`,
      `${Math.round(ns / 2)} tr/min`,
      `${3000} tr/min`,
      `${Math.round(60 * f * p)} tr/min`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Vitesse de synchronisme d'une machine a ${p} paire(s) de poles a 50 Hz ?`,
      c, r, d: 'F',
      explanation: `ns = 60·f / p = 60×50 / ${p} = ${ns} tr/min.`,
    };
  },

  glissement: () => {
    const ns = rand([750, 1000, 1500, 3000]);
    const gp = rand([1, 2, 3, 4, 5, 6, 8]) / 100;
    const n = Math.round(ns * (1 - gp));
    const g = Math.round(((ns - n) / ns) * 1000) / 10;
    const correct = `${fmt(g)} %`;
    const dist = [
      `${fmt(g * 10)} %`,
      `${fmt(g / 10)} %`,
      `${fmt(100 - g)} %`,
      `${fmt(g * 2)} %`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Une MAS tourne a ${n} tr/min. Synchronisme ns = ${ns} tr/min. Glissement g ?`,
      c, r, d: 'M',
      explanation: `g = (ns - n) / ns = (${ns}-${n})/${ns} = ${fmt(g)} %.`,
    };
  },

  pertes_rotor: () => {
    const g = rand([2, 3, 4, 5, 8, 10]) / 100;
    const Ptr = rand([1, 2, 5, 10, 20]); // en kW
    const Pjr = Math.round(g * Ptr * 1000);
    const correct = `${Pjr} W`;
    const dist = [
      `${Pjr * 10} W`,
      `${Math.round(Pjr / 10)} W`,
      `${Math.round(Ptr * 1000)} W`,
      `${Math.round(Ptr * 1000 * (1 - g))} W`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `MAS : puissance transmise au rotor Ptr = ${Ptr} kW, glissement = ${fmt(g*100)} %. Pertes Joule rotor ?`,
      c, r, d: 'M',
      explanation: `Pjr = g × Ptr = ${fmt(g)} × ${Ptr} kW = ${fmt(g * Ptr)} kW = ${Pjr} W.`,
    };
  },

  // -------- 5. Transformateur --------
  transfo_rapport: () => {
    const U1 = rand([20000, 15000, 5000]);
    const U2 = rand([230, 400, 690]);
    const m = Math.round((U2 / U1) * 100000) / 100000;
    const correct = `${fmt(m)}`;
    const dist = [
      `${fmt(U1 / U2)}`,
      `${fmt(m * 10)}`,
      `${fmt(m / 10)}`,
      `${fmt(U1 - U2)}`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Transformateur abaisseur : U1 = ${fmt(U1)} V, U2 = ${fmt(U2)} V. Rapport de transformation m ?`,
      c, r, d: 'M',
      explanation: `m = U2 / U1 = ${fmt(U2)} / ${fmt(U1)} = ${fmt(m)}.`,
    };
  },

  transfo_U2: () => {
    const N1 = rand([1000, 2000, 500]);
    const ratio = rand([2, 5, 10, 20]);
    const N2 = N1 / ratio;
    const U1 = rand([230, 400, 1000]);
    const U2 = Math.round(U1 / ratio);
    const correct = `${U2} V`;
    const dist = [
      `${U1} V`,
      `${U1 * ratio} V`,
      `${Math.round(U2 / 2)} V`,
      `${U2 * 2} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Transformateur ideal : N1 = ${N1} spires, N2 = ${N2} spires. Si U1 = ${U1} V, alors U2 ?`,
      c, r, d: 'M',
      explanation: `U2 = U1 × N2/N1 = ${U1} × ${N2}/${N1} = ${U2} V.`,
    };
  },

  // -------- 6. Hacheur --------
  hacheur: () => {
    const alpha = rand([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
    const Ue = rand([100, 200, 300, 400, 500]);
    const Us = Math.round(alpha * Ue);
    const correct = `${Us} V`;
    const dist = [
      `${Ue} V`,
      `${Math.round(Ue * (1 - alpha))} V`,
      `${Math.round(Ue / alpha)} V`,
      `${Math.round(Us * 2)} V`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Hacheur serie : tension entree Ue = ${Ue} V, rapport cyclique α = ${fmt(alpha)}. Tension moyenne sortie Us ?`,
      c, r, d: 'M',
      explanation: `Us = α × Ue = ${fmt(alpha)} × ${Ue} = ${Us} V.`,
    };
  },

  // -------- 7. Pont diviseur de puissance / Foisonnement --------
  foisonnement: () => {
    const n = rand([3, 4, 5, 8, 10]);
    const Punit = rand([5, 10, 20, 50]);
    const Ks = rand([0.6, 0.7, 0.8, 0.9, 1]);
    const Pf = Math.round(n * Punit * Ks);
    const correct = `${Pf} kW`;
    const dist = [
      `${n * Punit} kW`,
      `${Math.round(n * Punit / Ks)} kW`,
      `${Punit} kW`,
      `${Math.round(Pf / 2)} kW`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `${n} charges identiques de ${Punit} kW chacune, coefficient de foisonnement Ks = ${fmt(Ks)}. Puissance foisonnee ?`,
      c, r, d: 'M',
      explanation: `Pf = Ks × n × P = ${fmt(Ks)} × ${n} × ${Punit} = ${Pf} kW.`,
    };
  },

  // -------- 8. Compensation reactive --------
  compensation: () => {
    const P = rand([50, 100, 150, 200]);
    // tanphi1 → tanphi2
    const cases = [
      { t1: 0.75, t2: 0, name: '1 (sans reactif)' },
      { t1: 1, t2: 0.4, name: '0,93 (Enedis)' },
      { t1: 0.6, t2: 0, name: '1' },
      { t1: 1.33, t2: 0.4, name: '0,93' },
    ];
    const cc = rand(cases);
    const Qc = Math.round(P * (cc.t1 - cc.t2));
    const correct = `${Qc} kvar`;
    const dist = [
      `${P} kvar`,
      `${Math.round(P * cc.t1)} kvar`,
      `${Math.round(Qc / 2)} kvar`,
      `${Math.round(P * cc.t2)} kvar`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `P = ${P} kW. Compenser de tan φ = ${fmt(cc.t1)} a cos φ = ${cc.name}. Puissance de compensation Qc ?`,
      c, r, d: 'D',
      explanation: `Qc = P × (tan φ1 − tan φ2) = ${P} × (${fmt(cc.t1)} − ${fmt(cc.t2)}) = ${Qc} kvar.`,
    };
  },

  // -------- 9. Hydraulique --------
  pression_hauteur: () => {
    const h = rand([5, 10, 15, 20, 30, 50]);
    const p = h * 10; // ρgh avec ρ=1000, g≈10 → en kPa
    const bar = h / 10;
    const correct = `${fmt(bar)} bar`;
    const dist = [
      `${fmt(bar * 10)} bar`,
      `${fmt(bar / 10)} bar`,
      `${fmt(bar + 1)} bar`,
      `${fmt(h)} bar`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Hauteur d'eau de ${h} m. Pression hydrostatique (ρ = 1000 kg/m³, g ≈ 10 m/s²) ?`,
      c, r, d: 'M',
      explanation: `p = ρ·g·h = 1000 × 10 × ${h} = ${p*1000} Pa = ${p} kPa = ${fmt(bar)} bar.`,
    };
  },

  puissance_hydraulique: () => {
    const Q = rand([0.005, 0.01, 0.02, 0.05, 0.1]); // m³/s
    const H = rand([5, 10, 20, 50, 100]);
    const Ph = Math.round(1000 * 10 * Q * H);
    const correct = `${fmt(Ph)} W`;
    const dist = [
      `${fmt(Ph * 10)} W`,
      `${fmt(Ph / 10)} W`,
      `${fmt(Ph / 2)} W`,
      `${fmt(Ph * 2)} W`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Pompe : debit Q = ${fmt(Q)} m³/s, hauteur H = ${H} m. Puissance hydraulique (ρ = 1000, g ≈ 10) ?`,
      c, r, d: 'M',
      explanation: `Ph = ρ·g·Q·H = 1000 × 10 × ${fmt(Q)} × ${H} = ${Ph} W.`,
    };
  },

  rendement_pompe: () => {
    const eta = rand([0.6, 0.65, 0.7, 0.75, 0.8]);
    const Ph = rand([2, 5, 7, 10, 14]);
    const Pa = Math.round((Ph / eta) * 10) / 10;
    const correct = `${fmt(Pa)} kW`;
    const dist = [
      `${fmt(Pa * eta)} kW`,
      `${fmt(Ph)} kW`,
      `${fmt(Pa + 1)} kW`,
      `${fmt(Pa * 2)} kW`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Pompe de rendement η = ${fmt(eta)}. Puissance hydraulique fournie Ph = ${Ph} kW. Puissance electrique absorbee ?`,
      c, r, d: 'M',
      explanation: `Pa = Ph / η = ${Ph} / ${fmt(eta)} = ${fmt(Pa)} kW.`,
    };
  },

  // -------- 10. Calibre disjoncteur --------
  calibre_dj: () => {
    const Ical = rand([12, 18, 22, 27, 35, 44]);
    const serie = [10, 16, 20, 25, 32, 40, 50, 63];
    const next = serie.find(v => v >= Ical);
    const correct = `${next} A`;
    const idxNext = serie.indexOf(next);
    const dist = [
      `${serie[Math.max(0, idxNext - 1)]} A`,
      `${serie[Math.min(serie.length - 1, idxNext + 1)]} A`,
      `${Ical} A`,
      `${next * 2} A`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Courant nominal calcule = ${Ical} A. Calibre disjoncteur normalise a choisir (serie 10-16-20-25-32-40-50-63) ?`,
      c, r, d: 'M',
      explanation: `On choisit le calibre normalise immediatement SUPERIEUR ou egal a I calcule : ${next} A.`,
    };
  },

  // -------- 11. Periode / frequence --------
  periode: () => {
    const f = rand([50, 60, 100, 200, 400, 1000]);
    const T_ms = 1000 / f;
    const correct = `${fmt(T_ms)} ms`;
    const dist = [
      `${fmt(T_ms * 10)} ms`,
      `${fmt(T_ms / 10)} ms`,
      `${fmt(f / 1000)} ms`,
      `${fmt(f)} ms`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Frequence f = ${f} Hz. Periode T ?`,
      c, r, d: 'F',
      explanation: `T = 1 / f = 1 / ${f} = ${fmt(T_ms)} ms.`,
    };
  },

  // -------- 12. Lois d'affinite pompe --------
  affinite_debit: () => {
    const k = rand([1.5, 2, 0.5, 0.8]);
    const Q = rand([10, 20, 50, 100]);
    const Qn = Math.round(Q * k * 10) / 10;
    const correct = `${fmt(Qn)} m³/h`;
    const dist = [
      `${fmt(Q * k * k)} m³/h`,
      `${fmt(Q * k * k * k)} m³/h`,
      `${fmt(Q)} m³/h`,
      `${fmt(Qn / 2)} m³/h`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Pompe : debit ${Q} m³/h a vitesse nominale. Si on multiplie la vitesse par ${fmt(k)}, nouveau debit ?`,
      c, r, d: 'M',
      explanation: `Q ∝ N (loi des affinites pompe) : Q' = Q × k = ${Q} × ${fmt(k)} = ${fmt(Qn)} m³/h.`,
    };
  },

  affinite_puissance: () => {
    const k = rand([0.5, 0.8, 1.5, 2]);
    const Pn = rand([5, 10, 20, 50]);
    const P2 = Math.round(Pn * k * k * k * 10) / 10;
    const correct = `${fmt(P2)} kW`;
    const dist = [
      `${fmt(Pn * k)} kW`,
      `${fmt(Pn * k * k)} kW`,
      `${fmt(Pn)} kW`,
      `${fmt(P2 * 2)} kW`,
    ];
    const { c, r } = buildChoices(correct, dist);
    return {
      q: `Pompe ${Pn} kW. Si on multiplie la vitesse par ${fmt(k)}, nouvelle puissance absorbee ?`,
      c, r, d: 'D',
      explanation: `P ∝ N³ : P' = P × k³ = ${Pn} × ${fmt(k)}³ = ${fmt(P2)} kW. C'est pour ça qu'un variateur economise enormement.`,
    };
  },
};

module.exports = GENERATORS;

// ============================================================
// GENERATEURS PARAMETRES - BTS Electrotechnique E4
// VERSION PEDAGOGIQUE : explications detaillees, sans acronymes obscurs
// ============================================================

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr, n) {
  const cp = arr.slice();
  const out = [];
  for (let i = 0; i < n && cp.length; i++) {
    const j = Math.floor(Math.random() * cp.length);
    out.push(cp.splice(j, 1)[0]);
  }
  return out;
}

function fmt(n) {
  if (Number.isInteger(n)) return String(n);
  const s = Math.round(n * 100) / 100;
  return String(s).replace('.', ',');
}

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
  while (out.length < 4) out.push(`${out.length * 7} (n.a.)`);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return { c: out, r: out.indexOf(correct) };
}

// ===== Pools =====
const POOL_R_OHM = [2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000];
const POOL_I_SMALL = [0.1, 0.2, 0.25, 0.3, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20];
const POOL_U_DC = [5, 6, 9, 12, 15, 18, 24, 30, 48, 60, 100, 200, 300, 400, 500, 600];
const POOL_COSPHI = [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
const POOL_HOURS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 24];
const POOL_AH = [1, 2, 5, 7, 10, 12, 15, 20, 25, 40, 50, 65, 80, 100, 150, 200];
const POOL_FREQ = [25, 50, 60, 100, 200, 400, 500, 1000];
const POOL_HEIGHT_M = [2, 3, 4, 5, 7, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 150];
const POOL_ALPHA = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9];
const POOL_ETA = [0.55, 0.6, 0.65, 0.7, 0.75, 0.78, 0.8, 0.82, 0.85, 0.88, 0.9, 0.92];
const POOL_HTA = [5000, 10000, 15000, 20000, 33000];
const SERIE_DJ = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
const SERIE_CABLE = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

const GENERATORS = {

  // ===== Lois fondamentales =====
  loiOhm_U: () => {
    const R = rand(POOL_R_OHM);
    const I = rand(POOL_I_SMALL);
    const U = Math.round(R * I * 100) / 100;
    const c = `${fmt(U)} V`;
    const d = [`${fmt(U * 2)} V`, `${fmt(U / 2)} V`, `${fmt(R + I)} V`, `${fmt(R / I)} V`, `${fmt(U + R)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une resistance de ${R} ohms est traversee par ${fmt(I)} amperes. Quelle tension a ses bornes ?`, c: choices, r, d: 'F',
      explanation: `La loi d'Ohm relie tension, resistance et courant : tension = resistance × courant. On calcule : ${R} ohms × ${fmt(I)} ampere(s) = ${fmt(U)} volts. C'est la formule la plus utilisee en electricite.` };
  },

  loiOhm_I: () => {
    const R = rand([5, 10, 20, 25, 40, 50, 80, 100, 200, 250, 500, 1000]);
    const Ich = rand([0.1, 0.2, 0.5, 1, 2, 5, 10]);
    const U = R * Ich;
    const I = U / R;
    const c = `${fmt(I)} A`;
    const d = [`${fmt(I * 10)} A`, `${fmt(I / 10)} A`, `${fmt(R / U)} A`, `${fmt(I * 2)} A`, `${fmt(I / 2)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une resistance de ${R} ohms est alimentee sous ${fmt(U)} volts. Quel est le courant qui la traverse ?`, c: choices, r, d: 'F',
      explanation: `On isole le courant dans la loi d'Ohm : courant = tension / resistance = ${fmt(U)} / ${R} = ${fmt(I)} amperes. Plus la resistance est forte, moins il passe de courant pour une meme tension.` };
  },

  loiOhm_R: () => {
    const I = rand([0.5, 1, 2, 3, 4, 5, 10, 20]);
    const Rch = rand([2, 5, 10, 20, 50, 100]);
    const U = Rch * I;
    const R = U / I;
    const c = `${fmt(R)} Ω`;
    const d = [`${fmt(R * 2)} Ω`, `${fmt(R / 2)} Ω`, `${fmt(U * I)} Ω`, `${fmt(R + I)} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Sous ${fmt(U)} volts, un appareil consomme ${fmt(I)} amperes. Quelle est sa resistance ?`, c: choices, r, d: 'F',
      explanation: `On isole la resistance dans la loi d'Ohm : resistance = tension / courant = ${fmt(U)} / ${fmt(I)} = ${fmt(R)} ohms.` };
  },

  joule_RI2: () => {
    const R = rand([2, 5, 10, 15, 20, 25, 30, 50, 100]);
    const I = rand([1, 2, 3, 4, 5, 6, 8, 10]);
    const P = R * I * I;
    const c = `${fmt(P)} W`;
    const d = [`${fmt(R * I)} W`, `${fmt(P * 2)} W`, `${fmt(P / 2)} W`, `${fmt(R + I)} W`, `${fmt(P + R)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une resistance de ${R} ohms est parcourue par ${I} amperes. Puissance dissipee en chaleur (effet Joule) ?`, c: choices, r, d: 'M',
      explanation: `L'effet Joule transforme l'electricite en chaleur : la puissance dissipee vaut resistance × courant au carre. Calcul : ${R} × ${I}² = ${R} × ${I*I} = ${fmt(P)} watts. Attention : le carre sur le courant signifie qu'un peu plus de courant fait BEAUCOUP plus chauffer.` };
  },

  joule_U2R: () => {
    const R = rand([2, 5, 10, 20, 25, 50, 100, 200]);
    const U = rand([10, 20, 50, 100, 200, 400]);
    const P = (U * U) / R;
    const c = `${fmt(P)} W`;
    const d = [`${fmt(U * R)} W`, `${fmt(P * 2)} W`, `${fmt(P / 2)} W`, `${fmt(U / R)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une resistance de ${R} ohms est soumise a ${U} volts. Puissance dissipee ?`, c: choices, r, d: 'M',
      explanation: `Variante de la formule de l'effet Joule : puissance = tension au carre / resistance. Calcul : ${U}² / ${R} = ${U*U} / ${R} = ${fmt(P)} watts. Utile quand on connait U et R sans connaitre I.` };
  },

  serie2: () => {
    const [R1, R2] = pick([5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 500], 2);
    const c = `${R1 + R2} Ω`;
    const d = [`${R1 * R2} Ω`, `${Math.abs(R1 - R2)} Ω`, `${Math.round((R1*R2)/(R1+R2))} Ω`, `${(R1+R2)*2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Deux resistances de ${R1} ohms et ${R2} ohms sont placees en serie. Resistance equivalente ?`, c: choices, r, d: 'F',
      explanation: `En serie, les resistances s'ajoutent : ${R1} + ${R2} = ${R1+R2} ohms. Le courant est le meme dans les deux, les tensions s'additionnent. C'est comme empiler deux obstacles : on freine deux fois.` };
  },

  parallele2: () => {
    const R = rand([4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200, 240, 300, 400]);
    const c = `${R/2} Ω`;
    const d = [`${R*2} Ω`, `${R} Ω`, `${Math.round(R/4)} Ω`, `${R+2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Deux resistances identiques de ${R} ohms sont placees en parallele. Resistance equivalente ?`, c: choices, r, d: 'F',
      explanation: `Pour deux resistances identiques en parallele, la resistance equivalente vaut la moitie de chacune : ${R} / 2 = ${R/2} ohms. Le courant a deux chemins possibles : il passe deux fois mieux.` };
  },

  parallele_2diff: () => {
    const cases = [[6,3], [12,4], [20,5], [30,10], [60,20], [40,10], [100,25], [50,50], [24,12], [15,10]];
    const [R1, R2] = rand(cases);
    const Req = (R1*R2) / (R1+R2);
    const c = `${fmt(Req)} Ω`;
    const d = [`${R1+R2} Ω`, `${Math.round((R1+R2)/2)} Ω`, `${Math.abs(R1-R2)} Ω`, `${R1*R2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `R1 = ${R1} ohms et R2 = ${R2} ohms sont placees en parallele. Resistance equivalente ?`, c: choices, r, d: 'M',
      explanation: `Formule du parallele : 1 / Req = 1/R1 + 1/R2. Donc Req = (R1 × R2) / (R1 + R2) = (${R1} × ${R2}) / (${R1+R2}) = ${R1*R2}/${R1+R2} = ${fmt(Req)} ohms. La resistance equivalente est toujours plus petite que la plus petite des deux.` };
  },

  parallele_n: () => {
    const n = rand([2, 3, 4, 5, 6, 10]);
    const R = rand([6, 10, 12, 20, 30, 50, 60, 100, 120, 150, 200, 300, 600]);
    if (R % n !== 0) return GENERATORS.parallele_n();
    const Req = R / n;
    const c = `${Req} Ω`;
    const d = [`${R*n} Ω`, `${R+n} Ω`, `${R} Ω`, `${Math.round(R/(n+1))} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `${n} resistances identiques de ${R} ohms sont placees en parallele. Resistance equivalente ?`, c: choices, r, d: 'M',
      explanation: `Pour n resistances identiques en parallele, la resistance equivalente est R divise par n : ${R} / ${n} = ${Req} ohms. Plus on ajoute de chemins en parallele, plus la resistance diminue.` };
  },

  pontDiv: () => {
    const ratios = [[1,1], [1,2], [2,1], [1,3], [3,1], [2,3], [3,2], [1,4], [4,1], [1,9], [9,1]];
    const [a, b] = rand(ratios);
    const U = rand([10, 12, 15, 20, 24, 30, 40, 48, 60, 100, 120]);
    const U2 = (U * b) / (a + b);
    const c = `${fmt(U2)} V`;
    const d = [`${U} V`, `${fmt(U/2)} V`, `${fmt(U - U2)} V`, `${fmt(U*a/(a+b))} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont diviseur de tension : U = ${U} V, R1 = ${a} kohms, R2 = ${b} kohms. Quelle tension U2 aux bornes de R2 ?`, c: choices, r, d: 'M',
      explanation: `Dans un pont diviseur, la tension aux bornes d'une resistance est proportionnelle a sa valeur. Formule : U2 = U × R2 / (R1+R2) = ${U} × ${b} / ${a+b} = ${fmt(U2)} V. Si les deux R sont egales, on a juste la moitie.` };
  },

  // ===== Energie / rendement =====
  energie_kWh: () => {
    const P = rand([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7, 10, 15, 20, 25, 50, 100]);
    const t = rand(POOL_HOURS);
    const W = Math.round(P * t * 100) / 100;
    const c = `${fmt(W)} kWh`;
    const d = [`${fmt(P / t)} kWh`, `${fmt(W * 10)} kWh`, `${fmt(W / 10)} kWh`, `${fmt(P + t)} kWh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Un appareil de ${fmt(P)} kW fonctionne pendant ${fmt(t)} heures. Energie consommee ?`, c: choices, r, d: 'F',
      explanation: `L'energie consommee est le produit de la puissance par la duree : ${fmt(P)} kW × ${fmt(t)} h = ${fmt(W)} kWh (kilowatt-heures). C'est cette unite qu'on lit sur la facture EDF.` };
  },

  energie_chauffe_eau: () => {
    const V = rand([50, 100, 150, 200, 250, 300]);
    const dT = rand([20, 30, 40, 50, 60]);
    const c_eau = 1.16;
    const W = Math.round((V * c_eau * dT) * 10) / 10;
    const c = `environ ${fmt(Math.round(W))} Wh`;
    const d = [`environ ${fmt(Math.round(W*10))} Wh`, `environ ${fmt(Math.round(W/10))} Wh`, `environ ${V*dT} Wh`, `environ ${V+dT} Wh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Chauffer ${V} litres d'eau de ${dT} degres Celsius (capacite thermique 1,16 Wh par kg et par degre). Energie necessaire ?`, c: choices, r, d: 'D',
      explanation: `L'energie pour chauffer = masse × capacite thermique × variation de temperature. Avec 1 litre d'eau = 1 kg : ${V} × 1,16 × ${dT} ≈ ${Math.round(W)} Wh. C'est la base du dimensionnement des ballons d'eau chaude.` };
  },

  rendement_pct: () => {
    const eta = rand(POOL_ETA);
    const Pa = rand([100, 250, 500, 1000, 1500, 2000, 3000, 5000, 10000]);
    const Pu = Math.round(Pa * eta);
    const c = `${Math.round(eta * 100)} %`;
    const d = [`${Math.round((1-eta)*100)} %`, `${Math.round(eta*100)-10} %`, `${Math.round(eta*100)+10} %`, `${Math.round(Pa/Pu*100)} %`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une machine absorbe ${Pa} W et fournit ${Pu} W utiles. Quel est son rendement ?`, c: choices, r, d: 'M',
      explanation: `Le rendement = ce qu'on recupere divise par ce qu'on fournit : ${Pu} / ${Pa} = ${eta} soit ${Math.round(eta*100)} %. La difference (${Pa - Pu} W) est perdue en chaleur, frottements, etc.` };
  },

  rendement_Pa: () => {
    const eta = rand([0.7, 0.75, 0.8, 0.85, 0.9]);
    const Pu = rand([700, 800, 1500, 2000, 3000, 5000, 7000, 10000, 15000]);
    const Pa = Math.round(Pu / eta / 100) * 100;
    const c = `${Pa} W`;
    const d = [`${Pu} W`, `${Math.round(Pu*eta)} W`, `${Pa*2} W`, `${Math.round(Pa/2)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Un moteur fournit ${Pu} W utiles avec un rendement de ${eta}. Puissance qu'il absorbe au reseau ?`, c: choices, r, d: 'M',
      explanation: `On inverse la formule du rendement : puissance absorbee = puissance utile / rendement = ${Pu} / ${eta} = ${Pa} W. Il faut donc fournir plus que ce qu'on recupere, a cause des pertes.` };
  },

  pertes_diff: () => {
    const Pa = rand([100, 200, 500, 750, 1000, 1500, 2000, 5000, 10000, 15000]);
    const ratio = rand([0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25]);
    const pertes = Math.round(Pa * ratio);
    const Pu = Pa - pertes;
    const c = `${pertes} W`;
    const d = [`${Pa} W`, `${Pu} W`, `${Math.round(pertes/2)} W`, `${pertes*2} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une machine absorbe ${Pa} W et fournit ${Pu} W utiles. Quelles sont les pertes ?`, c: choices, r, d: 'F',
      explanation: `Les pertes correspondent a la difference entre ce qu'on consomme et ce qu'on recupere : ${Pa} - ${Pu} = ${pertes} W. Ces pertes deviennent de la chaleur (effet Joule, frottements, magnetisme).` };
  },

  batterie_Wh: () => {
    const U = rand([3.7, 6, 12, 24, 36, 48, 60]);
    const Q = rand(POOL_AH);
    const W = Math.round(U * Q * 10) / 10;
    const c = `${fmt(W)} Wh`;
    const d = [`${fmt(W/10)} Wh`, `${fmt(W*10)} Wh`, `${fmt(Q/U)} Wh`, `${fmt(U+Q)} Wh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une batterie de ${fmt(U)} V avec une capacite de ${Q} Ah. Quelle est l'energie stockee ?`, c: choices, r, d: 'F',
      explanation: `L'energie d'une batterie = tension × capacite. Calcul : ${fmt(U)} V × ${Q} Ah = ${fmt(W)} Wh (watt-heures). Pour passer en kWh, on divise par 1000.` };
  },

  batterie_autonomie: () => {
    const W = rand([60, 100, 200, 240, 500, 600, 1000, 1200, 2400]);
    const P = rand([10, 12, 20, 24, 30, 50, 60, 100, 120, 200, 300]);
    const t = Math.round((W / P) * 10) / 10;
    const c = `${fmt(t)} h`;
    const d = [`${fmt(t*2)} h`, `${fmt(t/2)} h`, `${fmt(P/W)} h`, `${fmt(W+P)} h`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une batterie de ${W} Wh alimente une charge de ${P} W. Combien de temps tient-elle ?`, c: choices, r, d: 'M',
      explanation: `Autonomie = energie disponible / puissance consommee = ${W} / ${P} = ${fmt(t)} heures. C'est le calcul de base pour dimensionner une autonomie de secours.` };
  },

  // ===== Triphase =====
  V_to_U: () => {
    const cases = [[127, 220], [230, 400], [400, 690], [347, 600], [277, 480]];
    const [V, U] = rand(cases);
    const c = `${U} V`;
    const d = [`${V*2} V`, `${Math.round(V*1.41)} V`, `${Math.round(V/1.73)} V`, `${V} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Reseau triphase de tension simple ${V} V (entre phase et neutre). Quelle est la tension composee (entre phases) ?`, c: choices, r, d: 'F',
      explanation: `En triphase, la tension composee (entre deux phases) est plus grande que la tension simple (phase-neutre), d'un facteur racine de 3 (environ 1,73). Calcul : ${V} × 1,73 ≈ ${U} V.` };
  },

  U_to_V: () => {
    const cases = [[220, 127], [400, 230], [690, 400], [600, 347], [480, 277]];
    const [U, V] = rand(cases);
    const c = `${V} V`;
    const d = [`${U} V`, `${Math.round(U/2)} V`, `${Math.round(U*1.73)} V`, `${Math.round(U/1.41)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Reseau triphase ${U} V (tension composee). Tension simple (phase-neutre) ?`, c: choices, r, d: 'F',
      explanation: `On divise la tension composee par racine de 3 (environ 1,73) pour obtenir la tension simple : ${U} / 1,73 ≈ ${V} V. Par exemple, pour le reseau domestique : 400 V entre phases, 230 V entre phase et neutre.` };
  },

  triPhase_P: () => {
    const U = rand([230, 400, 690]);
    const I = rand([5, 10, 15, 20, 25, 30, 40, 50]);
    const cosphi = rand([0.7, 0.8, 0.85, 0.9, 1]);
    const Pexact = 1.732 * U * I * cosphi;
    const Pkw = Math.round(Pexact / 100) / 10;
    const c = `environ ${fmt(Pkw)} kW`;
    const d = [
      `environ ${fmt(Math.round(U*I*cosphi/100)/10)} kW`,
      `environ ${fmt(Pkw*1.732)} kW`,
      `environ ${fmt(Pkw*2)} kW`,
      `environ ${fmt(Pkw/1.732)} kW`,
    ];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Charge triphasee equilibree : tension composee ${U} V, courant en ligne ${I} A, facteur de puissance ${fmt(cosphi)}. Puissance active absorbee ?`, c: choices, r, d: 'M',
      explanation: `Formule du triphase equilibre : puissance active = racine de 3 × tension composee × courant en ligne × cos phi. Calcul : 1,73 × ${U} × ${I} × ${fmt(cosphi)} ≈ ${fmt(Pkw)} kW.` };
  },

  triPhase_I: () => {
    const cases = [
      { P: 5500, U: 400, cos: 0.8, I: 10 },
      { P: 11000, U: 400, cos: 0.8, I: 20 },
      { P: 22000, U: 400, cos: 0.8, I: 40 },
      { P: 3000, U: 400, cos: 0.75, I: 6 },
      { P: 7500, U: 400, cos: 0.75, I: 15 },
      { P: 15000, U: 400, cos: 0.85, I: 26 },
      { P: 4000, U: 230, cos: 1, I: 10 },
    ];
    const cc = rand(cases);
    const c = `environ ${cc.I} A`;
    const d = [`environ ${cc.I*2} A`, `environ ${Math.round(cc.I/2)} A`, `environ ${cc.I*1.73|0} A`, `environ ${Math.round(cc.I/1.73)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur triphase ${cc.P/1000} kW alimente en ${cc.U} V, facteur de puissance ${cc.cos}. Courant en ligne ?`, c: choices, r, d: 'M',
      explanation: `On isole le courant dans la formule triphasee : courant en ligne = puissance / (racine de 3 × tension × cos phi) = ${cc.P} / (1,73 × ${cc.U} × ${cc.cos}) ≈ ${cc.I} A. C'est le calcul cle pour dimensionner les cables.` };
  },

  triPhase_S: () => {
    const P = rand([5, 10, 15, 20, 30, 50, 75, 100, 150, 200]);
    const cosphi = rand([0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 1]);
    const S = Math.round(P / cosphi);
    const c = `${S} kVA`;
    const d = [`${P} kVA`, `${Math.round(P*cosphi)} kVA`, `${Math.round(S*1.73)} kVA`, `${Math.round(S/2)} kVA`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une installation a une puissance active de ${P} kW et un facteur de puissance ${fmt(cosphi)}. Puissance apparente ?`, c: choices, r, d: 'M',
      explanation: `La puissance apparente (en kVA) = puissance active / facteur de puissance = ${P} / ${fmt(cosphi)} = ${S} kVA. C'est elle qui sert a dimensionner les cables et le transformateur (alors que seule l'active est facturee).` };
  },

  cosphi_PS: () => {
    const cases = [
      { P: 80, S: 100, cos: 0.8 }, { P: 60, S: 100, cos: 0.6 },
      { P: 90, S: 100, cos: 0.9 }, { P: 75, S: 150, cos: 0.5 },
      { P: 50, S: 50, cos: 1 }, { P: 200, S: 250, cos: 0.8 },
      { P: 80, S: 160, cos: 0.5 }, { P: 30, S: 50, cos: 0.6 },
    ];
    const cc = rand(cases);
    const c = `${fmt(cc.cos)}`;
    const d = [`${fmt(cc.cos+0.1)}`, `${fmt(cc.cos-0.1)}`, `${fmt(cc.S/cc.P)}`, `${fmt(cc.P-cc.cos)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une installation a P = ${cc.P} kW et S = ${cc.S} kVA. Quel est le facteur de puissance ?`, c: choices, r, d: 'F',
      explanation: `Le facteur de puissance = puissance active / puissance apparente = ${cc.P} / ${cc.S} = ${fmt(cc.cos)}. Ce nombre, toujours compris entre 0 et 1, indique l'efficacite electrique : 1 = parfait (resistif pur), 0,5 = mauvais (beaucoup d'inductif).` };
  },

  triangle_pq: () => {
    const cases = [
      [3,4,5],[6,8,10],[30,40,50],[60,80,100],[300,400,500],
      [9,12,15],[15,20,25],[45,60,75],[120,160,200],
      [5,12,13],[10,24,26],[50,120,130],
      [8,15,17],[24,45,51], [7,24,25],
    ];
    const t = rand(cases);
    const c = `${t[2]} kVA`;
    const d = [`${t[0]+t[1]} kVA`, `${Math.abs(t[0]-t[1])} kVA`, `${t[2]+2} kVA`, `${t[2]-2} kVA`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Installation : puissance active ${t[0]} kW et puissance reactive ${t[1]} kvar. Puissance apparente ?`, c: choices, r, d: 'M',
      explanation: `Triangle des puissances (Pythagore) : puissance apparente² = active² + reactive². Calcul : racine de (${t[0]}² + ${t[1]}²) = racine de ${t[0]*t[0]+t[1]*t[1]} = ${t[2]} kVA.` };
  },

  // ===== Moteur asynchrone =====
  ns: () => {
    const p = rand([1, 2, 3, 4, 5, 6]);
    const f = rand([50, 60]);
    const ns = (60 * f) / p;
    const c = `${ns} tr/min`;
    const d = [`${ns*2} tr/min`, `${ns/2} tr/min`, `${60*f*p} tr/min`, `${3000} tr/min`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone avec ${p} paire(s) de poles alimente en ${f} Hz. Vitesse de synchronisme ?`, c: choices, r, d: 'F',
      explanation: `La vitesse de synchronisme est la vitesse de rotation du champ tournant. Formule : 60 × frequence / nombre de paires de poles = 60 × ${f} / ${p} = ${ns} tours par minute. Le moteur tourne legerement en dessous a cause du glissement.` };
  },

  glissement_pct: () => {
    const ns = rand([750, 1000, 1500, 3000]);
    const gp = rand([1, 2, 3, 4, 5, 6, 8]) / 100;
    const n = Math.round(ns * (1 - gp));
    const g = Math.round((ns - n) / ns * 1000) / 10;
    const c = `${fmt(g)} %`;
    const d = [`${fmt(g*10)} %`, `${fmt(g/10)} %`, `${fmt(100-g)} %`, `${fmt(g*2)} %`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone : vitesse de synchronisme ${ns} tr/min, vitesse reelle ${n} tr/min. Glissement ?`, c: choices, r, d: 'M',
      explanation: `Le glissement mesure l'ecart relatif entre la vitesse du champ tournant et la vitesse reelle du rotor. Calcul : (${ns} - ${n}) / ${ns} = ${fmt(g)} %. Plus le moteur est charge, plus le glissement augmente.` };
  },

  glissement_n: () => {
    const ns = rand([1000, 1500, 3000]);
    const gp = rand([2, 3, 4, 5, 6, 8, 10]) / 100;
    const n = Math.round(ns * (1 - gp));
    const c = `${n} tr/min`;
    const d = [`${ns} tr/min`, `${Math.round(ns*gp)} tr/min`, `${Math.round(ns/(1+gp))} tr/min`, `${ns-100} tr/min`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone : synchronisme ${ns} tr/min, glissement ${Math.round(gp*100)} %. Vitesse reelle du rotor ?`, c: choices, r, d: 'M',
      explanation: `On part de la definition du glissement : vitesse reelle = synchronisme × (1 - glissement) = ${ns} × (1 - ${gp}) = ${n} tours par minute.` };
  },

  pertes_rotor: () => {
    const g = rand([2, 3, 4, 5, 6, 8, 10]) / 100;
    const Ptr = rand([1, 2, 3, 5, 7, 10, 15, 20, 30]);
    const Pjr = Math.round(g * Ptr * 1000);
    const c = `${Pjr} W`;
    const d = [`${Pjr*10} W`, `${Math.round(Pjr/10)} W`, `${Ptr*1000} W`, `${Math.round(Ptr*1000*(1-g))} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone : puissance transmise au rotor ${Ptr} kW, glissement ${Math.round(g*100)} %. Pertes Joule au rotor ?`, c: choices, r, d: 'M',
      explanation: `Relation tres utile : pertes Joule au rotor = glissement × puissance transmise. Calcul : ${fmt(g)} × ${Ptr*1000} = ${Pjr} W. Le reste (${Ptr*1000 - Pjr} W) devient de la puissance mecanique. C'est pourquoi un faible glissement = meilleur rendement.` };
  },

  frequence_rotor: () => {
    const g = rand([1, 2, 3, 4, 5, 6, 8, 10]) / 100;
    const f = rand([50, 60]);
    const fr = Math.round(g * f * 10) / 10;
    const c = `${fmt(fr)} Hz`;
    const d = [`${f} Hz`, `${fmt(f*g*10)} Hz`, `${fmt(fr*10)} Hz`, `${fmt(fr+1)} Hz`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone sur reseau ${f} Hz, glissement ${Math.round(g*100)} %. Frequence des courants induits dans le rotor ?`, c: choices, r, d: 'M',
      explanation: `La frequence des courants au rotor depend du glissement : frequence rotor = glissement × frequence reseau = ${fmt(g)} × ${f} = ${fmt(fr)} Hz. A l'arret (glissement = 1), c'est la pleine frequence reseau ; en regime, c'est tres faible.` };
  },

  demarrage_courant: () => {
    const In = rand([2, 5, 7, 10, 15, 20, 25, 30, 40]);
    const k = rand([5, 6, 7, 8]);
    const Id = In * k;
    const c = `${Id} A`;
    const d = [`${In} A`, `${In*2} A`, `${In*3} A`, `${In*10} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur asynchrone : courant nominal ${In} A. Courant absorbe au demarrage direct (typiquement ${k} fois le nominal) ?`, c: choices, r, d: 'F',
      explanation: `Au demarrage, le rotor est immobile : c'est comme un transformateur en court-circuit. Le moteur appelle 5 a 8 fois son courant nominal. Calcul : ${k} × ${In} = ${Id} A. C'est pour ça qu'au-dela d'une certaine puissance, on doit prevoir un demarreur progressif.` };
  },

  // ===== Transformateur =====
  transfo_rapport: () => {
    const U1 = rand(POOL_HTA);
    const U2 = rand([230, 400, 690]);
    const m = Math.round(U2 / U1 * 100000) / 100000;
    const c = `${fmt(m)}`;
    const d = [`${fmt(U1/U2)}`, `${fmt(m*10)}`, `${fmt(m/10)}`, `${fmt(U1+U2)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transformateur abaisseur : tension primaire ${U1} V, tension secondaire ${U2} V. Rapport de transformation ?`, c: choices, r, d: 'M',
      explanation: `Le rapport de transformation = tension secondaire divisee par tension primaire = ${U2} / ${U1} = ${fmt(m)}. Un rapport tres inferieur a 1 = abaisseur, superieur a 1 = elevateur, egal a 1 = isolement.` };
  },

  transfo_U2: () => {
    const ratio = rand([2, 5, 10, 20, 50]);
    const U1 = rand([230, 400, 1000, 5000, 20000]);
    const U2 = Math.round(U1 / ratio);
    const N1 = rand([500, 1000, 2000]);
    const N2 = Math.round(N1 / ratio);
    const c = `${U2} V`;
    const d = [`${U1} V`, `${U1*ratio} V`, `${Math.round(U2/2)} V`, `${U2*2} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transformateur ideal : primaire ${N1} spires, secondaire ${N2} spires. Tension primaire ${U1} V. Tension secondaire ?`, c: choices, r, d: 'M',
      explanation: `Les tensions sont proportionnelles aux nombres de spires : tension secondaire = tension primaire × (spires secondaire / spires primaire) = ${U1} × ${N2}/${N1} = ${U2} V.` };
  },

  transfo_I2: () => {
    const ratio = rand([2, 5, 10, 20, 50]);
    const I1 = rand([0.5, 1, 2, 5, 10]);
    const I2 = I1 * ratio;
    const c = `${fmt(I2)} A`;
    const d = [`${fmt(I1)} A`, `${fmt(I1/ratio)} A`, `${fmt(I2*2)} A`, `${fmt(I2/2)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transformateur ideal abaisseur de rapport 1/${ratio}. Courant primaire ${fmt(I1)} A. Courant secondaire ?`, c: choices, r, d: 'M',
      explanation: `Dans un transformateur ideal, la puissance est conservee : tension × courant identique des deux cotes. Si la tension est divisee par ${ratio}, le courant est multiplie par ${ratio}. Donc ${fmt(I1)} × ${ratio} = ${fmt(I2)} A.` };
  },

  // ===== Hacheur et redresseurs =====
  hacheur_Us: () => {
    const alpha = rand(POOL_ALPHA);
    const Ue = rand(POOL_U_DC);
    const Us = Math.round(alpha * Ue);
    const c = `${Us} V`;
    const d = [`${Ue} V`, `${Math.round(Ue*(1-alpha))} V`, `${Math.round(Ue/alpha)} V`, `${Us*2} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hacheur serie : tension d'entree ${Ue} V, rapport cyclique ${fmt(alpha)}. Tension moyenne en sortie ?`, c: choices, r, d: 'M',
      explanation: `Un hacheur est un interrupteur ferme une fraction du temps (le rapport cyclique). Tension moyenne en sortie = rapport cyclique × tension d'entree = ${fmt(alpha)} × ${Ue} = ${Us} V. C'est ce qu'utilisent les trains, les variateurs, les chargeurs.` };
  },

  hacheur_alpha: () => {
    const Ue = rand([100, 200, 300, 400, 500, 600]);
    const Us = Math.round(Ue * rand([0.2, 0.3, 0.4, 0.5, 0.6, 0.75]));
    const alpha = Math.round(Us / Ue * 100) / 100;
    const c = `${fmt(alpha)}`;
    const d = [`${fmt(Ue/Us)}`, `${fmt(alpha*2)}`, `${fmt(alpha+0.1)}`, `${fmt(alpha-0.1)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hacheur serie : tension d'entree ${Ue} V, on veut ${Us} V en sortie. Rapport cyclique a regler ?`, c: choices, r, d: 'M',
      explanation: `On inverse la formule du hacheur : rapport cyclique = tension de sortie souhaitee / tension d'entree = ${Us} / ${Ue} = ${fmt(alpha)}. Le rapport cyclique est toujours compris entre 0 et 1.` };
  },

  PD2_Umoy: () => {
    const Ueff = rand([24, 48, 110, 127, 230, 380, 400]);
    const Umoy = Math.round(0.9 * Ueff);
    const c = `environ ${Umoy} V`;
    const d = [`environ ${Ueff} V`, `environ ${Math.round(Ueff*1.41)} V`, `environ ${Math.round(Ueff*0.45)} V`, `environ ${Math.round(Ueff/0.9)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont redresseur monophase a 4 diodes (Graetz) alimente sous ${Ueff} V efficaces. Tension moyenne redressee ?`, c: choices, r, d: 'M',
      explanation: `Un pont a 4 diodes redresse les deux alternances. La tension moyenne en sortie vaut environ 0,9 fois la tension efficace d'entree : 0,9 × ${Ueff} ≈ ${Umoy} V. Sans filtrage, on a une ondulation a 100 Hz (deux fois la frequence reseau).` };
  },

  PD3_Umoy: () => {
    const U = rand([230, 400, 690]);
    const Umoy = Math.round(1.35 * U);
    const c = `environ ${Umoy} V`;
    const d = [`environ ${U} V`, `environ ${Math.round(U*0.9)} V`, `environ ${Math.round(U*2)} V`, `environ ${Math.round(U*1.41)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont redresseur triphase a 6 diodes alimente sous ${U} V efficaces composes. Tension moyenne redressee ?`, c: choices, r, d: 'D',
      explanation: `Un pont triphase a 6 diodes utilise les trois phases du reseau et donne une tension beaucoup plus haute et bien plus lisse qu'un pont monophase. Tension moyenne ≈ 1,35 × tension composee efficace = 1,35 × ${U} ≈ ${Umoy} V.` };
  },

  crete_efficace: () => {
    const Ueff = rand([12, 24, 48, 100, 110, 127, 220, 230, 400]);
    const Umax = Math.round(Ueff * 1.414);
    const c = `environ ${Umax} V`;
    const d = [`environ ${Ueff} V`, `environ ${Math.round(Ueff/2)} V`, `environ ${Math.round(Ueff*2)} V`, `environ ${Math.round(Ueff*1.73)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Tension alternative sinusoidale de valeur efficace ${Ueff} V. Quelle est sa valeur crete (maximum atteint) ?`, c: choices, r, d: 'M',
      explanation: `Pour une sinusoide, la valeur crete = valeur efficace multipliee par racine de 2 (≈ 1,41). Calcul : ${Ueff} × 1,41 ≈ ${Umax} V. Exemple connu : le reseau 230 V efficaces a en realite des cretes a 325 V.` };
  },

  // ===== Distribution =====
  foisonnement: () => {
    const n = rand([2, 3, 4, 5, 6, 8, 10, 12]);
    const Punit = rand([2, 5, 10, 15, 20, 25, 50, 75, 100]);
    const Ks = rand([0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 1]);
    const Pf = Math.round(n * Punit * Ks * 10) / 10;
    const c = `${fmt(Pf)} kW`;
    const d = [`${fmt(n*Punit)} kW`, `${fmt(n*Punit/Ks)} kW`, `${fmt(Punit)} kW`, `${fmt(Pf/2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `${n} charges identiques de ${Punit} kW, coefficient de simultaneite ${fmt(Ks)}. Puissance reellement appelee ?`, c: choices, r, d: 'M',
      explanation: `On parle de foisonnement : toutes les charges ne tournent pas ensemble. Puissance foisonnee = coefficient × somme = ${fmt(Ks)} × ${n} × ${Punit} = ${fmt(Pf)} kW. C'est ce qu'on utilise pour dimensionner le transformateur.` };
  },

  compensation_Qc: () => {
    const P = rand([20, 50, 75, 100, 150, 200, 300, 500]);
    const cases = [
      { t1: 0.75, t2: 0, name: '1 (parfait)' },
      { t1: 1, t2: 0.4, name: '0,93' },
      { t1: 0.6, t2: 0.2, name: '0,98' },
      { t1: 1.33, t2: 0.4, name: '0,93' },
      { t1: 0.88, t2: 0.4, name: '0,93' },
    ];
    const cc = rand(cases);
    const Qc = Math.round(P * (cc.t1 - cc.t2));
    const c = `${Qc} kvar`;
    const d = [`${Math.round(P*cc.t1)} kvar`, `${P} kvar`, `${Math.round(Qc/2)} kvar`, `${Math.round(Qc*2)} kvar`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Puissance active ${P} kW. On veut compenser depuis tangente ${fmt(cc.t1)} jusqu'a cos phi = ${cc.name}. Puissance reactive a installer (condensateurs) ?`, c: choices, r, d: 'D',
      explanation: `Puissance reactive de compensation = puissance active × (tangente actuelle − tangente cible) = ${P} × (${fmt(cc.t1)} − ${fmt(cc.t2)}) = ${Qc} kvar. C'est la valeur des condensateurs a installer pour relever le facteur de puissance.` };
  },

  calibre_dj: () => {
    const Ical = rand([8, 12, 14, 18, 22, 27, 30, 35, 44, 55, 70, 88, 110]);
    const next = SERIE_DJ.find(v => v >= Ical);
    const c = `${next} A`;
    const idx = SERIE_DJ.indexOf(next);
    const d = [
      `${SERIE_DJ[Math.max(0, idx-1)]} A`,
      `${SERIE_DJ[Math.min(SERIE_DJ.length-1, idx+1)]} A`,
      `${Ical} A`,
      `${next*2} A`,
    ];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Courant calcule = ${Ical} A. Quel calibre de disjoncteur choisir dans la serie normalisee (6-10-16-20-25-32-40-50-63-80-100) ?`, c: choices, r, d: 'M',
      explanation: `On prend TOUJOURS le calibre normalise immediatement SUPERIEUR ou egal au courant calcule : ${next} A. Jamais inferieur (sinon le disjoncteur declenche sans defaut), pas trop superieur (sinon il ne protege plus).` };
  },

  section_cable: () => {
    const cases = [
      { Iz: 19.5, S: 1.5 }, { Iz: 27, S: 2.5 }, { Iz: 36, S: 4 },
      { Iz: 46, S: 6 }, { Iz: 63, S: 10 }, { Iz: 85, S: 16 },
      { Iz: 112, S: 25 }, { Iz: 138, S: 35 },
    ];
    const cc = rand(cases);
    const c = `${cc.S} mm²`;
    const d = SERIE_CABLE.filter(s => s !== cc.S).slice(0, 4).map(s => `${s} mm²`);
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Courant admissible necessaire = ${cc.Iz} A (cable cuivre, isolant PVC, pose a l'air). Section minimale normalisee ?`, c: choices, r, d: 'D',
      explanation: `D'apres la norme NF C 15-100, on choisit la section dont le courant admissible reel (Iz) est superieur ou egal au besoin. Ici, ${cc.S} mm² supporte environ ${cc.Iz} A. Section inferieure = surchauffe et risque d'incendie.` };
  },

  // ===== Hydraulique =====
  pression_hauteur: () => {
    const h = rand(POOL_HEIGHT_M);
    const bar = h / 10;
    const c = `${fmt(bar)} bar`;
    const d = [`${fmt(bar*10)} bar`, `${fmt(bar/10)} bar`, `${fmt(bar+1)} bar`, `${fmt(h)} bar`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hauteur d'eau ${h} m (densite eau 1000 kg/m³, gravite 10 m/s²). Pression hydrostatique au fond ?`, c: choices, r, d: 'M',
      explanation: `Pression hydrostatique = densite × gravite × hauteur = 1000 × 10 × ${h} = ${h*10000} Pa = ${fmt(bar)} bar. Astuce a retenir : 10 metres d'eau correspondent a 1 bar de pression.` };
  },

  puissance_hydraulique: () => {
    const Q = rand([0.005, 0.01, 0.02, 0.025, 0.05, 0.1, 0.2]);
    const H = rand([5, 10, 15, 20, 25, 50, 100, 150]);
    const Ph = Math.round(1000 * 10 * Q * H);
    const c = `${Ph} W`;
    const d = [`${Ph*10} W`, `${Math.round(Ph/10)} W`, `${Math.round(Ph/2)} W`, `${Ph*2} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe : debit ${fmt(Q)} m³/s, hauteur a vaincre ${H} m. Puissance hydraulique pure necessaire ?`, c: choices, r, d: 'M',
      explanation: `Puissance hydraulique = densite × gravite × debit × hauteur = 1000 × 10 × ${fmt(Q)} × ${H} = ${Ph} W. Pour avoir la puissance electrique a l'arbre, il faudra diviser par le rendement de la pompe.` };
  },

  rendement_pompe: () => {
    const eta = rand(POOL_ETA);
    const Ph = rand([1, 2, 3, 5, 7, 10, 12, 15, 20, 30, 50]);
    const Pa = Math.round(Ph / eta * 10) / 10;
    const c = `${fmt(Pa)} kW`;
    const d = [`${fmt(Pa*eta)} kW`, `${Ph} kW`, `${fmt(Pa+1)} kW`, `${fmt(Pa*2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe de rendement ${fmt(eta)}, puissance hydraulique fournie ${Ph} kW. Puissance electrique absorbee ?`, c: choices, r, d: 'M',
      explanation: `On divise la puissance utile par le rendement : ${Ph} / ${fmt(eta)} = ${fmt(Pa)} kW. Le moteur doit absorber plus que ce que la pompe fournit reellement a l'eau, a cause des pertes par frottement et turbulences.` };
  },

  affinite_Q: () => {
    const k = rand([0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5, 1.8, 2]);
    const Q = rand([10, 20, 30, 40, 50, 75, 100, 150, 200]);
    const Qn = Math.round(Q * k * 10) / 10;
    const c = `${fmt(Qn)} m³/h`;
    const d = [`${fmt(Q*k*k)} m³/h`, `${fmt(Q*k*k*k)} m³/h`, `${Q} m³/h`, `${fmt(Qn/2)} m³/h`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe centrifuge : debit ${Q} m³/h. Si on multiplie la vitesse de rotation par ${fmt(k)}, nouveau debit ?`, c: choices, r, d: 'M',
      explanation: `Premiere loi des affinites des pompes : le debit est proportionnel a la vitesse. Calcul : ${Q} × ${fmt(k)} = ${fmt(Qn)} m³/h. Cette loi tres simple est la base du dimensionnement avec variateur.` };
  },

  affinite_P: () => {
    const k = rand([0.5, 0.6, 0.75, 0.8, 1.2, 1.5, 2]);
    const Pn = rand([5, 7, 10, 15, 20, 30, 50, 75, 100]);
    const P2 = Math.round(Pn * k * k * k * 10) / 10;
    const c = `${fmt(P2)} kW`;
    const d = [`${fmt(Pn*k)} kW`, `${fmt(Pn*k*k)} kW`, `${Pn} kW`, `${fmt(P2*2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe centrifuge : ${Pn} kW absorbes a vitesse nominale. Si on multiplie la vitesse par ${fmt(k)}, nouvelle puissance ?`, c: choices, r, d: 'D',
      explanation: `Troisieme loi des affinites (la plus importante !) : la puissance varie comme le CUBE de la vitesse. Calcul : ${Pn} × ${fmt(k)}³ = ${fmt(P2)} kW. Reduire la vitesse de 20 % fait economiser presque 50 % d'energie : c'est tout le benefice du variateur de vitesse.` };
  },

  // ===== Signal =====
  periode: () => {
    const f = rand(POOL_FREQ);
    const T_ms = 1000 / f;
    const c = `${fmt(T_ms)} ms`;
    const d = [`${fmt(T_ms*10)} ms`, `${fmt(T_ms/10)} ms`, `${fmt(f/1000)} ms`, `${fmt(f)} ms`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Signal de frequence ${f} Hz. Quelle est sa periode (en millisecondes) ?`, c: choices, r, d: 'F',
      explanation: `Periode et frequence sont inverses : T = 1 / f = 1 / ${f} secondes = ${fmt(T_ms)} ms. Plus la frequence est elevee, plus la periode est courte.` };
  },

  pulsation: () => {
    const f = rand([25, 50, 60, 100, 200, 400]);
    const omega = 2 * Math.PI * f;
    const c = `${Math.round(omega)} rad/s`;
    const d = [`${f} rad/s`, `${f*2} rad/s`, `${Math.round(f/2)} rad/s`, `${Math.round(omega*2)} rad/s`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Signal alternatif de frequence ${f} Hz. Pulsation correspondante (en radians par seconde) ?`, c: choices, r, d: 'M',
      explanation: `La pulsation est la vitesse angulaire du signal : 2 × pi × frequence = 2 × 3,14 × ${f} ≈ ${Math.round(omega)} rad/s. C'est l'angle (en radians) parcouru en une seconde sur le cercle trigonometrique.` };
  },

  // ===== Automatisme =====
  signal_4_20: () => {
    const valMin = 0;
    const valMax = rand([100, 200, 500, 1000, 10000, 16000]);
    const I_mA = rand([4, 6, 8, 10, 12, 14, 16, 18, 20]);
    const v = Math.round(valMin + (valMax - valMin) * (I_mA - 4) / 16);
    const c = `${v}`;
    const d = [`${Math.round(v/2)}`, `${v*2}`, `${valMax-v}`, `${Math.round(v + valMax/4)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Boucle 4-20 mA, echelle ${valMin} a ${valMax}. Le capteur envoie ${I_mA} mA. Valeur physique correspondante ?`, c: choices, r, d: 'M',
      explanation: `Mise a l'echelle : a 4 mA on lit ${valMin}, a 20 mA on lit ${valMax}. La regle de 3 donne : ${valMin} + (${valMax} − ${valMin}) × (${I_mA} − 4) / 16 = ${v}. C'est ce qu'on programme dans l'automate avec un bloc 'SCALE'.` };
  },

  ip_index: () => {
    const cases = [
      { ip: 'IP20', sens: 'doigt (pas de poussiere fine, pas d\'eau)' },
      { ip: 'IP44', sens: 'objets > 1 mm + projections d\'eau' },
      { ip: 'IP55', sens: 'poussiere protegee + jets d\'eau' },
      { ip: 'IP65', sens: 'totalement etanche poussiere + jets d\'eau' },
      { ip: 'IP67', sens: 'etanche poussiere + immersion temporaire' },
      { ip: 'IP68', sens: 'etanche poussiere + immersion continue' },
    ];
    const cc = rand(cases);
    const c = cc.sens;
    const d = cases.filter(x => x.sens !== c).slice(0, 3).map(x => x.sens);
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Indice de protection ${cc.ip} : contre quoi protege-t-il ?`, c: choices, r, d: 'M',
      explanation: `Le code IP comporte 2 chiffres : 1er chiffre = protection contre les solides (0-6), 2eme chiffre = protection contre l'eau (0-9). ${cc.ip} signifie : ${cc.sens}.` };
  },

  // ===== Plaque moteur =====
  couplage_plaque: () => {
    const cases = [
      { plaque: '230/400 V', reseau: 400, choix: 'Etoile (Y)' },
      { plaque: '230/400 V', reseau: 230, choix: 'Triangle (Δ)' },
      { plaque: '400/690 V', reseau: 400, choix: 'Triangle (Δ)' },
      { plaque: '400/690 V', reseau: 690, choix: 'Etoile (Y)' },
    ];
    const cc = rand(cases);
    const c = cc.choix;
    const d = ['Etoile (Y)', 'Triangle (Δ)', 'Aucun couplage', 'Impossible'].filter(x => x !== c);
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Plaque moteur ${cc.plaque}, reseau triphase ${cc.reseau} V. Quel couplage realiser ?`, c: choices, r, d: 'M',
      explanation: `Regle a retenir : la PLUS PETITE tension de la plaque correspond au couplage TRIANGLE, la plus grande a l'ETOILE. Plaque ${cc.plaque} sur reseau ${cc.reseau} V : on utilise donc ${cc.choix}. Cela permet d'appliquer la bonne tension aux enroulements.` };
  },

  // ===== Tarif / ROI =====
  roi: () => {
    const cout = rand([2000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 50000]);
    const eco = rand([500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
    const t = Math.round(cout / eco * 10) / 10;
    const c = `${fmt(t)} ans`;
    const d = [`${fmt(t*2)} ans`, `${fmt(t/2)} ans`, `${fmt(cout-eco)} ans`, `${fmt(eco/cout)} ans`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Investissement ${cout} €, economie annuelle ${eco} €. Temps de retour sur investissement ?`, c: choices, r, d: 'F',
      explanation: `Temps de retour = cout total divise par economie annuelle = ${cout} / ${eco} = ${fmt(t)} ans. En general un investissement industriel est interessant si ce temps est inferieur a 5 a 7 ans.` };
  },

  cout_consommation: () => {
    const P = rand([1, 2, 3, 5, 10, 15, 20]);
    const t = rand([2, 4, 6, 8, 10, 12, 24]);
    const tarif = rand([0.15, 0.18, 0.2, 0.22, 0.25]);
    const cout = Math.round(P * t * tarif * 100) / 100;
    const c = `${fmt(cout)} €`;
    const d = [`${fmt(cout*10)} €`, `${fmt(cout/10)} €`, `${fmt(P*t)} €`, `${fmt(P+t)} €`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Appareil de ${P} kW fonctionnant ${t} heures, tarif ${fmt(tarif)} € par kWh. Cout d'utilisation ?`, c: choices, r, d: 'M',
      explanation: `Cout = puissance × duree × tarif = ${P} × ${t} × ${fmt(tarif)} = ${fmt(cout)} €. On multiplie d'abord pour avoir les kWh consommes, puis par le tarif unitaire.` };
  },
};

module.exports = GENERATORS;

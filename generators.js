// ============================================================
// GENERATEURS PARAMETRES - BTS E4
// Chaque generateur produit une question fraiche, avec des pools
// de parametres tres larges → des milliers de combinaisons uniques.
// Combine au systeme d'historique cote serveur (history.js),
// on peut tirer des questions sans repetition pendant des heures.
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

// ===== Pools de valeurs "mental math friendly" =====
const POOL_R_OHM = [2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000];
const POOL_R_KOHM = [1, 2, 3, 4, 5, 8, 10, 12, 15, 20, 22, 25, 30, 47, 50, 100, 150, 220, 470, 1000];
const POOL_I_SMALL = [0.1, 0.2, 0.25, 0.3, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20];
const POOL_U_BT = [12, 24, 48, 100, 200, 230, 400, 500, 600, 690, 1000];
const POOL_U_DC = [5, 6, 9, 12, 15, 18, 24, 30, 48, 60, 100, 200, 300, 400, 500, 600];
const POOL_P_W = [10, 25, 40, 60, 100, 150, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];
const POOL_P_KW = [1, 2, 3, 5, 7, 10, 11, 15, 18, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250];
const POOL_COSPHI = [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
const POOL_HOURS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 24];
const POOL_AH = [1, 2, 5, 7, 10, 12, 15, 20, 25, 40, 50, 65, 80, 100, 150, 200];
const POOL_FREQ = [25, 50, 60, 100, 200, 400, 500, 1000];
const POOL_HEIGHT_M = [2, 3, 4, 5, 7, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 150];
const POOL_ALPHA = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9];
const POOL_ETA = [0.55, 0.6, 0.65, 0.7, 0.75, 0.78, 0.8, 0.82, 0.85, 0.88, 0.9, 0.92];
const POOL_RATIO_TRANSFO = [2, 4, 5, 8, 10, 20, 25, 40, 50, 87];
const POOL_HTA = [5000, 10000, 15000, 20000, 33000];
const SERIE_DJ = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
const SERIE_CABLE = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

// ===== Generateurs =====
const GENERATORS = {

  // ===== Lois fondamentales =====
  loiOhm_U: () => {
    const R = rand(POOL_R_OHM);
    const I = rand(POOL_I_SMALL);
    const U = Math.round(R * I * 100) / 100;
    const c = `${fmt(U)} V`;
    const d = [`${fmt(U * 2)} V`, `${fmt(U / 2)} V`, `${fmt(R + I)} V`, `${fmt(R / I)} V`, `${fmt(U + R)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Une resistance de ${R} Ω est traversee par ${fmt(I)} A. Tension a ses bornes ?`, c: choices, r, d: 'F',
      explanation: `Loi d'Ohm : U = R × I = ${R} × ${fmt(I)} = ${fmt(U)} V.` };
  },

  loiOhm_I: () => {
    const R = rand([5, 10, 20, 25, 40, 50, 80, 100, 200, 250, 500, 1000]);
    const Ich = rand([0.1, 0.2, 0.5, 1, 2, 5, 10]);
    const U = R * Ich;
    const I = U / R;
    const c = `${fmt(I)} A`;
    const d = [`${fmt(I * 10)} A`, `${fmt(I / 10)} A`, `${fmt(R / U)} A`, `${fmt(I * 2)} A`, `${fmt(I / 2)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `R = ${R} Ω alimentee sous ${fmt(U)} V. Quel est le courant ?`, c: choices, r, d: 'F',
      explanation: `I = U / R = ${fmt(U)} / ${R} = ${fmt(I)} A.` };
  },

  loiOhm_R: () => {
    const I = rand([0.5, 1, 2, 3, 4, 5, 10, 20]);
    const Rch = rand([2, 5, 10, 20, 50, 100]);
    const U = Rch * I;
    const R = U / I;
    const c = `${fmt(R)} Ω`;
    const d = [`${fmt(R * 2)} Ω`, `${fmt(R / 2)} Ω`, `${fmt(U * I)} Ω`, `${fmt(R + I)} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Sous ${fmt(U)} V, un recepteur consomme ${fmt(I)} A. Sa resistance ?`, c: choices, r, d: 'F',
      explanation: `R = U / I = ${fmt(U)} / ${fmt(I)} = ${fmt(R)} Ω.` };
  },

  joule_RI2: () => {
    const R = rand([2, 5, 10, 15, 20, 25, 30, 50, 100]);
    const I = rand([1, 2, 3, 4, 5, 6, 8, 10]);
    const P = R * I * I;
    const c = `${fmt(P)} W`;
    const d = [`${fmt(R * I)} W`, `${fmt(P * 2)} W`, `${fmt(P / 2)} W`, `${fmt(R + I)} W`, `${fmt(P + R)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `R = ${R} Ω parcourue par ${I} A. Puissance dissipee par effet Joule ?`, c: choices, r, d: 'M',
      explanation: `P = R × I² = ${R} × ${I}² = ${R} × ${I*I} = ${fmt(P)} W.` };
  },

  joule_U2R: () => {
    const R = rand([2, 5, 10, 20, 25, 50, 100, 200]);
    const U = rand([10, 20, 50, 100, 200, 400]);
    const P = (U * U) / R;
    const c = `${fmt(P)} W`;
    const d = [`${fmt(U * R)} W`, `${fmt(P * 2)} W`, `${fmt(P / 2)} W`, `${fmt(U / R)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `R = ${R} Ω sous ${U} V. Puissance dissipee ?`, c: choices, r, d: 'M',
      explanation: `P = U² / R = ${U}² / ${R} = ${U*U} / ${R} = ${fmt(P)} W.` };
  },

  serie2: () => {
    const [R1, R2] = pick([5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 500], 2);
    const c = `${R1 + R2} Ω`;
    const d = [`${R1 * R2} Ω`, `${Math.abs(R1 - R2)} Ω`, `${Math.round((R1*R2)/(R1+R2))} Ω`, `${(R1+R2)*2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Deux resistances ${R1} Ω et ${R2} Ω en serie. Resistance equivalente ?`, c: choices, r, d: 'F',
      explanation: `En serie on additionne : ${R1} + ${R2} = ${R1+R2} Ω.` };
  },

  parallele2: () => {
    const R = rand([4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200, 240, 300, 400]);
    const c = `${R/2} Ω`;
    const d = [`${R*2} Ω`, `${R} Ω`, `${Math.round(R/4)} Ω`, `${R+2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Deux resistances identiques de ${R} Ω en parallele. Resistance equivalente ?`, c: choices, r, d: 'F',
      explanation: `2 R identiques en parallele : Req = R/2 = ${R}/2 = ${R/2} Ω.` };
  },

  parallele_2diff: () => {
    // pour avoir des entiers : couples (R1,R2) dont R1·R2/(R1+R2) est entier
    const cases = [[6,3], [12,4], [20,5], [30,10], [60,20], [40,10], [100,25], [50,50], [24,12], [15,10]];
    const [R1, R2] = rand(cases);
    const Req = (R1*R2) / (R1+R2);
    const c = `${fmt(Req)} Ω`;
    const d = [`${R1+R2} Ω`, `${Math.round((R1+R2)/2)} Ω`, `${Math.abs(R1-R2)} Ω`, `${R1*R2} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `R1 = ${R1} Ω et R2 = ${R2} Ω en parallele. R equivalente ?`, c: choices, r, d: 'M',
      explanation: `1/Req = 1/R1 + 1/R2 → Req = R1·R2 / (R1+R2) = ${R1*R2}/${R1+R2} = ${fmt(Req)} Ω.` };
  },

  parallele_n: () => {
    const n = rand([2, 3, 4, 5, 6, 10]);
    const R = rand([6, 10, 12, 20, 30, 50, 60, 100, 120, 150, 200, 300, 600]);
    if (R % n !== 0) { /* on relance via recursion */ return GENERATORS.parallele_n(); }
    const Req = R / n;
    const c = `${Req} Ω`;
    const d = [`${R*n} Ω`, `${R+n} Ω`, `${R} Ω`, `${Math.round(R/(n+1))} Ω`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `${n} resistances identiques de ${R} Ω en parallele. R equivalente ?`, c: choices, r, d: 'M',
      explanation: `Req = R/n = ${R}/${n} = ${Req} Ω.` };
  },

  pontDiv: () => {
    const ratios = [[1,1], [1,2], [2,1], [1,3], [3,1], [2,3], [3,2], [1,4], [4,1], [1,9], [9,1]];
    const [a, b] = rand(ratios);
    const U = rand([10, 12, 15, 20, 24, 30, 40, 48, 60, 100, 120]);
    const U2 = (U * b) / (a + b);
    const c = `${fmt(U2)} V`;
    const d = [`${U} V`, `${fmt(U/2)} V`, `${fmt(U - U2)} V`, `${fmt(U*a/(a+b))} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont diviseur : U = ${U} V, R1 = ${a} kΩ, R2 = ${b} kΩ. Tension U2 ?`, c: choices, r, d: 'M',
      explanation: `U2 = U × R2 / (R1+R2) = ${U} × ${b} / ${a+b} = ${fmt(U2)} V.` };
  },

  // ===== Energie / rendement =====
  energie_kWh: () => {
    const P = rand([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7, 10, 15, 20, 25, 50, 100]);
    const t = rand(POOL_HOURS);
    const W = Math.round(P * t * 100) / 100;
    const c = `${fmt(W)} kWh`;
    const d = [`${fmt(P / t)} kWh`, `${fmt(W * 10)} kWh`, `${fmt(W / 10)} kWh`, `${fmt(P + t)} kWh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `${fmt(P)} kW pendant ${fmt(t)} h. Energie consommee ?`, c: choices, r, d: 'F',
      explanation: `W = P × t = ${fmt(P)} × ${fmt(t)} = ${fmt(W)} kWh.` };
  },

  energie_chauffe_eau: () => {
    // P = m·c·ΔT / Δt (mais ici on calcule directement W = m·c·ΔT pour chauffer)
    const V = rand([50, 100, 150, 200, 250, 300]); // litres = kg
    const dT = rand([20, 30, 40, 50, 60]);
    // c = 1,16 Wh/(kg·°C)  -> arrondi mental : ~1,2
    const c_eau = 1.16;
    const W = Math.round((V * c_eau * dT) * 10) / 10;
    const c = `≈ ${fmt(Math.round(W))} Wh`;
    const d = [`≈ ${fmt(Math.round(W*10))} Wh`, `≈ ${fmt(Math.round(W/10))} Wh`, `≈ ${V*dT} Wh`, `≈ ${V+dT} Wh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Chauffer ${V} L d'eau de ${dT} °C (c = 1,16 Wh/kg/°C). Energie ?`, c: choices, r, d: 'D',
      explanation: `W = m·c·ΔT = ${V} × 1,16 × ${dT} ≈ ${Math.round(W)} Wh.` };
  },

  rendement_pct: () => {
    const eta = rand(POOL_ETA);
    const Pa = rand([100, 250, 500, 1000, 1500, 2000, 3000, 5000, 10000]);
    const Pu = Math.round(Pa * eta);
    const c = `${Math.round(eta * 100)} %`;
    const d = [`${Math.round((1-eta)*100)} %`, `${Math.round(eta*100)-10} %`, `${Math.round(eta*100)+10} %`, `${Math.round(Pa/Pu*100)} %`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pa = ${Pa} W, Pu = ${Pu} W. Rendement ?`, c: choices, r, d: 'M',
      explanation: `η = Pu / Pa = ${Pu}/${Pa} = ${eta} = ${Math.round(eta*100)} %.` };
  },

  rendement_Pa: () => {
    const eta = rand([0.7, 0.75, 0.8, 0.85, 0.9]);
    const Pu = rand([700, 800, 1500, 2000, 3000, 5000, 7000, 10000, 15000]);
    const Pa = Math.round(Pu / eta / 100) * 100;
    const c = `${Pa} W`;
    const d = [`${Pu} W`, `${Math.round(Pu*eta)} W`, `${Pa*2} W`, `${Math.round(Pa/2)} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pu = ${Pu} W, η = ${eta}. Puissance absorbee Pa ?`, c: choices, r, d: 'M',
      explanation: `Pa = Pu / η = ${Pu} / ${eta} = ${Pa} W.` };
  },

  pertes_diff: () => {
    const Pa = rand([100, 200, 500, 750, 1000, 1500, 2000, 5000, 10000, 15000]);
    const ratio = rand([0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25]);
    const pertes = Math.round(Pa * ratio);
    const Pu = Pa - pertes;
    const c = `${pertes} W`;
    const d = [`${Pa} W`, `${Pu} W`, `${Math.round(pertes/2)} W`, `${pertes*2} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pa = ${Pa} W, Pu = ${Pu} W. Pertes ?`, c: choices, r, d: 'F',
      explanation: `Pertes = Pa - Pu = ${Pa} - ${Pu} = ${pertes} W.` };
  },

  batterie_Wh: () => {
    const U = rand([3.7, 6, 12, 24, 36, 48, 60]);
    const Q = rand(POOL_AH);
    const W = Math.round(U * Q * 10) / 10;
    const c = `${fmt(W)} Wh`;
    const d = [`${fmt(W/10)} Wh`, `${fmt(W*10)} Wh`, `${fmt(Q/U)} Wh`, `${fmt(U+Q)} Wh`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Batterie ${fmt(U)} V / ${Q} Ah. Energie stockee ?`, c: choices, r, d: 'F',
      explanation: `W = U × Q = ${fmt(U)} × ${Q} = ${fmt(W)} Wh.` };
  },

  batterie_autonomie: () => {
    const W = rand([60, 100, 200, 240, 500, 600, 1000, 1200, 2400]);
    const P = rand([10, 12, 20, 24, 30, 50, 60, 100, 120, 200, 300]);
    const t = Math.round((W / P) * 10) / 10;
    const c = `${fmt(t)} h`;
    const d = [`${fmt(t*2)} h`, `${fmt(t/2)} h`, `${fmt(P/W)} h`, `${fmt(W+P)} h`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Batterie ${W} Wh alimente une charge de ${P} W. Autonomie ?`, c: choices, r, d: 'M',
      explanation: `t = W / P = ${W} / ${P} = ${fmt(t)} h.` };
  },

  // ===== Triphase =====
  V_to_U: () => {
    const cases = [[127, 220], [230, 400], [400, 690], [347, 600], [277, 480]];
    const [V, U] = rand(cases);
    const c = `${U} V`;
    const d = [`${V*2} V`, `${Math.round(V*1.41)} V`, `${Math.round(V/1.73)} V`, `${V} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Reseau triphase de tension simple V = ${V} V. Tension composee U ?`, c: choices, r, d: 'F',
      explanation: `U = V × √3 ≈ ${V} × 1,73 ≈ ${U} V.` };
  },

  U_to_V: () => {
    const cases = [[220, 127], [400, 230], [690, 400], [600, 347], [480, 277]];
    const [U, V] = rand(cases);
    const c = `${V} V`;
    const d = [`${U} V`, `${Math.round(U/2)} V`, `${Math.round(U*1.73)} V`, `${Math.round(U/1.41)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Reseau triphase ${U} V. Tension simple V ?`, c: choices, r, d: 'F',
      explanation: `V = U / √3 = ${U} / 1,73 ≈ ${V} V.` };
  },

  triPhase_P: () => {
    const U = rand([230, 400, 690]);
    const I = rand([5, 10, 15, 20, 25, 30, 40, 50]);
    const cosphi = rand([0.7, 0.8, 0.85, 0.9, 1]);
    const Pexact = 1.732 * U * I * cosphi;
    const Pkw = Math.round(Pexact / 100) / 10;
    const c = `≈ ${fmt(Pkw)} kW`;
    const d = [
      `≈ ${fmt(Math.round(U*I*cosphi/100)/10)} kW`,
      `≈ ${fmt(Pkw*1.732)} kW`,
      `≈ ${fmt(Pkw*2)} kW`,
      `≈ ${fmt(Pkw/1.732)} kW`,
    ];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Charge triphasee : U = ${U} V, I = ${I} A, cos φ = ${fmt(cosphi)}. Puissance active P ?`, c: choices, r, d: 'M',
      explanation: `P = √3·U·I·cos φ ≈ 1,73 × ${U} × ${I} × ${fmt(cosphi)} ≈ ${fmt(Pkw)} kW.` };
  },

  triPhase_I: () => {
    // P, U, cos phi → I (chiffres ronds)
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
    const c = `≈ ${cc.I} A`;
    const d = [`≈ ${cc.I*2} A`, `≈ ${Math.round(cc.I/2)} A`, `≈ ${cc.I*1.73|0} A`, `≈ ${Math.round(cc.I/1.73)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Moteur triphase ${cc.P/1000} kW, ${cc.U} V, cos φ = ${cc.cos}. Courant ligne ?`, c: choices, r, d: 'M',
      explanation: `I = P / (√3·U·cos φ) = ${cc.P} / (1,73 × ${cc.U} × ${cc.cos}) ≈ ${cc.I} A.` };
  },

  triPhase_S: () => {
    const P = rand([5, 10, 15, 20, 30, 50, 75, 100, 150, 200]);
    const cosphi = rand([0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 1]);
    const S = Math.round(P / cosphi);
    const c = `${S} kVA`;
    const d = [`${P} kVA`, `${Math.round(P*cosphi)} kVA`, `${Math.round(S*1.73)} kVA`, `${Math.round(S/2)} kVA`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `P = ${P} kW, cos φ = ${fmt(cosphi)}. Puissance apparente ?`, c: choices, r, d: 'M',
      explanation: `S = P / cos φ = ${P} / ${fmt(cosphi)} = ${S} kVA.` };
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
    return { q: `P = ${cc.P} kW, S = ${cc.S} kVA. Cos φ ?`, c: choices, r, d: 'F',
      explanation: `cos φ = P / S = ${cc.P} / ${cc.S} = ${fmt(cc.cos)}.` };
  },

  triangle_pq: () => {
    // triplets pythagoriciens : P-Q-S
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
    return { q: `P = ${t[0]} kW, Q = ${t[1]} kvar. Puissance apparente S ?`, c: choices, r, d: 'M',
      explanation: `S = √(P² + Q²) = √(${t[0]}² + ${t[1]}²) = √${t[0]*t[0]+t[1]*t[1]} = ${t[2]} kVA.` };
  },

  // ===== Machine asynchrone =====
  ns: () => {
    const p = rand([1, 2, 3, 4, 5, 6]);
    const f = rand([50, 60]);
    const ns = (60 * f) / p;
    const c = `${ns} tr/min`;
    const d = [`${ns*2} tr/min`, `${ns/2} tr/min`, `${60*f*p} tr/min`, `${3000} tr/min`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Vitesse de synchronisme : ${p} paire(s) de poles a ${f} Hz ?`, c: choices, r, d: 'F',
      explanation: `ns = 60·f/p = 60 × ${f} / ${p} = ${ns} tr/min.` };
  },

  glissement_pct: () => {
    const ns = rand([750, 1000, 1500, 3000]);
    const gp = rand([1, 2, 3, 4, 5, 6, 8]) / 100;
    const n = Math.round(ns * (1 - gp));
    const g = Math.round((ns - n) / ns * 1000) / 10;
    const c = `${fmt(g)} %`;
    const d = [`${fmt(g*10)} %`, `${fmt(g/10)} %`, `${fmt(100-g)} %`, `${fmt(g*2)} %`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `MAS : ns = ${ns} tr/min, n = ${n} tr/min. Glissement ?`, c: choices, r, d: 'M',
      explanation: `g = (ns-n)/ns = (${ns}-${n})/${ns} = ${fmt(g)} %.` };
  },

  glissement_n: () => {
    const ns = rand([1000, 1500, 3000]);
    const gp = rand([2, 3, 4, 5, 6, 8, 10]) / 100;
    const n = Math.round(ns * (1 - gp));
    const c = `${n} tr/min`;
    const d = [`${ns} tr/min`, `${Math.round(ns*gp)} tr/min`, `${Math.round(ns/(1+gp))} tr/min`, `${ns-100} tr/min`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `MAS : ns = ${ns} tr/min, glissement = ${Math.round(gp*100)} %. Vitesse reelle n ?`, c: choices, r, d: 'M',
      explanation: `n = ns × (1 − g) = ${ns} × (1 − ${gp}) = ${n} tr/min.` };
  },

  pertes_rotor: () => {
    const g = rand([2, 3, 4, 5, 6, 8, 10]) / 100;
    const Ptr = rand([1, 2, 3, 5, 7, 10, 15, 20, 30]);
    const Pjr = Math.round(g * Ptr * 1000);
    const c = `${Pjr} W`;
    const d = [`${Pjr*10} W`, `${Math.round(Pjr/10)} W`, `${Ptr*1000} W`, `${Math.round(Ptr*1000*(1-g))} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `MAS : Ptr = ${Ptr} kW, g = ${Math.round(g*100)} %. Pertes Joule rotor ?`, c: choices, r, d: 'M',
      explanation: `Pjr = g × Ptr = ${fmt(g)} × ${Ptr*1000} = ${Pjr} W.` };
  },

  frequence_rotor: () => {
    const g = rand([1, 2, 3, 4, 5, 6, 8, 10]) / 100;
    const f = rand([50, 60]);
    const fr = Math.round(g * f * 10) / 10;
    const c = `${fmt(fr)} Hz`;
    const d = [`${f} Hz`, `${fmt(f*g*10)} Hz`, `${fmt(fr*10)} Hz`, `${fmt(fr+1)} Hz`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `MAS sur reseau ${f} Hz, glissement = ${Math.round(g*100)} %. Frequence des courants rotor ?`, c: choices, r, d: 'M',
      explanation: `fr = g × f = ${fmt(g)} × ${f} = ${fmt(fr)} Hz.` };
  },

  demarrage_courant: () => {
    const In = rand([2, 5, 7, 10, 15, 20, 25, 30, 40]);
    const k = rand([5, 6, 7, 8]);
    const Id = In * k;
    const c = `${Id} A`;
    const d = [`${In} A`, `${In*2} A`, `${In*3} A`, `${In*10} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `MAS : In = ${In} A. Courant de demarrage direct (k = ${k}·In) ?`, c: choices, r, d: 'F',
      explanation: `Id = k × In = ${k} × ${In} = ${Id} A.` };
  },

  // ===== Transformateur =====
  transfo_rapport: () => {
    const U1 = rand(POOL_HTA);
    const U2 = rand([230, 400, 690]);
    const m = Math.round(U2 / U1 * 100000) / 100000;
    const c = `${fmt(m)}`;
    const d = [`${fmt(U1/U2)}`, `${fmt(m*10)}`, `${fmt(m/10)}`, `${fmt(U1+U2)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transformateur abaisseur U1 = ${U1} V, U2 = ${U2} V. Rapport m ?`, c: choices, r, d: 'M',
      explanation: `m = U2 / U1 = ${U2}/${U1} = ${fmt(m)}.` };
  },

  transfo_U2: () => {
    const ratio = rand(POOL_RATIO_TRANSFO);
    const U1 = rand([230, 400, 1000, 5000, 20000]);
    const U2 = Math.round(U1 / ratio);
    const N1 = rand([500, 1000, 2000]);
    const N2 = Math.round(N1 / ratio);
    const c = `${U2} V`;
    const d = [`${U1} V`, `${U1*ratio} V`, `${Math.round(U2/2)} V`, `${U2*2} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transfo ideal : N1 = ${N1}, N2 = ${N2}. Si U1 = ${U1} V, U2 ?`, c: choices, r, d: 'M',
      explanation: `U2 = U1 × N2/N1 = ${U1} × ${N2}/${N1} = ${U2} V.` };
  },

  transfo_I2: () => {
    const ratio = rand([2, 5, 10, 20, 50]);
    const I1 = rand([0.5, 1, 2, 5, 10]);
    const I2 = I1 * ratio;
    const c = `${fmt(I2)} A`;
    const d = [`${fmt(I1)} A`, `${fmt(I1/ratio)} A`, `${fmt(I2*2)} A`, `${fmt(I2/2)} A`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Transfo ideal abaisseur : U2 = U1/${ratio}. Si I1 = ${fmt(I1)} A, I2 ?`, c: choices, r, d: 'M',
      explanation: `Pa = Pu → I2 = I1 × ratio = ${fmt(I1)} × ${ratio} = ${fmt(I2)} A.` };
  },

  // ===== Hacheur / electronique de puissance =====
  hacheur_Us: () => {
    const alpha = rand(POOL_ALPHA);
    const Ue = rand(POOL_U_DC);
    const Us = Math.round(alpha * Ue);
    const c = `${Us} V`;
    const d = [`${Ue} V`, `${Math.round(Ue*(1-alpha))} V`, `${Math.round(Ue/alpha)} V`, `${Us*2} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hacheur serie : Ue = ${Ue} V, α = ${fmt(alpha)}. Tension moyenne Us ?`, c: choices, r, d: 'M',
      explanation: `Us = α × Ue = ${fmt(alpha)} × ${Ue} = ${Us} V.` };
  },

  hacheur_alpha: () => {
    const Ue = rand([100, 200, 300, 400, 500, 600]);
    const Us = Math.round(Ue * rand([0.2, 0.3, 0.4, 0.5, 0.6, 0.75]));
    const alpha = Math.round(Us / Ue * 100) / 100;
    const c = `${fmt(alpha)}`;
    const d = [`${fmt(Ue/Us)}`, `${fmt(alpha*2)}`, `${fmt(alpha+0.1)}`, `${fmt(alpha-0.1)}`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hacheur serie : Ue = ${Ue} V, on veut Us = ${Us} V. Rapport cyclique α ?`, c: choices, r, d: 'M',
      explanation: `α = Us / Ue = ${Us} / ${Ue} = ${fmt(alpha)}.` };
  },

  PD2_Umoy: () => {
    const Ueff = rand([24, 48, 110, 127, 230, 380, 400]);
    const Umoy = Math.round(0.9 * Ueff);
    const c = `≈ ${Umoy} V`;
    const d = [`≈ ${Ueff} V`, `≈ ${Math.round(Ueff*1.41)} V`, `≈ ${Math.round(Ueff*0.45)} V`, `≈ ${Math.round(Ueff/0.9)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont PD2 alimente sous ${Ueff} V efficace. Tension moyenne redressee ?`, c: choices, r, d: 'M',
      explanation: `Umoy = 2·Umax/π = (2·√2/π)·Ueff ≈ 0,9 × ${Ueff} ≈ ${Umoy} V.` };
  },

  PD3_Umoy: () => {
    const U = rand([230, 400, 690]);
    const Umoy = Math.round(1.35 * U);
    const c = `≈ ${Umoy} V`;
    const d = [`≈ ${U} V`, `≈ ${Math.round(U*0.9)} V`, `≈ ${Math.round(U*2)} V`, `≈ ${Math.round(U*1.41)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pont PD3 (tout diodes) alimente sous ${U} V compose. Umoy ?`, c: choices, r, d: 'D',
      explanation: `Umoy ≈ 1,35 × U_eff_composee = 1,35 × ${U} ≈ ${Umoy} V.` };
  },

  crete_efficace: () => {
    const Ueff = rand([12, 24, 48, 100, 110, 127, 220, 230, 400]);
    const Umax = Math.round(Ueff * 1.414);
    const c = `≈ ${Umax} V`;
    const d = [`≈ ${Ueff} V`, `≈ ${Math.round(Ueff/2)} V`, `≈ ${Math.round(Ueff*2)} V`, `≈ ${Math.round(Ueff*1.73)} V`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Tension efficace = ${Ueff} V (sinusoidale). Tension crete Umax ?`, c: choices, r, d: 'M',
      explanation: `Umax = Ueff × √2 ≈ ${Ueff} × 1,41 ≈ ${Umax} V.` };
  },

  // ===== Distribution / dimensionnement =====
  foisonnement: () => {
    const n = rand([2, 3, 4, 5, 6, 8, 10, 12]);
    const Punit = rand([2, 5, 10, 15, 20, 25, 50, 75, 100]);
    const Ks = rand([0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 1]);
    const Pf = Math.round(n * Punit * Ks * 10) / 10;
    const c = `${fmt(Pf)} kW`;
    const d = [`${fmt(n*Punit)} kW`, `${fmt(n*Punit/Ks)} kW`, `${fmt(Punit)} kW`, `${fmt(Pf/2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `${n} charges identiques de ${Punit} kW, Ks = ${fmt(Ks)}. Puissance foisonnee ?`, c: choices, r, d: 'M',
      explanation: `Pf = Ks × n × P = ${fmt(Ks)} × ${n} × ${Punit} = ${fmt(Pf)} kW.` };
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
    return { q: `P = ${P} kW, compenser de tan φ = ${fmt(cc.t1)} a cos φ = ${cc.name}. Qc ?`, c: choices, r, d: 'D',
      explanation: `Qc = P × (tan φ1 − tan φ2) = ${P} × (${fmt(cc.t1)} − ${fmt(cc.t2)}) = ${Qc} kvar.` };
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
    return { q: `Courant calcule = ${Ical} A. Calibre disjoncteur normalise a choisir ?`, c: choices, r, d: 'M',
      explanation: `On prend la valeur normalisee immediatement ≥ I calcule : ${next} A.` };
  },

  section_cable: () => {
    // donne IZ admissible → demande section
    const cases = [
      { Iz: 19.5, S: 1.5 }, { Iz: 27, S: 2.5 }, { Iz: 36, S: 4 },
      { Iz: 46, S: 6 }, { Iz: 63, S: 10 }, { Iz: 85, S: 16 },
      { Iz: 112, S: 25 }, { Iz: 138, S: 35 },
    ];
    const cc = rand(cases);
    const c = `${cc.S} mm²`;
    const d = SERIE_CABLE.filter(s => s !== cc.S).slice(0, 4).map(s => `${s} mm²`);
    const { c: choices, r } = buildChoices(c, d);
    return { q: `IZ admissible necessaire = ${cc.Iz} A (cuivre PVC pose air). Section minimale ?`, c: choices, r, d: 'D',
      explanation: `D'apres la NFC 15-100, la section ${cc.S} mm² supporte IZ ≈ ${cc.Iz} A.` };
  },

  // ===== Hydraulique =====
  pression_hauteur: () => {
    const h = rand(POOL_HEIGHT_M);
    const bar = h / 10;
    const c = `${fmt(bar)} bar`;
    const d = [`${fmt(bar*10)} bar`, `${fmt(bar/10)} bar`, `${fmt(bar+1)} bar`, `${fmt(h)} bar`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Hauteur d'eau ${h} m (ρ = 1000 kg/m³, g ≈ 10). Pression au fond ?`, c: choices, r, d: 'M',
      explanation: `p = ρ·g·h = 1000 × 10 × ${h} = ${h*10000} Pa = ${fmt(bar)} bar.` };
  },

  puissance_hydraulique: () => {
    const Q = rand([0.005, 0.01, 0.02, 0.025, 0.05, 0.1, 0.2]);
    const H = rand([5, 10, 15, 20, 25, 50, 100, 150]);
    const Ph = Math.round(1000 * 10 * Q * H);
    const c = `${Ph} W`;
    const d = [`${Ph*10} W`, `${Math.round(Ph/10)} W`, `${Math.round(Ph/2)} W`, `${Ph*2} W`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe : Q = ${fmt(Q)} m³/s, H = ${H} m. Puissance hydraulique ?`, c: choices, r, d: 'M',
      explanation: `Ph = ρ·g·Q·H = 1000 × 10 × ${fmt(Q)} × ${H} = ${Ph} W.` };
  },

  rendement_pompe: () => {
    const eta = rand(POOL_ETA);
    const Ph = rand([1, 2, 3, 5, 7, 10, 12, 15, 20, 30, 50]);
    const Pa = Math.round(Ph / eta * 10) / 10;
    const c = `${fmt(Pa)} kW`;
    const d = [`${fmt(Pa*eta)} kW`, `${Ph} kW`, `${fmt(Pa+1)} kW`, `${fmt(Pa*2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe η = ${fmt(eta)}, Ph = ${Ph} kW. Puissance electrique absorbee ?`, c: choices, r, d: 'M',
      explanation: `Pa = Ph / η = ${Ph} / ${fmt(eta)} = ${fmt(Pa)} kW.` };
  },

  affinite_Q: () => {
    const k = rand([0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5, 1.8, 2]);
    const Q = rand([10, 20, 30, 40, 50, 75, 100, 150, 200]);
    const Qn = Math.round(Q * k * 10) / 10;
    const c = `${fmt(Qn)} m³/h`;
    const d = [`${fmt(Q*k*k)} m³/h`, `${fmt(Q*k*k*k)} m³/h`, `${Q} m³/h`, `${fmt(Qn/2)} m³/h`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe : Q = ${Q} m³/h. Si vitesse × ${fmt(k)}, nouveau debit ?`, c: choices, r, d: 'M',
      explanation: `Loi des affinites : Q ∝ N → Q' = Q × k = ${Q} × ${fmt(k)} = ${fmt(Qn)} m³/h.` };
  },

  affinite_P: () => {
    const k = rand([0.5, 0.6, 0.75, 0.8, 1.2, 1.5, 2]);
    const Pn = rand([5, 7, 10, 15, 20, 30, 50, 75, 100]);
    const P2 = Math.round(Pn * k * k * k * 10) / 10;
    const c = `${fmt(P2)} kW`;
    const d = [`${fmt(Pn*k)} kW`, `${fmt(Pn*k*k)} kW`, `${Pn} kW`, `${fmt(P2*2)} kW`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Pompe ${Pn} kW. Si vitesse × ${fmt(k)}, nouvelle puissance ?`, c: choices, r, d: 'D',
      explanation: `P ∝ N³ : P' = P × k³ = ${Pn} × ${fmt(k)}³ ≈ ${fmt(P2)} kW.` };
  },

  // ===== Signal =====
  periode: () => {
    const f = rand(POOL_FREQ);
    const T_ms = 1000 / f;
    const c = `${fmt(T_ms)} ms`;
    const d = [`${fmt(T_ms*10)} ms`, `${fmt(T_ms/10)} ms`, `${fmt(f/1000)} ms`, `${fmt(f)} ms`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Frequence f = ${f} Hz. Periode T ?`, c: choices, r, d: 'F',
      explanation: `T = 1/f = 1/${f} s = ${fmt(T_ms)} ms.` };
  },

  pulsation: () => {
    const f = rand([25, 50, 60, 100, 200, 400]);
    const omega = 2 * Math.PI * f;
    const c = `${Math.round(omega)} rad/s`;
    const d = [`${f} rad/s`, `${f*2} rad/s`, `${Math.round(f/2)} rad/s`, `${Math.round(omega*2)} rad/s`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Frequence f = ${f} Hz. Pulsation ω ?`, c: choices, r, d: 'M',
      explanation: `ω = 2π·f = 2π × ${f} ≈ ${Math.round(omega)} rad/s.` };
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
    return { q: `Boucle 4-20 mA (echelle ${valMin}-${valMax}). Le capteur envoie ${I_mA} mA. Valeur physique ?`, c: choices, r, d: 'M',
      explanation: `v = ${valMin} + (${valMax}-${valMin}) × (${I_mA}-4)/16 = ${v}.` };
  },

  ip_index: () => {
    const cases = [
      { ip: 'IP20', sens: 'doigt' }, { ip: 'IP44', sens: 'projections d\'eau' },
      { ip: 'IP55', sens: 'poussiere + jets d\'eau' }, { ip: 'IP65', sens: 'etanche poussiere + jets' },
      { ip: 'IP67', sens: 'etanche poussiere + immersion temporaire' },
      { ip: 'IP68', sens: 'etanche poussiere + immersion continue' },
    ];
    const cc = rand(cases);
    const c = cc.sens;
    const d = cases.filter(x => x.sens !== c).slice(0, 3).map(x => x.sens);
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Indice ${cc.ip} : il protege contre...`, c: choices, r, d: 'M',
      explanation: `${cc.ip} = ${cc.sens}.` };
  },

  // ===== Plaque moteur / couplage =====
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
    return { q: `Plaque moteur ${cc.plaque}, reseau triphase ${cc.reseau} V. Couplage a faire ?`, c: choices, r, d: 'M',
      explanation: `La plus petite tension de plaque correspond au triangle. ${cc.plaque} sur ${cc.reseau} V → ${cc.choix}.` };
  },

  // ===== Tarif / ROI =====
  roi: () => {
    const cout = rand([2000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 50000]);
    const eco = rand([500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
    const t = Math.round(cout / eco * 10) / 10;
    const c = `${fmt(t)} ans`;
    const d = [`${fmt(t*2)} ans`, `${fmt(t/2)} ans`, `${fmt(cout-eco)} ans`, `${fmt(eco/cout)} ans`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Investissement ${cout} €, economie ${eco} €/an. Temps de retour ?`, c: choices, r, d: 'F',
      explanation: `ROI = cout / economie = ${cout} / ${eco} = ${fmt(t)} ans.` };
  },

  cout_consommation: () => {
    const P = rand([1, 2, 3, 5, 10, 15, 20]);
    const t = rand([2, 4, 6, 8, 10, 12, 24]);
    const tarif = rand([0.15, 0.18, 0.2, 0.22, 0.25]);
    const cout = Math.round(P * t * tarif * 100) / 100;
    const c = `${fmt(cout)} €`;
    const d = [`${fmt(cout*10)} €`, `${fmt(cout/10)} €`, `${fmt(P*t)} €`, `${fmt(P+t)} €`];
    const { c: choices, r } = buildChoices(c, d);
    return { q: `Appareil ${P} kW pendant ${t} h, tarif ${fmt(tarif)} €/kWh. Cout ?`, c: choices, r, d: 'M',
      explanation: `Cout = P·t·tarif = ${P} × ${t} × ${fmt(tarif)} = ${fmt(cout)} €.` };
  },
};

module.exports = GENERATORS;

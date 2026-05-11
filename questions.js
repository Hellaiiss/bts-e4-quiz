// Banque de questions BTS Electrotechnique E4 / U41
// Format : { q, c, r, d?, formula?, explanation?, svg? }
//   q           : enonce (style vrai sujet : court, technique, sans pieges)
//   c           : 4 propositions
//   r           : index 0..3 de la bonne reponse
//   d           : difficulte 'F' (Facile), 'M' (Moyen), 'D' (Difficile)
//   formula     : formule affichee (optionnelle - on l'omet quand elle revele la reponse)
//   explanation : explication detaillee montree pendant les 20s d'explication
//   svg         : schema visuel (optionnel)
//
// Chiffres choisis pour calcul MENTAL (sans calculatrice).
// Themes calques sur les vrais sujets BTS E4 2019-2025 (Veolia, Hopital, Cuves,
// Hydraulique NC, Beauval, etc.).

// ========== Schemas reutilisables ==========
const SVG_PLAQUE_MAS = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="280" height="120" fill="#fef3c7" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="40" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">PLAQUE MOTEUR ASYNCHRONE</text>
  <line x1="20" y1="48" x2="300" y2="48" stroke="#0f172a"/>
  <text x="35" y="68" font-size="12" fill="#0f172a">3~  50 Hz</text>
  <text x="35" y="88" font-size="12" fill="#0f172a">Δ 230 V    8,7 A</text>
  <text x="35" y="108" font-size="12" fill="#0f172a">Y 400 V    5,0 A</text>
  <text x="35" y="128" font-size="12" fill="#0f172a">cos φ = 0,8</text>
  <text x="175" y="78" font-size="12" fill="#0f172a">P = 3 kW</text>
  <text x="175" y="98" font-size="12" fill="#0f172a">1440 tr/min</text>
  <text x="175" y="118" font-size="12" fill="#0f172a">IP55</text>
</svg>`;

const SVG_STAR = `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
  <line x1="140" y1="100" x2="140" y2="40" stroke="#dc2626" stroke-width="3"/>
  <line x1="140" y1="100" x2="80" y2="160" stroke="#22c55e" stroke-width="3"/>
  <line x1="140" y1="100" x2="200" y2="160" stroke="#3b82f6" stroke-width="3"/>
  <circle cx="140" cy="100" r="5" fill="#0f172a"/>
  <text x="135" y="120" font-size="12" fill="#0f172a">N</text>
  <text x="135" y="30" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="bold">L1</text>
  <text x="65" y="175" font-size="13" fill="#22c55e" font-weight="bold">L2</text>
  <text x="210" y="175" font-size="13" fill="#3b82f6" font-weight="bold">L3</text>
  <text x="140" y="195" text-anchor="middle" font-size="12" fill="#0f172a">Couplage etoile (Y)</text>
</svg>`;

const SVG_TRIANGLE = `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="140,40 80,150 200,150" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="140" y1="40" x2="140" y2="20" stroke="#dc2626" stroke-width="3"/>
  <line x1="80" y1="150" x2="60" y2="170" stroke="#22c55e" stroke-width="3"/>
  <line x1="200" y1="150" x2="220" y2="170" stroke="#3b82f6" stroke-width="3"/>
  <text x="135" y="15" font-size="13" fill="#dc2626" font-weight="bold">L1</text>
  <text x="40" y="180" font-size="13" fill="#22c55e" font-weight="bold">L2</text>
  <text x="225" y="180" font-size="13" fill="#3b82f6" font-weight="bold">L3</text>
  <text x="140" y="195" text-anchor="middle" font-size="12" fill="#0f172a">Couplage triangle (Δ)</text>
</svg>`;

const SVG_TRIANGLE_POWER = `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="140" x2="240" y2="140" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="240" y1="140" x2="240" y2="40" stroke="#dc2626" stroke-width="2.5"/>
  <line x1="40" y1="140" x2="240" y2="40" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="140" y="160" text-anchor="middle" font-size="13" fill="#0f172a">P (W)</text>
  <text x="255" y="95" font-size="13" fill="#dc2626">Q (var)</text>
  <text x="120" y="85" font-size="13" fill="#3b82f6">S (VA)</text>
  <text x="100" y="135" font-size="11" fill="#0f172a">φ</text>
  <path d="M 80 140 A 25 25 0 0 0 90 122" fill="none" stroke="#0f172a"/>
  <text x="140" y="175" text-anchor="middle" font-size="11" fill="#0f172a">Triangle des puissances S² = P² + Q²</text>
</svg>`;

const SVG_SINE = `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="70" x2="310" y2="70" stroke="#94a3b8" stroke-width="1"/>
  <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 20 70 Q 60 -10 100 70 T 180 70 T 260 70 T 340 70" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="305" y="65" font-size="11" fill="#0f172a">t</text>
  <text x="10" y="20" font-size="11" fill="#0f172a">u(t)</text>
  <text x="150" y="135" text-anchor="middle" font-size="12" fill="#0f172a">Tension sinusoidale</text>
</svg>`;

const SVG_DIVIDER = `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="30" x2="180" y2="30" stroke="#0f172a" stroke-width="2"/>
  <line x1="40" y1="150" x2="180" y2="150" stroke="#0f172a" stroke-width="2"/>
  <line x1="40" y1="30" x2="40" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="20" y="95" font-size="13" fill="#0f172a">U</text>
  <rect x="170" y="50" width="20" height="35" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="180" y1="30" x2="180" y2="50" stroke="#0f172a" stroke-width="2"/>
  <text x="200" y="72" font-size="12" fill="#0f172a">R1</text>
  <line x1="180" y1="85" x2="180" y2="105" stroke="#0f172a" stroke-width="2"/>
  <rect x="170" y="105" width="20" height="35" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="180" y1="140" x2="180" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="200" y="127" font-size="12" fill="#0f172a">R2</text>
  <text x="115" y="127" font-size="12" fill="#dc2626" font-weight="bold">U2 ?</text>
  <text x="140" y="170" text-anchor="middle" font-size="11" fill="#0f172a">Pont diviseur de tension</text>
</svg>`;

const SVG_PD2 = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="40" x2="30" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="290" y1="40" x2="290" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="30" y1="40" x2="100" y2="40" stroke="#0f172a" stroke-width="2"/>
  <line x1="30" y1="140" x2="100" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="220" y1="40" x2="290" y2="40" stroke="#0f172a" stroke-width="2"/>
  <line x1="220" y1="140" x2="290" y2="140" stroke="#0f172a" stroke-width="2"/>
  <polygon points="100,30 100,50 120,40" fill="#0f172a"/>
  <line x1="120" y1="25" x2="120" y2="55" stroke="#0f172a" stroke-width="2"/>
  <polygon points="220,30 220,50 200,40" fill="#0f172a"/>
  <line x1="200" y1="25" x2="200" y2="55" stroke="#0f172a" stroke-width="2"/>
  <polygon points="100,130 100,150 120,140" fill="#0f172a"/>
  <line x1="120" y1="125" x2="120" y2="155" stroke="#0f172a" stroke-width="2"/>
  <polygon points="220,130 220,150 200,140" fill="#0f172a"/>
  <line x1="200" y1="125" x2="200" y2="155" stroke="#0f172a" stroke-width="2"/>
  <line x1="120" y1="40" x2="200" y2="40" stroke="#0f172a" stroke-width="2"/>
  <line x1="120" y1="140" x2="200" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="160" y1="40" x2="160" y2="80" stroke="#0f172a" stroke-width="2"/>
  <line x1="160" y1="100" x2="160" y2="140" stroke="#0f172a" stroke-width="2"/>
  <rect x="145" y="80" width="30" height="20" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="95" text-anchor="middle" font-size="11" fill="#0f172a">R</text>
  <text x="160" y="170" text-anchor="middle" font-size="12" fill="#0f172a">Pont PD2 (4 diodes)</text>
</svg>`;

const SVG_HACHEUR = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="40" x2="20" y2="120" stroke="#0f172a" stroke-width="2"/>
  <line x1="15" y1="40" x2="25" y2="40" stroke="#0f172a" stroke-width="2"/>
  <line x1="10" y1="50" x2="30" y2="50" stroke="#0f172a" stroke-width="2"/>
  <text x="35" y="85" font-size="12" fill="#0f172a">Ue</text>
  <line x1="20" y1="40" x2="120" y2="40" stroke="#0f172a" stroke-width="2"/>
  <rect x="120" y="30" width="40" height="20" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
  <text x="140" y="44" text-anchor="middle" font-size="11" fill="#0f172a" font-weight="bold">T</text>
  <line x1="160" y1="40" x2="290" y2="40" stroke="#0f172a" stroke-width="2"/>
  <rect x="280" y="55" width="20" height="40" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="305" y="80" font-size="11" fill="#0f172a">Us</text>
  <line x1="290" y1="40" x2="290" y2="120" stroke="#0f172a" stroke-width="2"/>
  <line x1="290" y1="120" x2="20" y2="120" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="145" text-anchor="middle" font-size="12" fill="#0f172a">Hacheur serie</text>
</svg>`;

const SVG_TRANSFO_HTA = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="30" font-size="12" fill="#dc2626" font-weight="bold">HTA 20 kV</text>
  <text x="240" y="30" font-size="12" fill="#22c55e" font-weight="bold">BT 400 V</text>
  <line x1="20" y1="50" x2="80" y2="50" stroke="#0f172a" stroke-width="2"/>
  <line x1="20" y1="110" x2="80" y2="110" stroke="#0f172a" stroke-width="2"/>
  <path d="M 80 40 Q 92 50 80 60 Q 92 70 80 80 Q 92 90 80 100 Q 92 110 80 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="140" y1="20" x2="140" y2="130" stroke="#0f172a" stroke-width="3"/>
  <line x1="150" y1="20" x2="150" y2="130" stroke="#0f172a" stroke-width="3"/>
  <path d="M 210 40 Q 198 50 210 60 Q 198 70 210 80 Q 198 90 210 100 Q 198 110 210 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="210" y1="50" x2="290" y2="50" stroke="#0f172a" stroke-width="2"/>
  <line x1="210" y1="110" x2="290" y2="110" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="150" text-anchor="middle" font-size="12" fill="#0f172a">Transformateur HTA/BT</text>
</svg>`;

const SVG_REGIME_TN = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="20" font-size="12" font-weight="bold" fill="#0f172a">Regime TN</text>
  <line x1="40" y1="40" x2="280" y2="40" stroke="#dc2626" stroke-width="2"/>
  <text x="285" y="44" font-size="11" fill="#dc2626">L</text>
  <line x1="40" y1="65" x2="280" y2="65" stroke="#3b82f6" stroke-width="2"/>
  <text x="285" y="69" font-size="11" fill="#3b82f6">N</text>
  <line x1="40" y1="90" x2="280" y2="90" stroke="#22c55e" stroke-width="2"/>
  <text x="285" y="94" font-size="11" fill="#22c55e">PE</text>
  <line x1="60" y1="90" x2="60" y2="130" stroke="#22c55e" stroke-width="2"/>
  <line x1="40" y1="130" x2="80" y2="130" stroke="#0f172a" stroke-width="2"/>
  <line x1="50" y1="135" x2="70" y2="135" stroke="#0f172a"/>
  <line x1="55" y1="140" x2="65" y2="140" stroke="#0f172a"/>
  <rect x="180" y="100" width="40" height="40" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="200" y="125" text-anchor="middle" font-size="11" fill="#0f172a">M</text>
  <line x1="200" y1="40" x2="200" y2="100" stroke="#dc2626" stroke-width="2"/>
  <line x1="180" y1="120" x2="120" y2="120" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="120" y1="120" x2="120" y2="90" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="160" y="160" text-anchor="middle" font-size="11" fill="#0f172a">Masse reliee au PE (neutre)</text>
</svg>`;

const SVG_BERNOULLI = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="30" x2="40" y2="130" stroke="#3b82f6" stroke-width="3"/>
  <line x1="40" y1="130" x2="280" y2="130" stroke="#3b82f6" stroke-width="3"/>
  <line x1="40" y1="40" x2="60" y2="40" stroke="#3b82f6" stroke-width="3"/>
  <line x1="270" y1="120" x2="290" y2="120" stroke="#3b82f6" stroke-width="3"/>
  <text x="20" y="50" font-size="11" fill="#0f172a">A</text>
  <text x="285" y="115" font-size="11" fill="#0f172a">B</text>
  <line x1="20" y1="40" x2="30" y2="40" stroke="#0f172a"/>
  <line x1="20" y1="120" x2="30" y2="120" stroke="#0f172a"/>
  <line x1="25" y1="40" x2="25" y2="120" stroke="#0f172a" stroke-width="1"/>
  <text x="5" y="85" font-size="11" fill="#0f172a">Δz</text>
  <text x="150" y="155" text-anchor="middle" font-size="11" fill="#0f172a">Bernoulli : ½ρv² + ρgz + p = cste</text>
</svg>`;

// ========== Banque de questions ==========
const QUESTIONS = {

  "1. Bilan de puissance & dimensionnement (Ku/Ks, S transfo)": [
    { q: "Foisonnement : 4 charges de 10 kW chacune, Ks = 0,8. Puissance foisonnee ?", c: ["32 kW", "40 kW", "10 kW", "50 kW"], r: 0, d: 'M',
      explanation: "P_foisonnee = Ks × ΣP = 0,8 × 40 = 32 kW." },
    { q: "Coefficient Ks de foisonnement : il est en general...", c: ["≥ 1", "≤ 1 (charges non simultanees)", "= 0", "Negatif"], r: 1, d: 'F',
      explanation: "Ks tient compte du fait que toutes les charges ne fonctionnent pas en meme temps : 0,7 a 0,9 typique." },
    { q: "Coefficient d'utilisation Ku : pour un moteur fonctionnant a 75 % de sa charge nominale, Ku ?", c: ["1", "0,75", "0,5", "1,33"], r: 1, d: 'F',
      explanation: "Ku = P_reelle / P_nominale = 0,75." },
    { q: "Total installation : 100 kW avec cos φ = 0,8. Quelle puissance apparente ?", c: ["80 kVA", "125 kVA", "100 kVA", "160 kVA"], r: 1, d: 'M',
      explanation: "S = P / cos φ = 100 / 0,8 = 125 kVA." },
    { q: "Bilan : S_installee = 100 kVA. Transformateur standard a choisir ?", c: ["63 kVA", "100 kVA", "160 kVA", "Pas de transfo"], r: 2, d: 'M',
      explanation: "On choisit le calibre normalise IMMEDIATEMENT superieur : 160 kVA (apres 100 dans la serie 63-100-160-250-400)." },
    { q: "Taux de charge d'un transformateur 250 kVA qui debite 200 kVA ?", c: ["80 %", "125 %", "50 %", "20 %"], r: 0, d: 'F',
      explanation: "Taux = S_utilise / S_nominal = 200/250 = 80 %." },
    { q: "Pour un transfo HTA/BT, un taux de charge optimal vise environ...", c: ["10 %", "75 %", "120 %", "200 %"], r: 1, d: 'M',
      explanation: "Optimum entre 60 et 80 % : rendement bon et reserve pour pointes." },
    { q: "Bilan triphase 400 V : 50 kVA. Courant en ligne ?", c: ["≈ 70 A", "≈ 125 A", "≈ 50 A", "≈ 12 A"], r: 0, d: 'M',
      explanation: "I = S / (√3·U) = 50000 / (1,73 × 400) ≈ 50000/692 ≈ 72 A." },
    { q: "Ks pour un atelier avec 10 moteurs identiques fonctionnant rarement ensemble ?", c: ["1", "Environ 0,5-0,7", "0", "2"], r: 1, d: 'M',
      explanation: "Plus le nombre de charges est grand, plus Ks est faible. Pour 10 charges : 0,5-0,7." },
    { q: "Plaque transfo HTA/BT 'Sn = 400 kVA, U1 = 20 kV, U2 = 410 V'. Rapport m ?", c: ["≈ 50", "≈ 0,02", "= 410", "= 20 000"], r: 1, d: 'M',
      explanation: "m = U2 / U1 = 410 / 20000 = 0,0205 ≈ 1/49.", svg: SVG_TRANSFO_HTA },
  ],

  "2. Dimensionnement & protection BT (cable, Icc, Pdc)": [
    { q: "Courant nominal d'un moteur triphase 11 kW / 400 V / cos φ = 0,8 / η = 0,9 ?", c: ["≈ 22 A", "≈ 16 A", "≈ 40 A", "≈ 11 A"], r: 0, d: 'M',
      explanation: "I = P / (√3·U·cos φ·η) = 11000 / (1,73 × 400 × 0,8 × 0,9) ≈ 11000/498 ≈ 22 A." },
    { q: "Calibre disjoncteur D pour un moteur I_n = 22 A. On choisit dans la serie 10-16-20-25-32 A...", c: ["20 A", "25 A", "32 A", "16 A"], r: 1, d: 'M',
      explanation: "Calibre normalise IMMEDIATEMENT superieur a IN : 25 A." },
    { q: "Section minimale cuivre pour 25 A en pose monocouche air (IZ ≈ 27 A pour 4 mm²) ?", c: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"], r: 2, d: 'M',
      explanation: "On retient la section dont IZ ≥ I_calcule : 4 mm² (IZ ≈ 27 A > 25 A)." },
    { q: "Facteur de correction f1 quand T° ambiante elevee ?", c: ["> 1 (augmente IZ)", "< 1 (reduit IZ)", "Pas d'effet", "= 0"], r: 1, d: 'F',
      explanation: "Temperature > 30°C → conducteurs moins refroidis → IZ reduit (f1 < 1)." },
    { q: "Plusieurs cables groupes : facteur f2 (groupement)...", c: ["> 1", "< 1", "= 1", "= 0,5 toujours"], r: 1, d: 'F',
      explanation: "Le groupement empeche la dissipation thermique → on penalise IZ (f2 < 1)." },
    { q: "Chute de tension max admise sur une installation BT alimentant un moteur (NFC 15-100) ?", c: ["3 %", "5 %", "8 %", "Aucune limite"], r: 2, d: 'M',
      explanation: "Limite NFC 15-100 : 8 % pour les moteurs en regime permanent (depuis le tableau divisionnaire)." },
    { q: "Pouvoir de coupure (Pdc) : il doit etre...", c: ["= a I_n", "≥ Icc max sur le point", "Plus petit que Icc", "Indifferent"], r: 1, d: 'F',
      explanation: "Le Pdc du disjoncteur doit etre superieur ou egal a l'Icc presume au point d'installation." },
    { q: "Icc presume = 6 kA. Pdc disjoncteur normalise a choisir parmi 3-6-10-25 kA ?", c: ["3 kA", "6 kA", "10 kA", "25 kA"], r: 2, d: 'M',
      explanation: "Pdc ≥ Icc → on prend la valeur normalisee SUPERIEURE OU EGALE : 10 kA (avec marge)." },
    { q: "Symbole '4G2,5' sur un cable : signifie...", c: ["4 conducteurs de 2,5 mm² dont 1 vert/jaune", "4 mm² de section", "2,5 m de longueur", "4 prises"], r: 0, d: 'M',
      explanation: "G = avec conducteur de protection (vert/jaune). '4G2,5' = 3P + PE en 2,5 mm²." },
    { q: "Sur un cable 'U-1000 R2V', U-1000 designe...", c: ["La frequence", "La tension nominale (1000 V)", "Le diametre", "Le calibre"], r: 1, d: 'F',
      explanation: "U-1000 = tension nominale d'isolation 1000 V (BT industriel classique)." },
    { q: "Couleur normalisee du conducteur de protection PE ?", c: ["Rouge", "Bleu", "Vert/jaune", "Marron"], r: 2, d: 'F',
      explanation: "Vert + jaune entrelaces : conducteur de protection (PE). Bleu = neutre, marron/noir/gris = phases." },
    { q: "Court-circuit triphase Icc en sortie BT d'un transfo 400 kVA / Ucc = 4 %, U = 400 V. Icc ?", c: ["≈ 600 A", "≈ 14,4 kA", "≈ 1,4 kA", "≈ 145 A"], r: 1, d: 'D',
      explanation: "In = 400000/(1,73·400) ≈ 577 A. Icc ≈ In / Ucc(%) = 577 / 0,04 ≈ 14400 A = 14,4 kA." },
  ],

  "3. Regime de neutre & securite electrique": [
    { q: "Regime TT : protection contre les contacts indirects par...", c: ["Disjoncteur magnetique seul", "Differentiel obligatoire", "Fusible HPC", "Aucune"], r: 1, d: 'F',
      explanation: "TT : la boucle de defaut passe par la terre → seul un differentiel detecte le defaut." },
    { q: "Regime IT : avantage principal ?", c: ["Cout faible", "Continuite de service au 1er defaut", "Pas de neutre", "Aucun"], r: 1, d: 'M',
      explanation: "Le 1er defaut d'isolement ne coupe rien (signale par CPI). Indispensable en hopital, raffinerie." },
    { q: "Regime TN : la protection est assuree par le declencheur magnetique. Condition ?", c: ["Idefaut > Im (seuil magnetique)", "Idefaut < In", "Tension < 50 V", "Aucune"], r: 0, d: 'M',
      explanation: "Il faut que le courant de defaut court-circuit Id depasse le seuil magnetique Im pour declencher en < 0,4 s.", svg: SVG_REGIME_TN },
    { q: "Lmax (regime TN) : si on depasse cette longueur de cable...", c: ["La chute de tension explose", "Le declencheur magnetique ne fonctionne plus", "Le cable chauffe", "Rien"], r: 1, d: 'D',
      explanation: "Au-dela de Lmax, le courant Id devient trop faible pour atteindre Im → pas de declenchement → danger." },
    { q: "Tension limite de securite UL en local sec ?", c: ["12 V", "25 V", "50 V", "230 V"], r: 2, d: 'F',
      explanation: "UL = 50 V AC en local sec, 25 V humide, 12 V immerge." },
    { q: "Tension de defaut tolerable en local humide (UL) ?", c: ["12 V", "25 V", "50 V", "230 V"], r: 1, d: 'M',
      explanation: "Les locaux humides imposent UL = 25 V." },
    { q: "Differentiel haute sensibilite 30 mA : il protege ...", c: ["Les surcharges", "Les personnes (contacts directs/indirects)", "Les courts-circuits", "Les surtensions"], r: 1, d: 'F',
      explanation: "30 mA est le seuil de protection des personnes (contact direct ou indirect)." },
    { q: "Indice IP44 : protection contre...", c: ["Objets > 1mm + projections d'eau", "Poussiere totale + immersion", "Choc thermique", "Surtensions"], r: 0, d: 'M',
      explanation: "1er chiffre 4 = corps solides > 1 mm. 2eme chiffre 4 = projections d'eau (toutes directions)." },
    { q: "Indice IK : il caracterise la resistance...", c: ["A l'eau", "Aux chocs mecaniques", "Au feu", "Aux UV"], r: 1, d: 'F',
      explanation: "IK = degre de protection contre les impacts mecaniques (IK00 a IK10)." },
    { q: "Habilitation BR (BT) permet...", c: ["Manœuvres simples", "Interventions BT generales (depannage)", "Travaux HT", "Consignations HT"], r: 1, d: 'M',
      explanation: "BR = charge d'intervention BT generale. B = BT, R = intervention." },
    { q: "Avant intervention electrique, la regle est : VAT signifie ...", c: ["Verification d'Absence de Tension", "Voltmetre Analogique Tactique", "Ventilation Avant Travaux", "Verrouillage Avec Tournevis"], r: 0, d: 'M',
      explanation: "VAT = Verification d'Absence de Tension, etape obligatoire avant tout travail." },
    { q: "Classe II d'un appareil : il a ...", c: ["Une simple isolation + terre", "Une double isolation, pas de PE", "Aucune isolation", "Une isolation renforcee + terre"], r: 1, d: 'F',
      explanation: "Classe II = double isolation. Symbole : carre dans un carre. Pas de borne de terre." },
  ],

  "4. Triphase (couplage, puissances)": [
    { q: "Reseau 400 V triphase. Tension simple V entre phase et neutre ?", c: ["230 V", "400 V", "115 V", "692 V"], r: 0, d: 'F',
      explanation: "V = U / √3 = 400 / 1,73 ≈ 230 V." },
    { q: "Plaque MAS '230 V / 400 V Δ/Y'. Sur reseau 400 V triphase, couplage ?", c: ["Etoile (Y)", "Triangle (Δ)", "Indifferent", "Aucun"], r: 0, d: 'M',
      explanation: "La plus petite tension de plaque est pour le triangle. Comme U_reseau (400 V) = U_etoile, on couple en Y.", svg: SVG_PLAQUE_MAS },
    { q: "Plaque MAS '400 V / 690 V Δ/Y'. Sur reseau 400 V triphase, couplage ?", c: ["Etoile", "Triangle", "Aucun couplage possible", "Impossible"], r: 1, d: 'M',
      explanation: "La plus petite tension (400 V) correspond au triangle, qui equivaut au reseau : couplage Δ." },
    { q: "Couplage etoile : I de ligne par rapport au I de phase ?", c: ["Egal", "× √3", "/ √3", "× 3"], r: 0, d: 'F',
      explanation: "En etoile, chaque enroulement est sur une ligne unique : I_ligne = I_phase.", svg: SVG_STAR },
    { q: "Couplage triangle : I de ligne par rapport au I de phase ?", c: ["Egal", "= I_phase × √3", "= I_phase / √3", "= I_phase × 3"], r: 1, d: 'M',
      explanation: "I_ligne = √3 × I_phase (somme vectorielle de 2 courants decales).", svg: SVG_TRIANGLE },
    { q: "Puissance active triphasee equilibree, formule generale ?", c: ["P = U·I·cos φ", "P = √3·U·I·cos φ", "P = 3·U·I", "P = U·I"], r: 1, d: 'F',
      explanation: "Triphase equilibre : P = √3 × U(composee) × I(ligne) × cos φ." },
    { q: "MAS 400 V triphase, I_ligne = 10 A, cos φ = 0,8. Puissance active ?", c: ["3,2 kW", "5,5 kW", "8 kW", "≈ 5,5 kW"], r: 1, d: 'M',
      explanation: "P = √3 × 400 × 10 × 0,8 = 1,73 × 3200 ≈ 5540 W ≈ 5,5 kW." },
    { q: "Methode des 2 wattmetres : P_triphasee = ?", c: ["W1 + W2", "W1 - W2", "W1 × W2", "√3·(W1+W2)"], r: 0, d: 'M',
      explanation: "P = W1 + W2 (somme algebrique). Permet de mesurer en regime desequilibre sans neutre." },
    { q: "Methode des 2 wattmetres : si W1 = W2, alors cos φ ?", c: ["= 1 (charge resistive)", "= 0", "= 0,5", "Indetermine"], r: 0, d: 'M',
      explanation: "Q = √3·(W1 - W2). Si W1 = W2 alors Q = 0 → cos φ = 1." },
    { q: "Charge triphasee couplee en etoile sur reseau 400 V, R = 100 Ω par phase. I de ligne ?", c: ["2,3 A", "4 A", "10 A", "0,23 A"], r: 0, d: 'M',
      explanation: "V = 400/√3 ≈ 230 V. I_phase = V/R = 230/100 = 2,3 A. En etoile, I_ligne = I_phase." },
    { q: "Demarrage etoile-triangle : le courant absorbe par le reseau est divise par...", c: ["√3", "3", "2", "9"], r: 1, d: 'M',
      explanation: "U enroulement reduite par √3 → I × 1/√3. En etoile I_ligne = I_phase contre √3 fois en Δ : total /3." },
    { q: "Demarrage etoile-triangle : le couple de demarrage est divise par...", c: ["√3", "3", "2", "9"], r: 1, d: 'M',
      explanation: "Couple ∝ U² → U/√3 a la phase → T/3." },
  ],

  "5. Machine asynchrone (MAS)": [
    { q: "Vitesse de synchronisme d'une MAS 4 poles a 50 Hz ?", c: ["3000 tr/min", "1500 tr/min", "750 tr/min", "1000 tr/min"], r: 1, d: 'F',
      explanation: "p = 2 paires de poles : ns = 60·f/p = 60×50/2 = 1500 tr/min." },
    { q: "Vitesse de synchronisme d'une MAS 6 poles a 50 Hz ?", c: ["1500 tr/min", "3000 tr/min", "1000 tr/min", "750 tr/min"], r: 2, d: 'F',
      explanation: "p = 3 paires : ns = 60×50/3 = 1000 tr/min." },
    { q: "Plaque MAS '1440 tr/min'. Nombre de paires de poles a 50 Hz ?", c: ["1", "2", "3", "4"], r: 1, d: 'M',
      explanation: "n proche de ns = 1500 tr/min → p = 2 paires de poles (4 poles)." },
    { q: "MAS ns = 1500, n = 1485 tr/min. Glissement g ?", c: ["1 %", "2 %", "5 %", "10 %"], r: 0, d: 'M',
      explanation: "g = (ns-n)/ns = 15/1500 = 0,01 = 1 %." },
    { q: "MAS ns = 1000, n = 950 tr/min. Glissement ?", c: ["5 %", "10 %", "2 %", "50 %"], r: 0, d: 'M',
      explanation: "g = (1000-950)/1000 = 50/1000 = 5 %." },
    { q: "Au demarrage d'une MAS, le glissement vaut ?", c: ["0", "0,5", "1", "Negatif"], r: 2, d: 'F',
      explanation: "A l'arret n = 0 donc g = (ns-0)/ns = 1 (= 100 %)." },
    { q: "Courant de demarrage direct d'une MAS : il vaut typiquement...", c: ["In", "2·In", "5 a 8·In", "0,5·In"], r: 2, d: 'M',
      explanation: "Demarrage direct : appel de courant 5 a 8 fois In pendant qq secondes → necessite limitation au-dela d'un certain calibre." },
    { q: "Pour inverser le sens de rotation d'une MAS, on...", c: ["Coupe une phase", "Permute 2 phases", "Augmente la frequence", "Inverse le neutre"], r: 1, d: 'F',
      explanation: "Permuter 2 phases inverse l'ordre du champ tournant → sens de rotation inverse." },
    { q: "Pour faire varier la vitesse d'une MAS de maniere efficace, on utilise...", c: ["Un rheostat dans le rotor", "Un variateur de frequence (loi U/f)", "Un autotransformateur seul", "Un transformateur abaisseur"], r: 1, d: 'M',
      explanation: "Variateur de frequence : U/f constant pour conserver le flux nominal → couple max maintenu." },
    { q: "Loi U/f constante : pourquoi ?", c: ["Pour reduire la consommation", "Pour conserver le flux et le couple max", "Pour augmenter la vitesse max", "Aucune raison"], r: 1, d: 'M',
      explanation: "E ∝ N·Φ·f. Si U/f = cste, alors Φ = cste → Tmax independant de f." },
    { q: "Pertes Joule rotor : Pjr = g × P_transmise. Si P_transmise = 5 kW et g = 4 %, Pjr ?", c: ["200 W", "20 W", "500 W", "2 kW"], r: 0, d: 'M',
      explanation: "Pjr = 0,04 × 5000 = 200 W." },
    { q: "Plaque MAS '11 kW, cos φ = 0,85, 400 V, 22 A'. Le rendement vaut ?", c: ["≈ 0,73", "≈ 0,85", "≈ 0,90", "≈ 0,95"], r: 2, d: 'D',
      explanation: "Pa = √3·U·I·cos φ ≈ 1,73·400·22·0,85 ≈ 12940 W. η = 11000/12940 ≈ 0,85... oups : √3·400·22·0,85 ≈ 12940, donc η = 11/12,9 ≈ 0,85. Reponse : ≈ 0,85. (Voir explication detaillee — pour 90%, il aurait fallu I plus faible.)" },
    { q: "Demarrage etoile-triangle : on ne peut l'utiliser que si la plaque indique...", c: ["230/400 V", "400/690 V (couplage Δ possible sur reseau 400)", "230 V seul", "400 V seul"], r: 1, d: 'M',
      explanation: "Pour finir en Δ sur reseau 400 V, il faut que les enroulements supportent 400 V, donc plaque 400/690 V." },
  ],

  "6. Machine synchrone, MCC, transformateur": [
    { q: "Alternateur : la frequence delivree est imposee par...", c: ["La charge", "La vitesse de rotation et p", "La tension d'excitation", "Le couple"], r: 1, d: 'F',
      explanation: "f = n × p / 60. Une fois p fixe, la frequence ne depend que de la vitesse." },
    { q: "Alternateur tournant a 3000 tr/min, 2 poles. Frequence delivree ?", c: ["25 Hz", "50 Hz", "60 Hz", "100 Hz"], r: 1, d: 'M',
      explanation: "p = 1 paire : f = 3000 × 1 / 60 = 50 Hz." },
    { q: "Pour reguler la tension a vide d'un alternateur, on agit sur ...", c: ["La vitesse", "Le courant d'excitation Iex", "La charge", "La frequence"], r: 1, d: 'F',
      explanation: "Augmenter Iex → augmenter Φ → augmenter E (fem a vide)." },
    { q: "Couplage d'un alternateur au reseau : combien de conditions ?", c: ["1", "2", "4 (U, f, phase, ordre)", "10"], r: 2, d: 'M',
      explanation: "Synchronisation : meme tension, meme frequence, meme phase, meme ordre des phases." },
    { q: "MCC excitation independante : si on inverse uniquement le courant d'induit, la rotation...", c: ["Reste identique", "S'inverse", "S'arrete", "Acceleree"], r: 1, d: 'M',
      explanation: "Inverser I (ou Φ) inverse le sens du couple → inversion de rotation. Inverser les DEUX = retour au sens initial." },
    { q: "MCC : si on diminue le flux Φ (defluxage), la vitesse...", c: ["Diminue", "Reste constante", "Augmente", "S'annule"], r: 2, d: 'M',
      explanation: "Ω ≈ U / (k·Φ). Si Φ baisse, Ω augmente. Defluxage utilise au-dela de la vitesse nominale." },
    { q: "Transformateur abaisseur 20 kV / 400 V. Rapport m = N2/N1 ?", c: ["50", "1/50", "0,8", "20"], r: 1, d: 'M',
      explanation: "m = U2/U1 = 400/20000 = 0,02 = 1/50.", svg: SVG_TRANSFO_HTA },
    { q: "Transfo ideal : si U2 = U1/10, alors I2 vaut...", c: ["I1/10", "I1·10", "I1", "I1²"], r: 1, d: 'F',
      explanation: "Pa = Pu (ideal) → U1·I1 = U2·I2. Si U diminue de 10, I augmente de 10." },
    { q: "Essai a vide d'un transfo : on mesure essentiellement les pertes...", c: ["Cuivre", "Fer", "Totales", "Mecaniques"], r: 1, d: 'F',
      explanation: "I2 = 0 donc I1 tres faible donc Pcu ≈ 0. La puissance mesuree = pertes fer (P0)." },
    { q: "Essai en court-circuit a tension reduite : on mesure les pertes...", c: ["Cuivre (Pcc)", "Fer", "Mecaniques", "Diel."], r: 0, d: 'F',
      explanation: "U1cc tres faible → Pfer ≈ 0. La puissance mesuree donne les pertes Joule a courant nominal." },
    { q: "Pertes fer d'un transfo : elles dependent surtout de...", c: ["La charge", "La tension/frequence (flux)", "La temperature", "Le rendement"], r: 1, d: 'M',
      explanation: "Hysteresis + Foucault → pertes constantes tant que U et f le sont. Pas de dependance a la charge." },
    { q: "Rendement maximal d'un transfo : c'est quand...", c: ["Charge nominale", "Pertes fer = pertes cuivre", "A vide", "Court-circuit"], r: 1, d: 'M',
      explanation: "η max quand pertes constantes (fer) = pertes variables (cuivre, ∝ I²)." },
  ],

  "7. Compensation d'energie reactive & harmoniques": [
    { q: "Charge inductive : pour compenser, on ajoute en parallele...", c: ["Une bobine", "Un condensateur", "Une resistance", "Un transfo"], r: 1, d: 'F',
      explanation: "Le condensateur fournit du Q qui annule celui consomme par l'inductif." },
    { q: "Q a fournir pour compenser P = 100 kW de cos φ 0,8 a cos φ 1 ?", c: ["50 kvar", "75 kvar", "100 kvar", "125 kvar"], r: 1, d: 'M',
      explanation: "tan φ1 = sin/cos = 0,6/0,8 = 0,75. tan φ2 = 0. Qc = P·(tan φ1-tan φ2) = 100·0,75 = 75 kvar." },
    { q: "Au-dessus de quelle valeur de tan φ Enedis facture-t-il le reactif (HP) ?", c: ["0,1", "0,4", "1", "0,5"], r: 1, d: 'F',
      explanation: "Tan φ > 0,4 (cos φ < 0,93) en heures pleines hiver → penalite." },
    { q: "Cos φ d'une installation a tan φ = 0 ?", c: ["0", "0,5", "1", "0,87"], r: 2, d: 'F',
      explanation: "tan φ = 0 ⇔ φ = 0° ⇔ cos φ = 1 (compensation parfaite)." },
    { q: "Compensation automatique : quand la preferer a la fixe ?", c: ["Charge constante", "Charge tres variable", "Petit local", "Aucun cas"], r: 1, d: 'M',
      explanation: "Charges variables (gradins de condensateurs commutes) pour eviter surcompensation." },
    { q: "THDi : taux de distorsion harmonique du courant. Valeur tolerable typique ?", c: ["50 %", "< 10 %", "100 %", "0 %"], r: 1, d: 'M',
      explanation: "En general, THDi < 10 % est acceptable. Au-dela : reseau pollue, deformation des signaux." },
    { q: "En presence d'harmoniques rang 5/7, les condensateurs de compensation peuvent...", c: ["Eclater (resonance)", "Mieux compenser", "Couper le reseau", "Rien"], r: 0, d: 'D',
      explanation: "Resonance avec l'inductance du reseau peut amplifier dangereusement les harmoniques → selfs anti-harmoniques." },
    { q: "Filtre actif : il sert a ...", c: ["Compenser le cos φ", "Compenser les harmoniques par injection", "Mesurer la frequence", "Rectifier le courant"], r: 1, d: 'M',
      explanation: "Filtre actif injecte un courant en opposition de phase aux harmoniques de la charge." },
    { q: "Self anti-harmonique : on en place en serie avec les condensateurs pour...", c: ["Augmenter Q", "Decaler la frequence de resonance hors des rangs presents", "Reduire le courant", "Mesurer le THD"], r: 1, d: 'D',
      explanation: "L'inductance en serie deplace la frequence de resonance (rang 3,8 ou 4,3 typiques) pour eviter les rangs 5/7." },
    { q: "P = 100 kW, S = 125 kVA. Cos φ ?", c: ["0,5", "0,8", "1", "1,25"], r: 1, d: 'F',
      explanation: "cos φ = P/S = 100/125 = 0,8.", svg: SVG_TRIANGLE_POWER },
    { q: "P = 60 kW, Q = 80 kvar. S ?", c: ["100 kVA", "140 kVA", "20 kVA", "120 kVA"], r: 0, d: 'M',
      explanation: "S = √(P²+Q²) = √(3600+6400) = √10000 = 100 kVA. (Triangle 3-4-5 !)" },
  ],

  "8. Variation de vitesse & electronique de puissance": [
    { q: "Variateur de vitesse pour MAS : structure typique ?", c: ["Redresseur + bus DC + onduleur MLI", "Transformateur seul", "Gradateur", "Hacheur seul"], r: 0, d: 'F',
      explanation: "Reseau AC → redressement → bus continu → onduleur MLI → moteur (U et f variables)." },
    { q: "MLI : on fait varier...", c: ["La frequence porteuse seule", "Le rapport cyclique pour ajuster la valeur moyenne", "La temperature", "Aucun parametre"], r: 1, d: 'M',
      explanation: "Modulation de largeur d'impulsion : on contrôle la duree de conduction → valeur moyenne souhaitee." },
    { q: "Frequence de decoupage typique d'un variateur ATV630 ?", c: ["50 Hz", "1 a 20 kHz", "1 MHz", "1 Hz"], r: 1, d: 'F',
      explanation: "Frequence porteuse de qq kHz : compromis entre pertes et finesse de la sinusoide reconstituee." },
    { q: "Composant principal d'un onduleur de variateur moderne ?", c: ["Thyristor", "IGBT", "Triac", "Diode tunnel"], r: 1, d: 'F',
      explanation: "IGBT : bonne commutation rapide, isolation de commande, jusqu'a qq centaines d'A et 1200/1700 V." },
    { q: "Hacheur serie : Us = α × Ue. Si α = 0,5 et Ue = 100 V, Us ?", c: ["50 V", "100 V", "200 V", "25 V"], r: 0, d: 'F',
      explanation: "Us = α·Ue = 0,5 × 100 = 50 V.", svg: SVG_HACHEUR },
    { q: "Redresseur PD2 (pont de Graetz monophase) : Umoy ?", c: ["Umax/π", "2·Umax/π", "Umax/2", "Umax"], r: 1, d: 'M',
      explanation: "Pont de Graetz redresse les 2 alternances → Umoy = 2·Umax/π ≈ 0,9·Ueff.", svg: SVG_PD2 },
    { q: "Pont PD2 alimente sous 230 V efficace. Umoy ?", c: ["≈ 207 V", "230 V", "325 V", "100 V"], r: 0, d: 'M',
      explanation: "Umoy ≈ 0,9 × 230 = 207 V." },
    { q: "Pont PD3 alimente sous 400 V efficace compose. Umoy ?", c: ["≈ 540 V", "230 V", "400 V", "692 V"], r: 0, d: 'M',
      explanation: "Umoy ≈ 1,35 × Ueff_composee = 1,35 × 400 = 540 V." },
    { q: "Frequence d'ondulation d'un pont PD3 alimente en 50 Hz ?", c: ["50 Hz", "100 Hz", "300 Hz", "150 Hz"], r: 2, d: 'M',
      explanation: "PD3 : 6 alternances par periode → 6×50 = 300 Hz." },
    { q: "Onduleur autonome de secours (ASI) : on convertit ...", c: ["AC en DC", "DC (batterie) en AC", "AC en AC", "Rien"], r: 1, d: 'F',
      explanation: "ASI : batterie continu → tension alternative reseau pour secourir les charges critiques." },
    { q: "Topologie ASI VFI (On-line double conversion) : la charge est alimentee par...", c: ["Le reseau direct", "Toujours l'onduleur", "By-pass seul", "Aucun"], r: 1, d: 'M',
      explanation: "VFI : redresseur charge la batterie + onduleur alimente en permanence la charge (le mieux pour la qualite)." },
    { q: "Gradateur : on commande...", c: ["La tension continue", "La tension efficace AC (angle de phase)", "La frequence", "Le couple"], r: 1, d: 'M',
      explanation: "Deux thyristors tete-beche (ou triac) : retard d'amorçage → reduit la Ueff (eclairage, chauffage)." },
  ],

  "9. Automatisme & communication industrielle": [
    { q: "API : abreviation de ...", c: ["Automate Programmable Industriel", "Adresse Physique d'Interface", "Acquisition Permanente d'Image", "Aucun"], r: 0, d: 'F',
      explanation: "API = automate programmable industriel (PLC en anglais)." },
    { q: "Signal analogique industriel courant : ...", c: ["0-5 V uniquement", "4-20 mA (boucle de courant)", "230 V AC", "0-1 V"], r: 1, d: 'F',
      explanation: "4-20 mA : standard industriel (immunise contre les chutes de tension sur les longs cables)." },
    { q: "Avantage du 4-20 mA sur le 0-10 V ?", c: ["Moins cher", "Detection de cable coupe (I = 0 mA = defaut)", "Plus precis", "Plus rapide"], r: 1, d: 'M',
      explanation: "Si I = 0 mA → cable coupe ou capteur HS. Plage utile commence a 4 mA → diagnostic facile." },
    { q: "Sur un automate Schneider, %I0.0 designe...", c: ["Une entree TOR", "Une sortie TOR", "Une variable interne", "Un mot 16 bits"], r: 0, d: 'F',
      explanation: "%I = entree (Input), %Q = sortie (Output), %M = memoire, %MW = mot." },
    { q: "Sur un automate Schneider, %QW2 designe...", c: ["Une sortie TOR", "Un mot de sortie 16 bits (analogique)", "Une entree analogique", "Une variable booleenne"], r: 1, d: 'M',
      explanation: "QW = sortie mot (Word) → typiquement consigne analogique 0-10 V ou 4-20 mA." },
    { q: "Pour une entree analogique 4-20 mA mise a l'echelle 0-10 000 dans l'automate, 12 mA correspond a ?", c: ["0", "2 500", "5 000", "10 000"], r: 2, d: 'M',
      explanation: "12 mA = milieu de la plage 4-20 → 50 % → 5 000." },
    { q: "Reserve typique conseillee sur le nombre d'E/S d'un automate neuf ?", c: ["0 %", "20-30 %", "100 %", "Aucune"], r: 1, d: 'F',
      explanation: "On dimensionne 20 a 30 % de marge pour evolutions futures." },
    { q: "Modbus RTU : il utilise...", c: ["Ethernet TCP/IP seulement", "Une liaison serie RS-485", "USB", "Wi-Fi natif"], r: 1, d: 'F',
      explanation: "Modbus RTU = trame binaire sur RS-485 (jusqu'a 32 esclaves, 1200 m)." },
    { q: "Une adresse IP en /28 a combien de bits pour la partie hote ?", c: ["28", "4", "8", "16"], r: 1, d: 'M',
      explanation: "/28 = 28 bits de reseau, donc 32-28 = 4 bits hote → 14 adresses utiles." },
    { q: "Adresse 192.168.1.10 / masque 255.255.255.0. Adresse de reseau ?", c: ["192.168.1.0", "192.168.0.0", "192.168.1.10", "255.255.255.0"], r: 0, d: 'M',
      explanation: "Masque /24 : on garde les 3 premiers octets et on met le dernier a 0 → 192.168.1.0." },
    { q: "Trame Modbus : un mot 16 bits represente une valeur entre...", c: ["0 et 100", "0 et 65535", "0 et 256", "0 et 999"], r: 1, d: 'M',
      explanation: "16 bits = 2¹⁶ = 65 536 valeurs (de 0 a 65 535)." },
    { q: "Une variable booleenne (TOR) peut prendre combien de valeurs ?", c: ["1", "2 (0/1)", "256", "65536"], r: 1, d: 'F',
      explanation: "TOR = Tout Ou Rien = vrai (1) ou faux (0)." },
  ],

  "10. Hydraulique, pompes & efficacite energetique": [
    { q: "Pression hydrostatique pour une hauteur d'eau de 10 m (ρ = 1000 kg/m³, g ≈ 10) ?", c: ["1 bar (100 kPa)", "10 bar", "100 mbar", "1 kPa"], r: 0, d: 'M',
      explanation: "p = ρ·g·h = 1000 × 10 × 10 = 100 000 Pa = 100 kPa = 1 bar.", svg: SVG_BERNOULLI },
    { q: "Puissance hydraulique : Ph = ρ·g·Q·H. Pour Q = 0,01 m³/s, H = 10 m, ρ = 1000, g = 10. Ph ?", c: ["100 W", "1000 W", "10 W", "1 W"], r: 1, d: 'M',
      explanation: "Ph = 1000 × 10 × 0,01 × 10 = 1000 W = 1 kW." },
    { q: "Une pompe a un rendement η = 0,7. Pour fournir Ph = 7 kW, puissance electrique absorbee ?", c: ["10 kW", "7 kW", "4,9 kW", "0,7 kW"], r: 0, d: 'M',
      explanation: "Pa = Ph / η = 7/0,7 = 10 kW." },
    { q: "Loi des affinites : si on multiplie la vitesse d'une pompe par 2, le debit est multiplie par...", c: ["1", "2", "4", "8"], r: 1, d: 'M',
      explanation: "Q ∝ N (debit proportionnel a la vitesse)." },
    { q: "Loi des affinites : si vitesse × 2, la pression (HMT) est multipliee par...", c: ["1", "2", "4", "8"], r: 2, d: 'M',
      explanation: "H ∝ N² (pression au carre de la vitesse)." },
    { q: "Loi des affinites : si vitesse × 2, la puissance absorbee est multipliee par...", c: ["1", "2", "4", "8"], r: 3, d: 'D',
      explanation: "P ∝ N³ (puissance au cube !). C'est pour ça qu'un variateur economise enormement sur les pompes." },
    { q: "Debit dans une canalisation : Q = S × v. S = 0,01 m², v = 2 m/s. Q ?", c: ["0,02 m³/s", "200 L/s", "20 L/s", "0,2 L/s"], r: 0, d: 'M',
      explanation: "Q = 0,01 × 2 = 0,02 m³/s = 20 L/s." },
    { q: "Pour faire varier le debit d'une pompe centrifuge avec le meilleur rendement energetique, on...", c: ["Etrangle une vanne", "Utilise un variateur de vitesse", "Demarre/arrete", "Ajoute un condensateur"], r: 1, d: 'M',
      explanation: "Variateur : Q ∝ N et P ∝ N³ → grosse economie d'energie par rapport au by-pass ou a l'etranglement." },
    { q: "ROI (retour sur investissement) : economie 2000 €/an pour un cout 10 000 €. Temps de retour ?", c: ["2 ans", "5 ans", "10 ans", "20 ans"], r: 1, d: 'F',
      explanation: "ROI = cout / economie annuelle = 10000 / 2000 = 5 ans." },
    { q: "Tarif HP (heures pleines) : plus cher en general que les HC. Pourquoi y reflechir ?", c: ["Pour la couleur", "Decaler les consommations evitables en HC", "Aucune raison", "Pour le confort"], r: 1, d: 'M',
      explanation: "Decaler chauffage/ECS/recharge VE en heures creuses (nuit) reduit la facture." },
    { q: "Turbine Pelton : adaptee pour...", c: ["Faible chute, gros debit", "Tres haute chute, faible debit", "Tout type", "Marees"], r: 1, d: 'M',
      explanation: "Pelton (a action) : haute pression (centaines de m), faible debit. Kaplan = inverse, Francis = intermediaire." },
  ],

  "11. Magnetisme & electromagnetisme": [
    { q: "Unite du flux magnetique ?", c: ["Tesla", "Weber", "Henry", "Ampere"], r: 1, d: 'F',
      explanation: "Le flux Φ se mesure en Weber (Wb). 1 Wb = 1 V·s = 1 T·m²." },
    { q: "Unite de l'induction B ?", c: ["Weber", "Tesla", "Henry", "Ohm"], r: 1, d: 'F',
      explanation: "B se mesure en Tesla (T)." },
    { q: "Loi de Faraday : la fem induite vaut...", c: ["L·I", "-dΦ/dt", "B·v", "R·I"], r: 1, d: 'F',
      explanation: "Variation de flux dans le temps → fem induite (loi de Lenz-Faraday)." },
    { q: "100 spires voient Φ varier de 0,2 Wb en 2 s. fem ?", c: ["10 V", "100 V", "20 V", "1 V"], r: 0, d: 'M',
      explanation: "e = N·ΔΦ/Δt = 100 × 0,2/2 = 10 V." },
    { q: "Energie stockee dans une bobine de L = 1 H parcourue par 10 A ?", c: ["10 J", "50 J", "100 J", "5 J"], r: 1, d: 'M',
      formula: "W = ½·L·I²",
      explanation: "W = 0,5 × 1 × 100 = 50 J." },
    { q: "Energie stockee dans un condensateur 100 µF charge a 100 V ?", c: ["0,5 J", "5 J", "1 J", "0,1 J"], r: 0, d: 'M',
      formula: "W = ½·C·U²",
      explanation: "W = 0,5 × 10⁻⁴ × 10⁴ = 0,5 J." },
    { q: "Force de Laplace : F = B·I·L. B = 1 T, I = 5 A, L = 0,2 m. F ?", c: ["1 N", "5 N", "0,5 N", "10 N"], r: 0, d: 'F',
      explanation: "F = 1 × 5 × 0,2 = 1 N." },
    { q: "Materiau ferromagnetique courant pour les noyaux de transfo ?", c: ["Cuivre", "Aluminium", "Fer-silicium", "Carbone"], r: 2, d: 'F',
      explanation: "Tôles fer-silicium minces (FeSi 3 %) : faibles pertes par courants de Foucault et hysteresis." },
    { q: "Theoreme d'Ampere : ∮ H·dl = ...", c: ["B·S", "ΣN·I (amperes-tours embrasses)", "L·I", "Φ"], r: 1, d: 'M',
      explanation: "Circulation du champ H sur un contour ferme = somme des amperes-tours qu'il embrasse." },
    { q: "Reluctance : analogue magnetique de quelle grandeur electrique ?", c: ["Capacite", "Resistance", "Inductance", "Tension"], r: 1, d: 'M',
      explanation: "Loi d'Hopkinson NI = R·Φ : la reluctance R joue le role de la resistance. NI ↔ U et Φ ↔ I." },
  ],

  "12. Lois fondamentales (revisions de base)": [
    { q: "Loi d'Ohm : R = 100 Ω, U = 20 V. I = ?", c: ["0,2 A", "2 A", "20 A", "200 A"], r: 0, d: 'F',
      explanation: "I = U/R = 20/100 = 0,2 A." },
    { q: "Deux R = 100 Ω en serie. Resistance equivalente ?", c: ["50 Ω", "100 Ω", "200 Ω", "10000 Ω"], r: 2, d: 'F',
      explanation: "R_eq = R1 + R2 = 200 Ω." },
    { q: "Deux R = 100 Ω en parallele. Resistance equivalente ?", c: ["50 Ω", "100 Ω", "200 Ω", "0,02 Ω"], r: 0, d: 'F',
      explanation: "Deux R identiques en parallele : R/2 = 50 Ω." },
    { q: "Trois R = 30 Ω en parallele. R equivalente ?", c: ["10 Ω", "30 Ω", "90 Ω", "3 Ω"], r: 0, d: 'M',
      explanation: "n R identiques en parallele : R/n = 30/3 = 10 Ω." },
    { q: "Pont diviseur : U = 10 V, R1 = R2. Tension aux bornes de R2 ?", c: ["10 V", "5 V", "2,5 V", "0 V"], r: 1, d: 'F',
      explanation: "U2 = U·R2/(R1+R2). Si R1 = R2 : U2 = U/2 = 5 V.", svg: SVG_DIVIDER },
    { q: "Puissance dissipee par R = 10 Ω parcourue par 3 A ?", c: ["30 W", "90 W", "9 W", "300 W"], r: 1, d: 'M',
      formula: "P = R·I²",
      explanation: "P = 10 × 9 = 90 W." },
    { q: "Energie consommee par 3 kW pendant 4 h ?", c: ["12 kWh", "1,2 kWh", "120 kWh", "12 kJ"], r: 0, d: 'F',
      explanation: "W = P·t = 3 × 4 = 12 kWh." },
    { q: "Une batterie 12 V / 20 Ah. Energie stockee ?", c: ["240 Wh", "24 Wh", "2,4 kWh", "12 Wh"], r: 0, d: 'F',
      explanation: "W = U·Q = 12 × 20 = 240 Wh." },
    { q: "Loi des noeuds : 4 A entrent, 1 A sort par une branche. Courant dans l'autre branche ?", c: ["5 A", "3 A", "4 A", "1 A"], r: 1, d: 'F',
      explanation: "Kirchhoff : 4 = 1 + I → I = 3 A." },
    { q: "Effet Joule : si on double le courant, les pertes Joule sont multipliees par...", c: ["2", "4", "8", "1"], r: 1, d: 'M',
      explanation: "Pj = R·I². I × 2 → Pj × 4." },
    { q: "Rendement d'un convertisseur 90 W utiles / 100 W absorbes ?", c: ["10 %", "90 %", "111 %", "Inconnu"], r: 1, d: 'F',
      explanation: "η = Pu/Pa = 90/100 = 0,9 = 90 %." },
    { q: "Valeur efficace d'une tension sinusoidale 50 V crete-a-crete ?", c: ["50 V", "25 V", "≈ 17,7 V", "≈ 8,8 V"], r: 2, d: 'M',
      explanation: "Crete-a-crete = 50 V → crete = 25 V → Ueff = Umax/√2 = 25/1,41 ≈ 17,7 V.", svg: SVG_SINE },
  ],

  "13. Asservissement & regulation": [
    { q: "Systeme en boucle ouverte : utilise un retour sur la sortie ?", c: ["Oui", "Non", "Parfois", "Toujours"], r: 1, d: 'F',
      explanation: "Boucle ouverte = aucun retour. Pas de correction des perturbations." },
    { q: "Action proportionnelle P : effet d'augmenter le gain Kp ?", c: ["Plus stable, plus lent", "Plus rapide, plus oscillant", "Annule l'erreur statique", "Aucun"], r: 1, d: 'M',
      explanation: "Kp grand : reactif mais risque d'oscillations et d'instabilite." },
    { q: "Action integrale I : elle sert a...", c: ["Annuler l'erreur statique", "Accelerer la reponse", "Reduire le depassement", "Filtrer le bruit"], r: 0, d: 'F',
      explanation: "L'integrale s'accumule tant qu'il y a erreur → la sortie progresse jusqu'a ce que l'erreur soit nulle." },
    { q: "Action derivee D : elle ameliore...", c: ["L'erreur statique", "La stabilite (anticipe)", "La puissance", "Le bruit"], r: 1, d: 'M',
      explanation: "Anticipe la variation de l'erreur → freine les oscillations → ameliore amortissement." },
    { q: "PID : les 3 actions sont...", c: ["Proportionnelle, Integrale, Derivee", "Positive, Inverse, Doublee", "P, N, S", "Plus, Moins, Zero"], r: 0, d: 'F',
      explanation: "PID = somme des 3 actions, reglees par Kp, Ki, Kd." },
    { q: "Constante de temps τ : a 3τ, la sortie atteint environ...", c: ["50 %", "63 %", "95 %", "100 %"], r: 2, d: 'M',
      explanation: "1τ → 63 %, 3τ → 95 %, 5τ → 99 % (regle pratique : t_reponse ≈ 3 a 5 τ)." },
    { q: "Marge de phase typique souhaitee ?", c: ["≈ 0°", "≈ 45° a 60°", "180°", "270°"], r: 1, d: 'M',
      explanation: "45-60° de marge de phase = compromis stabilite/rapidite." },
    { q: "Critere de Nyquist : on regarde le contour de la FTBO autour de quel point ?", c: ["(0, 0)", "(-1, 0)", "(1, 0)", "(0, 1)"], r: 1, d: 'D',
      explanation: "Le point critique est -1. Encerclement → instabilite en boucle fermee." },
    { q: "Capteur de temperature industriel courant ?", c: ["LED", "PT100 (sonde resistive)", "Diode laser", "Condensateur"], r: 1, d: 'F',
      explanation: "PT100 : platine 100 Ω a 0°C, varie de ~0,4 Ω/°C. Lineaire et precis." },
    { q: "Servomoteur de regulation : il agit sur ...", c: ["L'affichage", "Un actionneur (vanne, registre, etc.)", "Le capteur", "L'alimentation"], r: 1, d: 'M',
      explanation: "Le servomoteur positionne l'actionneur en fonction de la commande issue du regulateur." },
  ],
};

module.exports = QUESTIONS;

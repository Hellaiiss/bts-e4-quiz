// ============================================================
// QUESTIONS BTS Electrotechnique E4 - VERSION PEDAGOGIQUE
// Format : { q, c, r, d?, formula?, explanation?, svg? }
//   q           : enonce (noms complets, acronymes evites ou explicites)
//   c           : 4 propositions
//   r           : index 0..3 de la bonne reponse
//   d           : difficulte 'F' (Facile), 'M' (Moyen), 'D' (Difficile)
//   formula     : formule affichee (volontairement absente quand elle revele)
//   explanation : explication pedagogique : on enseigne le concept, on detaille
//                 le calcul, on explique POURQUOI - pas juste la formule sechee
//   svg         : schema (optionnel)
// ============================================================

const SVG_PLAQUE_MAS = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="280" height="120" fill="#fef3c7" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="40" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">PLAQUE MOTEUR ASYNCHRONE</text>
  <line x1="20" y1="48" x2="300" y2="48" stroke="#0f172a"/>
  <text x="35" y="68" font-size="12" fill="#0f172a">3~ triphase  50 Hz</text>
  <text x="35" y="88" font-size="12" fill="#0f172a">Δ (triangle) 230 V    8,7 A</text>
  <text x="35" y="108" font-size="12" fill="#0f172a">Y (etoile)   400 V    5,0 A</text>
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
  <text x="135" y="120" font-size="12" fill="#0f172a">N (neutre)</text>
  <text x="135" y="30" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="bold">L1</text>
  <text x="65" y="175" font-size="13" fill="#22c55e" font-weight="bold">L2</text>
  <text x="210" y="175" font-size="13" fill="#3b82f6" font-weight="bold">L3</text>
  <text x="140" y="195" text-anchor="middle" font-size="12" fill="#0f172a">Couplage en etoile</text>
</svg>`;

const SVG_TRIANGLE = `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="140,40 80,150 200,150" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <text x="135" y="15" font-size="13" fill="#dc2626" font-weight="bold">L1</text>
  <text x="40" y="180" font-size="13" fill="#22c55e" font-weight="bold">L2</text>
  <text x="225" y="180" font-size="13" fill="#3b82f6" font-weight="bold">L3</text>
  <text x="140" y="195" text-anchor="middle" font-size="12" fill="#0f172a">Couplage en triangle</text>
</svg>`;

const SVG_TRIANGLE_POWER = `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="140" x2="240" y2="140" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="240" y1="140" x2="240" y2="40" stroke="#dc2626" stroke-width="2.5"/>
  <line x1="40" y1="140" x2="240" y2="40" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="140" y="160" text-anchor="middle" font-size="13" fill="#0f172a">P (puissance active, W)</text>
  <text x="255" y="95" font-size="13" fill="#dc2626">Q (reactive, var)</text>
  <text x="120" y="85" font-size="13" fill="#3b82f6">S (apparente, VA)</text>
</svg>`;

const SVG_SINE = `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="70" x2="310" y2="70" stroke="#94a3b8" stroke-width="1"/>
  <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 20 70 Q 60 -10 100 70 T 180 70 T 260 70 T 340 70" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="305" y="65" font-size="11" fill="#0f172a">temps</text>
  <text x="10" y="20" font-size="11" fill="#0f172a">tension</text>
  <text x="150" y="135" text-anchor="middle" font-size="12" fill="#0f172a">Tension alternative sinusoidale</text>
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
  <text x="160" y="170" text-anchor="middle" font-size="12" fill="#0f172a">Pont redresseur a 4 diodes (Graetz)</text>
</svg>`;

const SVG_HACHEUR = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="40" x2="20" y2="120" stroke="#0f172a" stroke-width="2"/>
  <text x="35" y="85" font-size="12" fill="#0f172a">Ue</text>
  <line x1="20" y1="40" x2="120" y2="40" stroke="#0f172a" stroke-width="2"/>
  <rect x="120" y="30" width="40" height="20" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
  <text x="140" y="44" text-anchor="middle" font-size="11" fill="#0f172a" font-weight="bold">interr.</text>
  <line x1="160" y1="40" x2="290" y2="40" stroke="#0f172a" stroke-width="2"/>
  <rect x="280" y="55" width="20" height="40" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="305" y="80" font-size="11" fill="#0f172a">Us</text>
  <line x1="290" y1="40" x2="290" y2="120" stroke="#0f172a" stroke-width="2"/>
  <line x1="290" y1="120" x2="20" y2="120" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="145" text-anchor="middle" font-size="12" fill="#0f172a">Hacheur (decoupage continu)</text>
</svg>`;

const SVG_TRANSFO_HTA = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="30" font-size="12" fill="#dc2626" font-weight="bold">Moyenne tension 20 kV</text>
  <text x="200" y="30" font-size="12" fill="#22c55e" font-weight="bold">Basse tension 400 V</text>
  <line x1="20" y1="50" x2="80" y2="50" stroke="#0f172a" stroke-width="2"/>
  <line x1="20" y1="110" x2="80" y2="110" stroke="#0f172a" stroke-width="2"/>
  <path d="M 80 40 Q 92 50 80 60 Q 92 70 80 80 Q 92 90 80 100 Q 92 110 80 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="140" y1="20" x2="140" y2="130" stroke="#0f172a" stroke-width="3"/>
  <line x1="150" y1="20" x2="150" y2="130" stroke="#0f172a" stroke-width="3"/>
  <path d="M 210 40 Q 198 50 210 60 Q 198 70 210 80 Q 198 90 210 100 Q 198 110 210 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="210" y1="50" x2="290" y2="50" stroke="#0f172a" stroke-width="2"/>
  <line x1="210" y1="110" x2="290" y2="110" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="150" text-anchor="middle" font-size="12" fill="#0f172a">Transformateur abaisseur</text>
</svg>`;

const SVG_REGIME_TN = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="20" font-size="12" font-weight="bold" fill="#0f172a">Regime de neutre TN (terre + neutre)</text>
  <line x1="40" y1="40" x2="280" y2="40" stroke="#dc2626" stroke-width="2"/>
  <text x="285" y="44" font-size="11" fill="#dc2626">Phase</text>
  <line x1="40" y1="65" x2="280" y2="65" stroke="#3b82f6" stroke-width="2"/>
  <text x="285" y="69" font-size="11" fill="#3b82f6">Neutre</text>
  <line x1="40" y1="90" x2="280" y2="90" stroke="#22c55e" stroke-width="2"/>
  <text x="285" y="94" font-size="11" fill="#22c55e">Terre</text>
  <rect x="180" y="100" width="40" height="40" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="200" y="125" text-anchor="middle" font-size="11" fill="#0f172a">Moteur</text>
</svg>`;

const SVG_BERNOULLI = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="30" x2="40" y2="130" stroke="#3b82f6" stroke-width="3"/>
  <line x1="40" y1="130" x2="280" y2="130" stroke="#3b82f6" stroke-width="3"/>
  <line x1="40" y1="40" x2="60" y2="40" stroke="#3b82f6" stroke-width="3"/>
  <line x1="270" y1="120" x2="290" y2="120" stroke="#3b82f6" stroke-width="3"/>
  <text x="20" y="50" font-size="11" fill="#0f172a">Haut</text>
  <text x="280" y="115" font-size="11" fill="#0f172a">Bas</text>
  <text x="5" y="85" font-size="11" fill="#0f172a">Δz</text>
  <text x="150" y="155" text-anchor="middle" font-size="11" fill="#0f172a">Bernoulli : energie cinetique + potentielle + pression = cste</text>
</svg>`;

const QUESTIONS = {

  "1. Bilan de puissance et dimensionnement": [
    { q: "4 charges de 10 kW chacune fonctionnent rarement toutes en meme temps. Le coefficient de simultaneite vaut 0,8. Puissance reellement appelee ?", c: ["32 kW", "40 kW", "10 kW", "50 kW"], r: 0, d: 'M',
      explanation: "On parle de FOISONNEMENT : sur 4 charges de 10 kW, en realite elles ne tournent pas toutes en meme temps. Le coefficient de simultaneite (note Ks) vaut 0,8 → on ne compte que 80 % du total. Calcul : 0,8 × (4 × 10) = 0,8 × 40 = 32 kW." },
    { q: "Le coefficient de simultaneite est en general...", c: ["superieur a 1", "inferieur ou egal a 1 (charges non simultanees)", "negatif", "egal a 0"], r: 1, d: 'F',
      explanation: "Le coefficient de simultaneite Ks tient compte du fait que toutes les charges d'une installation ne fonctionnent pas en meme temps. Il vaut entre 0,7 et 1 en pratique : plus il y a de charges variees, plus Ks descend." },
    { q: "Un moteur fonctionne en moyenne a 75 % de sa puissance nominale. Son coefficient d'utilisation vaut ?", c: ["1", "0,75", "0,5", "1,33"], r: 1, d: 'F',
      explanation: "Le coefficient d'utilisation (note Ku) = puissance reelle / puissance nominale. Un moteur 4 kW qui ne sort que 3 kW utiles a un Ku de 3/4 = 0,75." },
    { q: "Une installation a P = 100 kW utiles et un facteur de puissance cos φ = 0,8. Puissance apparente ?", c: ["80 kVA", "125 kVA", "100 kVA", "160 kVA"], r: 1, d: 'M',
      explanation: "La puissance apparente S (en kVA = kilo-volt-ampere) represente le 'dimensionnement electrique', incluant l'energie reactive. Formule : S = P / cos φ = 100 / 0,8 = 125 kVA. C'est elle qui sert a dimensionner les cables et le transformateur." },
    { q: "Bilan installation : 100 kVA necessaires. Calibre transformateur a choisir parmi 63 / 100 / 160 / 250 kVA ?", c: ["63 kVA", "100 kVA", "160 kVA", "Pas de transfo"], r: 2, d: 'M',
      explanation: "Quand on dimensionne un transformateur, on prend le calibre normalise IMMEDIATEMENT SUPERIEUR au besoin. Ici on a besoin de 100 kVA → on prend 160 kVA pour garder une marge (le 100 kVA tournerait en permanence a la limite, mauvais pour la duree de vie)." },
    { q: "Taux de charge d'un transformateur de 250 kVA qui debite 200 kVA ?", c: ["80 %", "125 %", "50 %", "20 %"], r: 0, d: 'F',
      explanation: "Le taux de charge = puissance reellement debitee / puissance nominale du transformateur. Ici 200/250 = 0,80 = 80 %. C'est un bon taux de charge (l'optimum est entre 60 et 80 %)." },
    { q: "Pour un transformateur abaisseur d'immeuble, un bon taux de charge se situe vers...", c: ["10 %", "75 %", "120 %", "200 %"], r: 1, d: 'M',
      explanation: "L'optimum est entre 60 et 80 % : a la fois bon rendement (les pertes a vide ne sont pas perdues pour rien) et marge pour les pointes de consommation. En dessous de 30 %, beaucoup d'energie est gachee en pertes a vide." },
    { q: "Installation triphasee 400 V, puissance apparente 50 kVA. Courant en ligne ?", c: ["environ 70 A", "environ 125 A", "environ 50 A", "environ 12 A"], r: 0, d: 'M',
      explanation: "En triphase, le courant en ligne se calcule par : I = puissance apparente / (racine de 3 × tension composee) = 50 000 / (1,73 × 400) = 50 000 / 692 ≈ 72 A. La racine de 3 vaut environ 1,73, c'est une constante a retenir." },
    { q: "Un atelier compte 10 moteurs identiques qui ne tournent presque jamais ensemble. Coefficient de simultaneite typique ?", c: ["1", "entre 0,5 et 0,7", "0", "2"], r: 1, d: 'M',
      explanation: "Plus on a de charges differentes, moins elles tournent ensemble : le coefficient de simultaneite baisse. Pour 10 moteurs d'atelier : typiquement 0,5 a 0,7. Une norme indicative existe pour les batiments." },
    { q: "Transformateur de plaque : 'puissance nominale = 400 kVA, primaire = 20 kV, secondaire = 410 V'. Rapport de transformation ?", c: ["environ 50", "environ 0,02", "egal a 410", "egal a 20 000"], r: 1, d: 'M',
      explanation: "Le rapport de transformation 'm' = tension secondaire / tension primaire = 410 / 20 000 = 0,0205. C'est un abaisseur (rapport tres inferieur a 1) qui divise la tension par environ 49. Ce nombre sert ensuite a calculer les courants : I primaire = m × I secondaire.", svg: SVG_TRANSFO_HTA },
  ],

  "2. Dimensionnement et protection basse tension": [
    { q: "Moteur triphase 11 kW alimente en 400 V, facteur de puissance 0,8, rendement 0,9. Courant nominal ?", c: ["environ 22 A", "environ 16 A", "environ 40 A", "environ 11 A"], r: 0, d: 'M',
      explanation: "Pour un moteur, on calcule le courant absorbe (a l'entree) en utilisant la puissance utile divisee par le rendement : I = P / (racine de 3 × U × cos φ × rendement) = 11000 / (1,73 × 400 × 0,8 × 0,9) ≈ 11000 / 498 ≈ 22 A. Le rendement est inclus car la puissance plaque est la puissance utile au bout d'arbre." },
    { q: "On a calcule un courant nominal de 22 A. Quel calibre de disjoncteur choisir dans la serie 10/16/20/25/32 A ?", c: ["20 A", "25 A", "32 A", "16 A"], r: 1, d: 'M',
      explanation: "On choisit le calibre normalise immediatement SUPERIEUR au courant calcule (jamais inferieur, sinon le disjoncteur declenche sans defaut reel ; jamais beaucoup superieur, sinon il ne protege plus). 22 A → on prend 25 A." },
    { q: "Pour porter 25 A sans surchauffer en pose normale a l'air, la section cuivre minimale (parmi 1,5/2,5/4/6 mm²) est...", c: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"], r: 2, d: 'M',
      explanation: "Chaque section de cable a un courant admissible (note Iz) qui depend du materiau, du mode de pose, de la temperature ambiante, etc. D'apres la norme NF C 15-100, 4 mm² cuivre supporte environ 27 A en pose air → c'est le minimum pour 25 A. 2,5 mm² ne supporte que ~21 A, c'est insuffisant." },
    { q: "Si la temperature ambiante autour des cables est elevee, le facteur de correction de courant admissible...", c: ["est superieur a 1 (augmente Iz)", "est inferieur a 1 (reduit Iz)", "n'a aucun effet", "vaut zero"], r: 1, d: 'F',
      explanation: "Quand il fait chaud, le cable se refroidit moins bien, donc il supporte MOINS de courant avant de surchauffer. Le facteur de correction est inferieur a 1 (par exemple 0,87 a 40 °C). On doit donc choisir une section plus grosse pour compenser." },
    { q: "Plusieurs cables sont poses cote a cote dans le meme conduit. Le facteur de groupement...", c: ["est superieur a 1", "est inferieur a 1", "vaut 1", "vaut toujours 0,5"], r: 1, d: 'F',
      explanation: "Plusieurs cables groupes ne peuvent pas dissiper leur chaleur aussi bien qu'un cable isole. Le facteur de groupement est donc inferieur a 1 (par exemple 0,8 pour 3 cables). Il faut prendre une section plus forte pour compenser." },
    { q: "Chute de tension maximale admise sur une installation alimentant un moteur en regime permanent (norme NF C 15-100) ?", c: ["3 %", "5 %", "8 %", "Aucune limite"], r: 2, d: 'M',
      explanation: "La norme NF C 15-100 impose 8 % maximum pour les moteurs en regime permanent (depuis le tableau divisionnaire). Pour l'eclairage c'est 6 %. Au-dela, les moteurs perdent du couple, les ampoules brillent moins, et on gaspille de l'energie en pertes Joule dans les cables." },
    { q: "Le pouvoir de coupure d'un disjoncteur doit etre...", c: ["egal au courant nominal", "superieur ou egal au courant de court-circuit presume au point d'installation", "inferieur au courant de court-circuit", "indifferent"], r: 1, d: 'F',
      explanation: "Le pouvoir de coupure (note Pdc) est la valeur MAXIMALE de courant que le disjoncteur peut interrompre sans exploser. Il doit donc etre superieur ou egal au courant de court-circuit que pourrait debiter le reseau a cet endroit (Icc). Sinon : risque d'arc, d'incendie, de destruction." },
    { q: "Courant de court-circuit presume = 6 kA. Pouvoir de coupure a choisir parmi 3 / 6 / 10 / 25 kA ?", c: ["3 kA", "6 kA", "10 kA", "25 kA"], r: 2, d: 'M',
      explanation: "Le pouvoir de coupure doit etre SUPERIEUR OU EGAL au courant de court-circuit presume, avec une marge. 6 kA serait juste a la limite. On prend 10 kA pour la securite (la marge couvre les imprecisions de calcul)." },
    { q: "Sur la gaine d'un cable, on lit '4G2,5'. Cela signifie...", c: ["4 conducteurs de 2,5 mm² dont 1 vert/jaune", "section totale de 4 mm²", "longueur 2,5 m", "4 prises"], r: 0, d: 'M',
      explanation: "Codification cable : le chiffre = nombre de conducteurs, la lettre G = avec conducteur de protection (vert/jaune), le dernier nombre = section en mm². Donc '4G2,5' = 4 fils de 2,5 mm², dont un vert/jaune (la terre). 'X' au lieu de 'G' = sans terre." },
    { q: "Sur un cable on lit 'U-1000 R2V'. La mention 'U-1000' designe...", c: ["la frequence", "la tension nominale d'isolation (1000 V)", "le diametre", "le calibre amperes"], r: 1, d: 'F',
      explanation: "U-1000 V est la tension nominale d'isolation : le cable resiste a 1000 V entre conducteur et terre. C'est la reference cable basse tension industrielle courante. R2V indique la nature de l'isolant (polyethylene reticule) et de la gaine." },
    { q: "Couleur normalisee du conducteur de protection (terre) ?", c: ["Rouge", "Bleu", "Vert et jaune", "Marron"], r: 2, d: 'F',
      explanation: "Code couleurs normalise : VERT/JAUNE (entrelaces, jamais l'un sans l'autre) = conducteur de protection (terre). BLEU = neutre. Les phases sont marron, noir, gris. Aucune autre couleur ne doit jamais etre verte/jaune, pour eviter la confusion fatale." },
    { q: "Court-circuit triphase a la sortie basse tension d'un transfo 400 kVA, tension de court-circuit 4 %, U = 400 V. Courant de court-circuit ?", c: ["environ 600 A", "environ 14 400 A", "environ 1 400 A", "environ 145 A"], r: 1, d: 'D',
      explanation: "Astuce mentale : courant nominal du transfo = 400 000 / (1,73 × 400) ≈ 577 A. La tension de court-circuit 4 % signifie que pour atteindre le courant nominal en court-circuit, il suffit de 4 % de la tension. Donc le courant de court-circuit est (1 / 0,04) = 25 fois plus grand : 25 × 577 ≈ 14 400 A. C'est enorme, d'ou l'importance du pouvoir de coupure." },
  ],

  "3. Regime de neutre et securite des personnes": [
    { q: "Regime de neutre TT : protection contre les contacts indirects assuree par...", c: ["Un disjoncteur magnetique seul", "Un dispositif differentiel (obligatoire)", "Un fusible haute pouvoir de coupure", "Aucun dispositif"], r: 1, d: 'F',
      explanation: "En regime de neutre TT (Terre-Terre : neutre du transfo a la terre, masses des appareils a la terre via une autre prise de terre), la boucle de defaut passe par le sol. Le courant de defaut est trop faible pour declencher un disjoncteur thermique → seul le dispositif differentiel (DDR) detecte le defaut de fuite et coupe. C'est OBLIGATOIRE." },
    { q: "Regime de neutre IT (neutre isole) : avantage principal ?", c: ["Cout faible", "Continuite de service au 1er defaut d'isolement", "Pas de neutre du tout", "Aucun avantage particulier"], r: 1, d: 'M',
      explanation: "En regime IT (Isole), le neutre est isole de la terre. Si une phase touche une masse, le courant de defaut est tres faible (pas de boucle franche) → la machine continue de fonctionner. Indispensable la ou la coupure est impossible : hopitaux (bloc operatoire), raffineries, marine. Un controleur permanent d'isolement (CPI) signale le defaut pour intervention." },
    { q: "Regime de neutre TN : la protection contre les contacts indirects est assuree par...", c: ["Le declenchement magnetique du disjoncteur sur defaut franc", "Le differentiel uniquement", "La mise a la terre seule", "Aucune protection"], r: 0, d: 'M',
      explanation: "En regime TN (Terre-Neutre), les masses sont reliees DIRECTEMENT au neutre. En cas de defaut, on a un veritable court-circuit phase-neutre, qui produit un fort courant capable de declencher le seuil magnetique du disjoncteur en moins de 0,4 s. Pas besoin de differentiel pour les masses (mais on en met quand meme pour les contacts directs).", svg: SVG_REGIME_TN },
    { q: "En regime TN, la 'longueur maximale de cable protege' (notee Lmax). Que se passe-t-il au-dela ?", c: ["La chute de tension explose", "Le declencheur magnetique ne fonctionne plus", "Le cable chauffe", "Rien"], r: 1, d: 'D',
      explanation: "Plus le cable est long, plus son impedance est grande, donc plus le courant de defaut est faible. Si on depasse la longueur maximale (Lmax), le courant de defaut tombe en dessous du seuil magnetique du disjoncteur → il ne declenche plus → DANGER pour les personnes. On calcule Lmax pour chaque circuit." },
    { q: "Tension limite de securite (notee UL) en local sec ?", c: ["12 V", "25 V", "50 V", "230 V"], r: 2, d: 'F',
      explanation: "La tension limite de securite est la tension a laquelle un contact prolonge ne tue pas. En local sec : 50 V alternatif. Si la tension de defaut atteint cette valeur, il FAUT que la protection coupe dans un temps fixe (0,4 s en general). En local humide ou exterieur, UL descend a 25 V." },
    { q: "Tension limite de securite en local humide ?", c: ["12 V", "25 V", "50 V", "230 V"], r: 1, d: 'M',
      explanation: "L'eau augmente la conductivite : meme une tension faible devient dangereuse. En local humide (salle de bain, exterieur, piscine), la tension limite descend a 25 V alternatif. Pour les locaux immerges ou pour les enfants : 12 V." },
    { q: "Un dispositif differentiel haute sensibilite 30 mA protege principalement contre...", c: ["Les surcharges", "Les contacts directs et indirects des personnes", "Les courts-circuits", "Les surtensions"], r: 1, d: 'F',
      explanation: "Le seuil 30 mA est specifique a la protection des PERSONNES : si un courant de fuite atteint 30 mA (a travers un corps humain par exemple), le dispositif coupe en moins de 30 ms. C'est en dessous du seuil de fibrillation cardiaque. Au-dessus (300 mA, 500 mA), c'est de la protection batiment / incendie." },
    { q: "Un appareil note 'IP44' offre une protection contre...", c: ["Solides > 1 mm + projections d'eau toutes directions", "Poussiere totale + immersion", "Chocs thermiques", "Surtensions reseau"], r: 0, d: 'M',
      explanation: "Le code IP a deux chiffres : 1er = solides (0 a 6), 2eme = liquides (0 a 9). IP44 : 4 = protege contre les objets > 1 mm (outil, fil de fer), 4 = protege contre les projections d'eau toutes directions. Tres courant dans les locaux humides." },
    { q: "L'indice 'IK' d'un appareil caracterise sa resistance...", c: ["A l'eau", "Aux chocs mecaniques", "Au feu", "Aux UV"], r: 1, d: 'F',
      explanation: "L'indice IK (chocs mecaniques) varie de IK00 (aucune protection) a IK10 (resiste a un choc de 20 joules, comparable a un marteau leger). Tres utile en exterieur, en ateliers, ou dans les ecoles pour la robustesse." },
    { q: "L'habilitation BR (basse tension) permet a une personne de...", c: ["Realiser des manœuvres simples", "Effectuer des interventions basse tension generales (depannage)", "Travailler en haute tension", "Faire des consignations haute tension"], r: 1, d: 'M',
      explanation: "Les habilitations en electricite suivent un code lettre : B = basse tension, H = haute tension. La lettre suivante donne le role : 0 = travail non electrique, R = intervention generale, C = consignation, T = travail sous tension. Donc BR = personne formee pour les depannages courants en basse tension." },
    { q: "Avant toute intervention electrique, on doit verifier l'absence de tension. L'abreviation 'VAT' signifie...", c: ["Verification d'Absence de Tension", "Voltmetre Analogique Tactique", "Ventilation Avant Travaux", "Verrouillage Avec Tournevis"], r: 0, d: 'M',
      explanation: "La verification d'absence de tension (VAT) est une etape OBLIGATOIRE de la procedure de consignation : apres avoir separe la source et verrouille le sectionneur, on doit toujours mesurer la tension residuelle avec un appareil teste avant ET apres. Si on saute cette etape, on peut etre electrise sur une 'fausse coupure'." },
    { q: "Un appareil 'classe II' : son isolation est...", c: ["Simple avec terre", "Double ou renforcee (pas de borne de terre)", "Absente", "A la terre obligatoirement"], r: 1, d: 'F',
      explanation: "Classe II = double isolation. Symbole : un carre dans un carre. Comme l'isolation est doublee, on ne risque pas qu'une partie metallique touche un fil sous tension → pas besoin de borne de terre. Exemples : seche-cheveux, electroportatif, perceuse avec carter plastique." },
  ],

  "4. Reseau triphase et couplage": [
    { q: "Reseau 400 V triphase. Tension simple (entre phase et neutre) ?", c: ["230 V", "400 V", "115 V", "692 V"], r: 0, d: 'F',
      explanation: "En triphase, on a deux tensions a distinguer. La tension COMPOSEE U (entre 2 phases) vaut 400 V. La tension SIMPLE V (entre une phase et le neutre) vaut U / racine de 3 = 400 / 1,73 ≈ 230 V. C'est cette tension simple qu'on utilise pour alimenter une prise domestique." },
    { q: "Plaque moteur '230 V / 400 V'. Sur un reseau 400 V triphase, on choisit le couplage...", c: ["Etoile (Y)", "Triangle (Δ)", "Indifferent", "Aucun"], r: 0, d: 'M',
      explanation: "Sur la plaque du moteur, la PLUS PETITE tension est celle qu'on applique en TRIANGLE, la PLUS GRANDE en ETOILE. Si le reseau fournit 400 V et que la plus grande tension de plaque est 400 V, on couple en ETOILE pour appliquer 400 V au moteur (400 V en compose). En etoile chaque enroulement voit seulement 230 V (la tension simple).", svg: SVG_PLAQUE_MAS },
    { q: "Plaque moteur '400 V / 690 V'. Sur un reseau 400 V triphase, on choisit le couplage...", c: ["Etoile", "Triangle", "Aucun couplage possible", "Impossible"], r: 1, d: 'M',
      explanation: "Sur la plaque, la plus petite tension (400 V) correspond au couplage TRIANGLE. Comme le reseau est aussi a 400 V, on couple en triangle : chaque enroulement voit alors 400 V (les enroulements sont en parallele en triangle, donc tension de phase = tension de ligne)." },
    { q: "En couplage etoile, le courant qui parcourt un enroulement (courant 'de phase') par rapport au courant en ligne ?", c: ["Egal", "Multiplie par racine de 3", "Divise par racine de 3", "Multiplie par 3"], r: 0, d: 'F',
      explanation: "En couplage etoile, les trois enroulements sont relies en 'Y' a un point commun (neutre). Chaque ligne est connectee a un seul enroulement, donc le courant qui circule dans la ligne EST le meme que celui dans l'enroulement. Courant ligne = courant phase.", svg: SVG_STAR },
    { q: "En couplage triangle, le courant en ligne par rapport au courant dans un enroulement ('de phase') ?", c: ["Egal", "Multiplie par racine de 3", "Divise par racine de 3", "Multiplie par 3"], r: 1, d: 'M',
      explanation: "En couplage triangle, chaque ligne se trouve a un sommet ou DEUX enroulements se rencontrent. Le courant de ligne est donc la somme vectorielle des deux courants d'enroulement decales de 120°, ce qui donne racine de 3 (≈ 1,73) fois le courant d'enroulement.", svg: SVG_TRIANGLE },
    { q: "Formule generale de la puissance active triphasee equilibree ?", c: ["P = U × I × cos φ", "P = racine de 3 × U × I × cos φ", "P = 3 × U × I", "P = U × I"], r: 1, d: 'F',
      explanation: "En triphase equilibre, on calcule la puissance active TOTALE par : P = racine de 3 × U × I × cos φ. ATTENTION : U est la tension COMPOSEE (entre phases) et I le courant en LIGNE. Cette formule est valable pour les deux couplages (etoile et triangle)." },
    { q: "Moteur triphase 400 V, courant en ligne 10 A, cos φ = 0,8. Puissance active absorbee ?", c: ["3,2 kW", "5,5 kW", "8 kW", "11 kW"], r: 1, d: 'M',
      explanation: "Calcul direct : P = 1,73 × 400 × 10 × 0,8. On fait : 1,73 × 400 = 692, puis 692 × 10 × 0,8 = 5536 W ≈ 5,5 kW. Astuce : racine de 3 × U × I donne la puissance APPARENTE (S), qu'on multiplie par cos φ pour l'ACTIVE." },
    { q: "Methode des deux wattmetres : on mesure la puissance triphasee totale par...", c: ["W1 + W2", "W1 - W2", "W1 × W2", "Racine de 3 × (W1 + W2)"], r: 0, d: 'M',
      explanation: "La methode des 2 wattmetres permet de mesurer la puissance active d'un systeme triphase, MEME desequilibre et MEME sans neutre. On insere 2 wattmetres correctement branches : P_totale = W1 + W2 (somme algebrique, donc parfois un est negatif). C'est une methode universelle." },
    { q: "Avec la methode des deux wattmetres, si W1 et W2 donnent exactement la meme valeur, on en deduit que le facteur de puissance vaut...", c: ["1 (charge purement resistive)", "0", "0,5", "Indetermine"], r: 0, d: 'M',
      explanation: "Egalite des deux wattmetres → la puissance reactive Q = racine de 3 × (W1 - W2) vaut 0. Donc cos φ = 1. La charge est purement resistive (pas de bobine ni condensateur)." },
    { q: "Charge triphasee couplee en etoile sur un reseau 400 V, avec R = 100 Ω par phase. Courant en ligne ?", c: ["2,3 A", "4 A", "10 A", "0,23 A"], r: 0, d: 'M',
      explanation: "En etoile, chaque resistance voit la tension SIMPLE V = 400 / racine de 3 ≈ 230 V. Le courant dans la resistance est donc I = V / R = 230 / 100 = 2,3 A. Et en etoile, courant ligne = courant phase, donc en ligne aussi 2,3 A." },
    { q: "Demarrage etoile-triangle : on demarre en etoile pour reduire le courant absorbe. Le courant initial est divise par...", c: ["Racine de 3 (1,73)", "3", "2", "9"], r: 1, d: 'M',
      explanation: "Au demarrage, le moteur est couple en ETOILE : chaque enroulement voit seulement V (tension simple) au lieu de U (tension composee), donc le courant est divise par racine de 3. Et comme en etoile courant ligne = courant phase, le courant en ligne est lui aussi divise par racine de 3. Au total, le rapport entre triangle (regime) et etoile (demarrage) est de 3." },
    { q: "Demarrage etoile-triangle : le couple de demarrage est divise par...", c: ["Racine de 3", "3", "2", "9"], r: 1, d: 'M',
      explanation: "Le couple dans une machine asynchrone est proportionnel au carre de la tension appliquee aux enroulements. En etoile, chaque enroulement voit V = U / racine de 3. Donc le couple est multiplie par (1 / racine de 3)² = 1/3. C'est pour ça que ce demarrage ne convient pas aux charges qui demarrent en pleine charge." },
  ],

  "5. Moteur asynchrone triphase": [
    { q: "Vitesse de synchronisme d'un moteur asynchrone a 4 poles (2 paires de poles) alimente en 50 Hz ?", c: ["3000 tr/min", "1500 tr/min", "750 tr/min", "1000 tr/min"], r: 1, d: 'F',
      explanation: "La vitesse de synchronisme est la vitesse de rotation du CHAMP TOURNANT cree par les courants triphases. Formule : ns = 60 × frequence / nombre de paires de poles = 60 × 50 / 2 = 1500 tours par minute. Le moteur tourne legerement en dessous (a cause du glissement)." },
    { q: "Vitesse de synchronisme d'un moteur 6 poles (3 paires) a 50 Hz ?", c: ["1500 tr/min", "3000 tr/min", "1000 tr/min", "750 tr/min"], r: 2, d: 'F',
      explanation: "Avec 3 paires de poles : ns = 60 × 50 / 3 = 1000 tr/min. Plus on met de paires de poles, plus le moteur tourne lentement (pour la meme frequence). Les vitesses standards en 50 Hz sont 3000, 1500, 1000, 750 tr/min (selon 1, 2, 3, 4 paires de poles)." },
    { q: "Une plaque moteur indique '1440 tr/min'. Combien de paires de poles a-t-il (alimente en 50 Hz) ?", c: ["1", "2", "3", "4"], r: 1, d: 'M',
      explanation: "1440 tr/min est tres proche de 1500 tr/min, qui correspond a 2 paires de poles (synchronisme 1500). Le moteur ne tourne pas exactement a 1500 a cause du glissement (ici environ 4 %). C'est le moteur le plus commun en industrie." },
    { q: "Synchronisme 1500 tr/min, vitesse reelle 1485 tr/min. Glissement ?", c: ["1 %", "2 %", "5 %", "10 %"], r: 0, d: 'M',
      explanation: "Le glissement (note g) mesure l'ecart entre vitesse de synchronisme et vitesse reelle : g = (ns - n) / ns = (1500 - 1485) / 1500 = 15 / 1500 = 0,01 = 1 %. Un faible glissement signifie que le moteur est leger et tourne presque a sa vitesse maximale." },
    { q: "Synchronisme 1000 tr/min, vitesse reelle 950 tr/min. Glissement ?", c: ["5 %", "10 %", "2 %", "50 %"], r: 0, d: 'M',
      explanation: "g = (1000 - 950) / 1000 = 50 / 1000 = 0,05 = 5 %. C'est un glissement plus important, typique d'un moteur en charge nominale." },
    { q: "Au tout demarrage d'un moteur asynchrone (rotor a l'arret), le glissement vaut ?", c: ["0", "0,5", "1", "Negatif"], r: 2, d: 'F',
      explanation: "A l'arret, la vitesse reelle vaut 0, donc g = (ns - 0) / ns = 1 (soit 100 %). Le glissement est maximal. Au fur et a mesure que le moteur accelere, g diminue jusqu'au point de fonctionnement (3 a 5 % typiquement)." },
    { q: "Courant de demarrage direct d'un moteur asynchrone : il vaut typiquement...", c: ["1 fois le courant nominal", "2 fois", "5 a 8 fois le courant nominal", "0,5 fois"], r: 2, d: 'M',
      explanation: "Au demarrage, le rotor ne tourne pas, donc le champ tournant 'voit' une bobine immobile : c'est comme un transformateur en court-circuit cote secondaire. Le courant absorbe au reseau est donc 5 a 8 fois le courant nominal (jusqu'a 1 ou 2 secondes). C'est pourquoi on prevoit un demarreur progressif au-dela d'une certaine puissance." },
    { q: "Pour inverser le sens de rotation d'un moteur asynchrone triphase, on...", c: ["Coupe une phase", "Permute 2 phases d'alimentation", "Augmente la frequence", "Inverse le neutre"], r: 1, d: 'F',
      explanation: "Le champ tournant tourne dans un sens donne par l'ORDRE des phases. Si on permute (echange) 2 phases d'alimentation, on inverse l'ordre, donc on inverse le sens du champ et donc du moteur. Sur une boite electromecanique : 2 contacteurs avec phases croisees pour 'avant/arriere'." },
    { q: "Pour faire varier la vitesse d'un moteur asynchrone en gardant un bon couple, on utilise...", c: ["Un rheostat dans le rotor", "Un variateur de frequence (loi tension/frequence constante)", "Un autotransformateur seul", "Un transformateur abaisseur"], r: 1, d: 'M',
      explanation: "Pour varier la vitesse d'un moteur asynchrone, il faut varier la frequence (car ns = 60·f/p). Le VARIATEUR de frequence (aussi appele convertisseur de frequence ou onduleur) cree une frequence variable. On maintient le rapport U/f constant pour garder le couple max : c'est la 'loi U/f constante'." },
    { q: "Loi tension/frequence constante (U/f = cste) : pourquoi ?", c: ["Pour reduire la consommation", "Pour conserver le flux et donc le couple maximal", "Pour augmenter la vitesse max", "Aucune raison"], r: 1, d: 'M',
      explanation: "Dans un moteur, le flux magnetique Φ est proportionnel a U/f. Si on garde U/f constant en variant les deux, le flux reste a sa valeur nominale, donc le couple maximal aussi. Si on ne respecte pas cette loi, soit on sature le fer (U/f trop grand), soit on perd du couple (U/f trop petit)." },
    { q: "Pertes Joule au rotor : si la puissance transmise au rotor vaut 5 kW et le glissement 4 %, les pertes au rotor valent...", c: ["200 W", "20 W", "500 W", "2 kW"], r: 0, d: 'M',
      explanation: "Une relation simple existe : pertes Joule au rotor = glissement × puissance transmise au rotor. Pjr = 0,04 × 5000 = 200 W. Le reste (4800 W) est converti en puissance mecanique. Plus le glissement est faible, mieux on transfere l'energie au mecanique." },
    { q: "Le demarrage etoile-triangle n'est possible que si la plaque moteur indique...", c: ["230/400 V", "400/690 V (couplage triangle possible sur reseau 400 V)", "230 V seule tension", "400 V seule tension"], r: 1, d: 'M',
      explanation: "Pour faire un demarrage etoile-triangle, il faut que le moteur PUISSE fonctionner en triangle sur le reseau. Si la plaque dit '400/690 V', le triangle correspond a 400 V, donc compatible avec un reseau 400 V (regime nominal en triangle). Sur une plaque '230/400 V', le triangle correspond a 230 V → pas compatible avec un reseau 400 V (le moteur cramerait)." },
  ],

  "6. Alternateur, moteur a courant continu et transformateur": [
    { q: "Pour un alternateur (machine synchrone), la frequence delivree est imposee par...", c: ["La charge", "La vitesse de rotation et le nombre de paires de poles", "La tension d'excitation", "Le couple resistant"], r: 1, d: 'F',
      explanation: "Pour un alternateur (machine synchrone), la frequence et la vitesse sont LIEES : f = n × p / 60 (avec p = nombre de paires de poles). Une fois la machine fabriquee (p fixe), seule la vitesse impose la frequence. C'est l'inverse du moteur asynchrone qui glisse." },
    { q: "Un alternateur tournant a 3000 tr/min avec 2 poles (1 paire). Frequence delivree ?", c: ["25 Hz", "50 Hz", "60 Hz", "100 Hz"], r: 1, d: 'M',
      explanation: "Avec 1 paire de poles : f = n × p / 60 = 3000 × 1 / 60 = 50 Hz. C'est la frequence standard du reseau europeen. Aux Etats-Unis on a 60 Hz, ce qui necessite des alternateurs tournant a 3600 tr/min." },
    { q: "Pour regler la tension a vide d'un alternateur, on agit sur...", c: ["La vitesse de rotation", "Le courant d'excitation de l'inducteur", "La charge", "La frequence du reseau"], r: 1, d: 'F',
      explanation: "Dans un alternateur, l'inducteur (rotor) cree un champ magnetique grace a un courant continu (courant d'excitation). Plus ce courant est grand, plus le flux est grand, donc plus la tension induite est grande. C'est le seul reglage de tension : on augmente ou diminue le courant d'excitation." },
    { q: "Pour coupler un alternateur en parallele sur le reseau, combien de conditions doivent etre respectees simultanement ?", c: ["1", "2", "4 (meme tension, meme frequence, meme phase, meme ordre)", "10"], r: 2, d: 'M',
      explanation: "La synchronisation au reseau impose QUATRE conditions : (1) meme valeur efficace de tension, (2) meme frequence, (3) meme phase (alternances synchronisees), (4) meme ordre des phases (rotation dans le meme sens). Si une condition n'est pas respectee, un courant enorme circule, pouvant detruire la machine." },
    { q: "Sur un moteur a courant continu, on n'inverse QUE le sens du courant d'induit. Le sens de rotation...", c: ["Reste identique", "S'inverse", "S'arrete", "S'accelere"], r: 1, d: 'M',
      explanation: "Le couple dans un moteur a courant continu est proportionnel a Φ × I (flux × courant). Si on inverse SEULEMENT I (en gardant Φ), le couple s'inverse → moteur tourne dans l'autre sens. Si on inverse les DEUX (I ET Φ), le couple reste positif (- × - = +) et le moteur tourne dans le meme sens. Donc UNE inversion suffit." },
    { q: "Sur un moteur a courant continu, si on diminue le flux Φ (on 'defluxe'), la vitesse...", c: ["Diminue", "Reste constante", "Augmente", "S'annule"], r: 2, d: 'M',
      explanation: "Pour un moteur a courant continu, la vitesse Ω ≈ U / (k × Φ). Si on diminue Φ a tension U constante, la vitesse Ω AUGMENTE. C'est le 'defluxage' : on l'utilise au-dela de la vitesse nominale, quand on a deja atteint la tension maximale (on ne peut plus augmenter U)." },
    { q: "Transformateur abaisseur 20 kV → 400 V. Rapport de transformation 'm' = N2/N1 ?", c: ["50", "1/50", "0,8", "20"], r: 1, d: 'M',
      explanation: "Le rapport 'm' = U2/U1 = N2/N1 (rapport des spires) = 400 / 20 000 = 0,02 = 1/50. C'est tres petit car c'est un fort abaisseur. Une regle a retenir : m petit = abaisseur, m grand = elevateur, m = 1 = isolement.", svg: SVG_TRANSFO_HTA },
    { q: "Transformateur ideal : si la tension secondaire vaut 1/10 de la primaire, le courant secondaire par rapport au primaire ?", c: ["10 fois plus grand", "10 fois plus petit", "Identique", "Au carre"], r: 0, d: 'F',
      explanation: "Dans un transformateur IDEAL, il n'y a pas de pertes : puissance entrante = puissance sortante. Donc U1 × I1 = U2 × I2. Si U2 = U1 / 10, alors I2 = I1 × 10. Ce qu'on gagne en tension, on le perd en courant et inversement." },
    { q: "L'essai a vide d'un transformateur mesure essentiellement les pertes...", c: ["Cuivre", "Fer (noyau magnetique)", "Totales", "Mecaniques"], r: 1, d: 'F',
      explanation: "Essai a vide : on alimente le primaire et on laisse le secondaire ouvert (pas de charge). Donc le courant au primaire est tres faible → les pertes Joule (cuivre) sont negligeables. Tout ce qu'on mesure correspond aux pertes dans le noyau magnetique (hysteresis + courants de Foucault) : on appelle ça les 'pertes fer'." },
    { q: "L'essai en court-circuit a tension reduite mesure les pertes...", c: ["Cuivre (Joule dans les enroulements)", "Fer", "Mecaniques", "Dielectriques"], r: 0, d: 'F',
      explanation: "Essai en court-circuit : on court-circuite le secondaire et on regle la tension primaire pour avoir le courant NOMINAL. Comme la tension primaire est tres faible, le flux est faible, donc les pertes fer sont negligeables. Ce qu'on mesure correspond aux pertes Joule dans les enroulements (pertes 'cuivre')." },
    { q: "Les pertes fer d'un transformateur dependent surtout de...", c: ["La charge", "La tension et la frequence (donc du flux)", "La temperature", "Le rendement"], r: 1, d: 'M',
      explanation: "Les pertes fer (hysteresis + courants de Foucault) dependent du flux magnetique, donc de U et de f, mais PAS de la charge. C'est pour ça qu'elles sont aussi appelees 'pertes constantes'. Tant que le transfo est sous tension, elles existent meme a vide." },
    { q: "Un transformateur atteint son rendement MAXIMAL quand...", c: ["Charge nominale exactement", "Pertes fer egales aux pertes cuivre", "A vide", "En court-circuit"], r: 1, d: 'M',
      explanation: "Le rendement passe par un MAXIMUM quand les pertes constantes (pertes fer) sont egales aux pertes variables (pertes cuivre, proportionnelles a I²). En general, ce maximum se situe vers 70-80 % de la charge nominale. C'est pourquoi on dimensionne les transfos pour qu'ils tournent dans cette zone." },
  ],

  "7. Compensation d'energie reactive et harmoniques": [
    { q: "Pour compenser une charge inductive (qui consomme du reactif), on ajoute en parallele...", c: ["Une bobine", "Un condensateur", "Une resistance", "Un transformateur"], r: 1, d: 'F',
      explanation: "Les charges inductives (moteurs, transfos, ballasts) consomment de la puissance reactive. Pour la compenser, on installe des condensateurs : ils FOURNISSENT de la reactive (signe oppose) qui annule celle des inductances. Resultat : le reseau ne fournit plus que du reactif minimal, le cos φ remonte vers 1." },
    { q: "Pour compenser une charge de 100 kW de cos φ = 0,8 jusqu'a cos φ = 1, il faut une puissance reactive de...", c: ["50 kvar", "75 kvar", "100 kvar", "125 kvar"], r: 1, d: 'M',
      explanation: "On calcule la 'tangente' de l'angle φ avant et apres. Avant : tan φ = sin/cos = 0,6/0,8 = 0,75. Apres : tan φ = 0. Puissance reactive a fournir : Qc = P × (tan φ1 - tan φ2) = 100 × (0,75 - 0) = 75 kvar. C'est la valeur des condensateurs a installer." },
    { q: "Au-dessus de quelle valeur de tan φ Enedis facture-t-il l'energie reactive ?", c: ["0,1", "0,4", "1", "0,5"], r: 1, d: 'F',
      explanation: "Enedis (gestionnaire reseau francais) facture la reactive consommee lorsque tan φ > 0,4 en heures pleines hiver (cos φ < 0,93). C'est pour inciter les industriels a compenser leurs installations : sinon ils paient une penalite proportionnelle." },
    { q: "Une installation a tan φ = 0. Son cos φ vaut alors...", c: ["0", "0,5", "1", "0,87"], r: 2, d: 'F',
      explanation: "Si tan φ = 0, alors φ = 0°, donc cos φ = 1 et sin φ = 0. Cela signifie que la puissance reactive Q est nulle : c'est le cas ideal d'une charge purement resistive (ou parfaitement compensee)." },
    { q: "Compensation automatique : on la choisit a la place de compensation fixe quand...", c: ["La charge est constante", "La charge varie beaucoup", "Le local est petit", "Aucun cas"], r: 1, d: 'M',
      explanation: "Compensation FIXE = condensateurs allumes en permanence : OK si la charge inductive est constante (atelier avec un seul moteur). Compensation AUTOMATIQUE = batterie de condensateurs en gradins commutes selon le besoin reactif : indispensable si la charge varie (sinon on surcompense, ce qui fait monter la tension)." },
    { q: "Le 'taux de distorsion harmonique en courant' (note THD-i ou THD en courant) : valeur acceptable typique ?", c: ["50 %", "Inferieur a 10 %", "100 %", "0 % exactement"], r: 1, d: 'M',
      explanation: "Le THD en courant mesure a quel point le courant s'eloigne d'une belle sinusoide pure (du a des harmoniques generes par les variateurs, alimentations decoupees, etc.). En general, THD < 10 % est acceptable. Au-dela : reseau pollue, risque de surchauffe du neutre, dysfonctionnement des appareils sensibles." },
    { q: "En presence d'harmoniques (rangs 5, 7), les condensateurs de compensation classiques peuvent...", c: ["Eclater (resonance avec l'inductance du reseau)", "Mieux compenser", "Couper le reseau", "Rien"], r: 0, d: 'D',
      explanation: "L'inductance du reseau et la capacite des condensateurs forment un circuit oscillant. A une certaine frequence (resonance), l'impedance s'effondre et les courants harmoniques explosent. Si la frequence de resonance coincide avec un harmonique present (rang 5 = 250 Hz), les condensateurs peuvent litteralement EXPLOSER. Solution : selfs anti-harmoniques en serie." },
    { q: "Filtre actif d'harmoniques : son principe...", c: ["Compenser le facteur de puissance seulement", "Injecter un courant en opposition de phase aux harmoniques", "Mesurer la frequence", "Rectifier le courant"], r: 1, d: 'M',
      explanation: "Un filtre actif est un onduleur intelligent qui analyse en permanence le courant de la charge, identifie les harmoniques presents, et injecte un courant en opposition exacte de phase pour les annuler. Resultat : le reseau ne voit qu'un beau courant sinusoidal. C'est efficace mais cher (a partir de 10 000 euros)." },
    { q: "Une self anti-harmonique : on en place en serie avec les condensateurs pour...", c: ["Augmenter la puissance reactive", "Decaler la frequence de resonance loin des harmoniques presents", "Reduire le courant", "Mesurer le taux d'harmoniques"], r: 1, d: 'D',
      explanation: "L'inductance en serie deplace la frequence de resonance LC en dessous des harmoniques presents (typiquement rangs 5 et 7). Les frequences d'accord courantes sont 134 Hz (rang 2,7) ou 189 Hz (rang 3,8). Resultat : les condensateurs ne resonnent plus avec les harmoniques → securite et duree de vie." },
    { q: "Installation : P = 100 kW, S = 125 kVA. Cos φ ?", c: ["0,5", "0,8", "1", "1,25"], r: 1, d: 'F',
      explanation: "Le cos φ = puissance active / puissance apparente = P/S = 100/125 = 0,8. Astuce : on peut aussi voir que P/S est toujours compris entre 0 et 1 (cos d'un angle).", svg: SVG_TRIANGLE_POWER },
    { q: "Installation : P = 60 kW, Q = 80 kvar. Puissance apparente S ?", c: ["100 kVA", "140 kVA", "20 kVA", "120 kVA"], r: 0, d: 'M',
      explanation: "Triangle des puissances de Pythagore : S = racine de (P² + Q²) = racine de (60² + 80²) = racine de (3600 + 6400) = racine de 10 000 = 100 kVA. Astuce de calcul mental : 60-80-100 est un triplet pythagoricien (3-4-5 × 20)." },
  ],

  "8. Variation de vitesse et electronique de puissance": [
    { q: "Variateur de vitesse pour moteur asynchrone : quelle est la structure typique ?", c: ["Redresseur + bus continu + onduleur a decoupage", "Transformateur seul", "Gradateur seul", "Hacheur seul"], r: 0, d: 'F',
      explanation: "Un variateur de vitesse pour moteur a une structure en 3 etages : 1) un REDRESSEUR (diodes) qui transforme l'alternatif du reseau en continu, 2) un BUS CONTINU (condensateurs) qui stocke l'energie, 3) un ONDULEUR a decoupage qui recree une tension alternative variable en frequence et amplitude pour alimenter le moteur." },
    { q: "Modulation de largeur d'impulsion (MLI, ou PWM en anglais) : on agit sur...", c: ["La frequence porteuse seule", "Le rapport cyclique pour ajuster la valeur moyenne", "La temperature", "Aucun parametre"], r: 1, d: 'M',
      explanation: "La modulation de largeur d'impulsion (souvent appelee MLI ou PWM) consiste a generer des creneaux de duree variable. En faisant varier la duree de conduction, on contrôle la valeur MOYENNE de la tension. C'est ainsi qu'on cree une tension 'quasi-sinusoidale' a partir d'un bus continu." },
    { q: "Frequence de decoupage typique d'un variateur industriel moderne ?", c: ["50 Hz", "1 a 20 kHz", "1 MHz", "1 Hz"], r: 1, d: 'F',
      explanation: "Les variateurs decoupent leur tension a haute frequence : entre 2 et 16 kHz selon les modeles. Plus la frequence est haute, plus la forme d'onde est lisse mais plus il y a de pertes par commutation. Un compromis vers 4-8 kHz est courant en industrie." },
    { q: "Composant principal d'un onduleur de variateur moderne ?", c: ["Thyristor", "Transistor IGBT", "Triac", "Diode tunnel"], r: 1, d: 'F',
      explanation: "Le transistor IGBT (Insulated Gate Bipolar Transistor) est le composant roi des onduleurs modernes : il commute rapidement (microseconde), supporte des tensions de 1200 a 1700 V, et des courants jusqu'a plusieurs centaines d'amperes. Il a detrone le thyristor GTO pour les applications < 1 MW." },
    { q: "Hacheur serie : tension de sortie = rapport cyclique × tension d'entree. Si rapport cyclique = 0,5 et entree = 100 V, sortie ?", c: ["50 V", "100 V", "200 V", "25 V"], r: 0, d: 'F',
      explanation: "Un hacheur est un interrupteur ferme un fraction α (le rapport cyclique) du temps. La tension moyenne de sortie est donc U_sortie = α × U_entree = 0,5 × 100 = 50 V. C'est utilise dans les trains, les variateurs continu, les chargeurs.", svg: SVG_HACHEUR },
    { q: "Pont redresseur monophase a 4 diodes (pont de Graetz) : la tension moyenne en sortie vaut...", c: ["Umax / π", "2·Umax / π", "Umax / 2", "Umax exactement"], r: 1, d: 'M',
      explanation: "Le pont a 4 diodes redresse les DEUX alternances de la sinusoide (la negative est 'retournee'). La tension moyenne est U_moy = 2 × U_max / π ≈ 0,9 × U_efficace. Astuce : on multiplie la tension efficace par 0,9 pour avoir la moyenne redressee.", svg: SVG_PD2 },
    { q: "Pont redresseur monophase alimente sous 230 V efficace. Tension moyenne en sortie ?", c: ["environ 207 V", "230 V", "325 V", "100 V"], r: 0, d: 'M',
      explanation: "Tension moyenne ≈ 0,9 × 230 ≈ 207 V. Si on filtre avec un gros condensateur, on tend vers la tension crete (325 V). Sans filtrage, c'est bien 207 V de moyenne avec une forte ondulation a 100 Hz." },
    { q: "Pont redresseur triphase (6 diodes) alimente sous 400 V efficace compose. Tension moyenne ?", c: ["environ 540 V", "230 V", "400 V", "692 V"], r: 0, d: 'M',
      explanation: "Pour un pont triphase a 6 diodes : U_moy ≈ 1,35 × U_efficace_composee = 1,35 × 400 ≈ 540 V. Bien plus eleve qu'un pont monophase, et avec une ondulation beaucoup plus faible (6 morceaux de sinusoide par periode au lieu de 2)." },
    { q: "Ondulation d'un pont redresseur triphase a 6 diodes alimente en 50 Hz ?", c: ["50 Hz", "100 Hz", "300 Hz", "150 Hz"], r: 2, d: 'M',
      explanation: "Le pont triphase decoupe 6 morceaux de sinusoide par periode du reseau. Donc la frequence d'ondulation = 6 × 50 Hz = 300 Hz. C'est tres rapide, ce qui rend le filtrage beaucoup plus facile qu'avec un pont monophase (100 Hz)." },
    { q: "Onduleur de secours, encore appele alimentation sans interruption : il convertit...", c: ["AC en DC", "DC (batterie) en AC", "AC en AC", "Rien"], r: 1, d: 'F',
      explanation: "Un onduleur transforme une tension continue (batterie) en une tension alternative similaire au reseau. C'est le coeur des alimentations sans interruption (souvent appelees ASI ou UPS en anglais), qui maintiennent les serveurs et les appareils critiques en service pendant les coupures." },
    { q: "Alimentation sans interruption 'double conversion' : la charge est alimentee par...", c: ["Le reseau direct", "Toujours l'onduleur (jamais par le reseau direct)", "Le by-pass uniquement", "Aucun"], r: 1, d: 'M',
      explanation: "En topologie 'double conversion' (la plus haut de gamme) : reseau → redresseur → bus continu (charge la batterie) → onduleur → charge. L'onduleur fournit en PERMANENCE la charge, ce qui filtre parfaitement les perturbations du reseau. Au moindre soucis reseau, la batterie prend le relais sans aucune commutation perceptible." },
    { q: "Gradateur (a thyristors ou triac) : il commande...", c: ["La tension continue", "La tension efficace alternative (par angle d'amorçage)", "La frequence", "Le couple direct"], r: 1, d: 'M',
      explanation: "Un gradateur utilise deux thyristors tete-beche (ou un triac) qui s'amorcent avec un retard variable apres le passage a zero de la sinusoide. En jouant sur ce retard (l'angle d'amorçage), on coupe une partie de chaque alternance → on reduit la tension efficace appliquee. Utilise pour eclairage, chauffage, demarreurs de moteurs." },
  ],

  "9. Automatisme et communication industrielle": [
    { q: "Un automate programmable industriel (souvent appele API ou PLC) est...", c: ["Un calculateur specialise pour piloter des machines en temps reel", "Une adresse physique d'interface", "Un protocole de mesure", "Un acronyme bureautique"], r: 0, d: 'F',
      explanation: "Un automate programmable industriel est un calculateur durci (robuste) specialise pour piloter des machines : il lit des capteurs en entree, calcule selon un programme, et active des sorties (contacteurs, vannes, vérins). On l'appelle souvent API en français ou PLC en anglais." },
    { q: "Signal analogique standard pour transmettre une mesure sur de longues distances ?", c: ["0-5 V uniquement", "4-20 mA (boucle de courant)", "230 V alternatif", "0-1 V"], r: 1, d: 'F',
      explanation: "Le 4-20 mA est LE standard industriel : on transmet la mesure sous forme d'un courant (et non une tension). Avantage : le courant ne 'tombe' pas avec la longueur de cable (contrairement a la tension qui chute). On peut faire 1 km sans probleme." },
    { q: "Avantage du signal 4-20 mA par rapport au 0-10 V ?", c: ["Moins cher", "Detection de cable coupe (0 mA = defaut clair)", "Plus precis", "Plus rapide"], r: 1, d: 'M',
      explanation: "L'astuce du 4-20 mA : si le cable est COUPE, on lit 0 mA, ce qui est HORS de la plage normale (4-20 mA). Donc l'automate sait immediatement qu'il y a un defaut materiel. Avec 0-10 V, un cable coupe donne 0 V, qu'on confond avec 'mesure minimale' → on ne sait pas si c'est normal ou un defaut." },
    { q: "Sur un automate Schneider, '%I0.0' designe...", c: ["Une entree TOR (tout ou rien)", "Une sortie TOR", "Une variable interne", "Un mot 16 bits"], r: 0, d: 'F',
      explanation: "Codification Schneider : %I = entree (Input), %Q = sortie (Output), %M = memoire interne, %MW = mot memoire 16 bits, %IW = entree analogique mot. Donc %I0.0 = premiere entree TOR du premier module d'entrees." },
    { q: "Sur un automate Schneider, '%QW2' designe...", c: ["Une sortie TOR", "Un mot de sortie 16 bits (typiquement une analogique)", "Une entree analogique", "Une variable booleenne"], r: 1, d: 'M',
      explanation: "%QW = sortie mot (W pour Word, 16 bits). Cela permet de sortir une valeur sur 0-65535 vers une carte analogique : par exemple consigne de variateur en 0-10 V ou en 4-20 mA. Le 2 est l'adresse du mot dans la memoire." },
    { q: "Boucle 4-20 mA mise a l'echelle 0-10 000 dans l'automate. Si le capteur envoie 12 mA, valeur affichee ?", c: ["0", "2 500", "5 000", "10 000"], r: 2, d: 'M',
      explanation: "On fait une regle de 3. 4 mA = 0 et 20 mA = 10 000. 12 mA est au milieu (12 - 4 = 8 sur les 16 de la plage utile, donc 8/16 = 50 %). Donc 50 % × 10 000 = 5 000. Cette mise a l'echelle est faite avec un bloc 'SCALE' dans l'automate." },
    { q: "Pour un automate neuf, on prevoit une reserve d'entrees/sorties de...", c: ["0 %", "20 a 30 %", "100 %", "Aucune"], r: 1, d: 'F',
      explanation: "Bonne pratique en electrotechnique : on dimensionne 20 a 30 % d'entrees/sorties de RESERVE pour pouvoir faire evoluer l'installation dans le futur sans changer l'automate. Par exemple : si on a besoin de 20 entrees, on prevoit un module 32 entrees." },
    { q: "Le protocole Modbus en version 'RTU' utilise...", c: ["Ethernet TCP/IP seulement", "Une liaison serie (RS-485) avec trames binaires", "Un cable USB", "Wi-Fi natif"], r: 1, d: 'F',
      explanation: "Modbus RTU est un protocole de communication tres ancien (1979) mais toujours largement utilise. Il transmet des trames binaires sur une liaison serie RS-485, jusqu'a 32 esclaves par bus et jusqu'a 1200 m. Il existe une variante Modbus TCP plus moderne qui passe sur Ethernet." },
    { q: "Adresse reseau notee '192.168.1.10 /28' : combien de bits pour la partie hote ?", c: ["28", "4", "8", "16"], r: 1, d: 'M',
      explanation: "Le '/28' indique le nombre de bits de masque reseau. Total = 32 bits IPv4. Si 28 bits sont 'reseau', alors 32 - 28 = 4 bits restent pour designer les hotes. Avec 4 bits, on a 16 adresses possibles, dont 14 utilisables (on retire l'adresse reseau et l'adresse de broadcast)." },
    { q: "Adresse 192.168.1.10 avec masque 255.255.255.0. Adresse de reseau ?", c: ["192.168.1.0", "192.168.0.0", "192.168.1.10", "255.255.255.0"], r: 0, d: 'M',
      explanation: "Le masque /24 = 255.255.255.0 dit que les 3 premiers octets representent le reseau. On garde donc 192.168.1 et on met le dernier octet a 0 → adresse reseau = 192.168.1.0. Les adresses utilisables sont 192.168.1.1 a 192.168.1.254 (puis 192.168.1.255 = broadcast)." },
    { q: "Une trame Modbus contient un mot 16 bits. Plage de valeurs possibles ?", c: ["0 a 100", "0 a 65 535", "0 a 256", "0 a 999"], r: 1, d: 'M',
      explanation: "16 bits = 2^16 = 65 536 valeurs possibles, soit la plage 0 a 65 535 (non signe). Si on veut representer des nombres negatifs, on utilise du 'signe' : -32 768 a +32 767. Pour les mesures decimales, on transmet par exemple x100 (valeur 12345 = 123,45 reel)." },
    { q: "Une variable booleenne (Tout Ou Rien, TOR) peut prendre combien de valeurs ?", c: ["1", "2 (0 ou 1)", "256", "65 536"], r: 1, d: 'F',
      explanation: "Une variable Tout Ou Rien (TOR) ne peut prendre que 2 etats : 0 (faux, ouvert, eteint) ou 1 (vrai, ferme, allume). C'est le type de signal le plus simple : un bouton, un contact de fin de course, un voyant. On parle aussi de 'booleen' (oui/non)." },
  ],

  "10. Hydraulique et efficacite energetique des pompes": [
    { q: "Pression hydrostatique au fond d'une colonne d'eau de 10 m (ρ = 1000 kg/m³, g ≈ 10 m/s²) ?", c: ["1 bar (100 kPa)", "10 bar", "100 mbar", "1 kPa"], r: 0, d: 'M',
      explanation: "La pression hydrostatique se calcule par p = ρ × g × h. Avec eau (ρ = 1000), g approche (10), h = 10 m : p = 1000 × 10 × 10 = 100 000 Pa = 100 kPa = 1 bar. Astuce a retenir : 10 m d'eau ≈ 1 bar.", svg: SVG_BERNOULLI },
    { q: "Puissance hydraulique : Ph = ρ·g·Q·H. Pour debit Q = 0,01 m³/s et hauteur H = 10 m, Ph ?", c: ["100 W", "1000 W", "10 W", "1 W"], r: 1, d: 'M',
      explanation: "Calcul : Ph = 1000 × 10 × 0,01 × 10 = 1000 W = 1 kW. Cette formule donne la puissance HYDRAULIQUE pure (transformee en energie cinetique + potentielle de l'eau). Pour avoir la puissance ELECTRIQUE absorbee par la pompe, il faut diviser par le rendement." },
    { q: "Une pompe a un rendement η = 0,7. Pour fournir Ph = 7 kW hydrauliques, puissance electrique a l'arbre ?", c: ["10 kW", "7 kW", "4,9 kW", "0,7 kW"], r: 0, d: 'M',
      explanation: "Le rendement = puissance utile / puissance absorbee. Donc Pa = Pu / η = 7 / 0,7 = 10 kW. Les 3 kW manquants sont perdus en pertes mecaniques et hydrauliques (frottements, fuites internes, turbulences)." },
    { q: "Lois des affinites : si on multiplie la vitesse de rotation d'une pompe par 2, le debit est multiplie par...", c: ["1", "2", "4", "8"], r: 1, d: 'M',
      explanation: "Premier principe des lois des affinites des pompes centrifuges : le DEBIT est proportionnel a la vitesse de rotation (Q ∝ N). Donc si on double N, on double Q. C'est la regle la plus simple." },
    { q: "Lois des affinites : si on multiplie la vitesse par 2, la pression (hauteur) est multipliee par...", c: ["1", "2", "4", "8"], r: 2, d: 'M',
      explanation: "Deuxieme loi : la HAUTEUR (ou pression) est proportionnelle au CARRE de la vitesse (H ∝ N²). Donc si on double N, on multiplie H par 4. C'est ce qui rend les pompes centrifuges sensibles a la vitesse." },
    { q: "Lois des affinites : si on multiplie la vitesse par 2, la puissance absorbee est multipliee par...", c: ["1", "2", "4", "8"], r: 3, d: 'D',
      explanation: "Troisieme loi (la plus IMPORTANTE) : la PUISSANCE absorbee est proportionnelle au CUBE de la vitesse (P ∝ N³). Si on double N, on multiplie P par 8. Inversement, si on REDUIT la vitesse de moitie, on consomme 8 fois MOINS d'energie ! C'est pourquoi un variateur de vitesse fait des economies enormes sur les pompes." },
    { q: "Debit dans une canalisation : Q = S × v. Section S = 0,01 m², vitesse v = 2 m/s. Debit ?", c: ["0,02 m³/s = 20 L/s", "200 L/s", "20 L/min", "0,2 L/s"], r: 0, d: 'M',
      explanation: "Equation de continuite : debit = section × vitesse de l'eau. Q = 0,01 × 2 = 0,02 m³/s. Conversion : 1 m³ = 1000 L, donc 0,02 m³/s = 20 L/s. Astuce : pour passer en L/h, multiplier par 3600 (= 72 000 L/h)." },
    { q: "Pour faire varier le debit d'une pompe centrifuge avec le MEILLEUR rendement energetique, on...", c: ["Etrangle une vanne en sortie", "Utilise un variateur de vitesse", "Demarre/arrete frequemment", "Ajoute un condensateur"], r: 1, d: 'M',
      explanation: "Etrangler une vanne dissipe de l'energie en frottement → la pompe consomme la meme chose mais delivre moins. Au contraire, le variateur baisse la vitesse → grace aux lois des affinites (P ∝ N³), on consomme cubiquement moins. Economies typiques : 30 a 60 % sur la facture electrique des pompes." },
    { q: "Retour sur investissement : economie de 2000 €/an pour un cout de 10 000 €. Temps de retour ?", c: ["2 ans", "5 ans", "10 ans", "20 ans"], r: 1, d: 'F',
      explanation: "Calcul simple : temps de retour = cout / economie annuelle = 10 000 / 2 000 = 5 ans. En general, un investissement industriel est interessant si le temps de retour est inferieur a 5-7 ans. Au-dela, on prefere placer l'argent autrement." },
    { q: "Tarif electrique : pourquoi reflechir aux heures pleines / heures creuses ?", c: ["Pour la couleur de la facture", "Decaler les consommations evitables vers les heures creuses (moins cher)", "Aucune raison", "Pour le confort"], r: 1, d: 'M',
      explanation: "Le reseau electrique est sature aux heures de pointe (matin et soir), donc le kWh y est plus cher. En decalant les consommations evitables (chauffe-eau, recharge vehicule electrique, lave-vaisselle) sur les heures creuses (la nuit), on reduit la facture sans changer la consommation totale." },
    { q: "Turbine Pelton : adaptee a quel type de site hydroelectrique ?", c: ["Faible chute, gros debit", "Tres haute chute, faible debit", "Toutes situations", "Marees uniquement"], r: 1, d: 'M',
      explanation: "Une turbine Pelton fonctionne par CHOC d'un jet d'eau a haute vitesse contre des augets. Elle convient aux sites de tres haute chute (centaines de metres) et faible debit (eau qui sort tres vite d'une buse). Pour faible chute / gros debit on utilise plutôt une turbine Kaplan (helice immergee). Entre les deux : turbine Francis." },
  ],

  "11. Magnetisme et electromagnetisme": [
    { q: "Unite du flux magnetique ?", c: ["Tesla", "Weber", "Henry", "Ampere"], r: 1, d: 'F',
      explanation: "Le flux magnetique (note Φ, prononce 'phi') se mesure en WEBER (symbole Wb). Definition : 1 Weber = 1 Volt × seconde = 1 Tesla × m². C'est la 'quantite' de champ magnetique qui traverse une surface." },
    { q: "Unite de l'induction (champ magnetique) B ?", c: ["Weber", "Tesla", "Henry", "Ohm"], r: 1, d: 'F',
      explanation: "L'induction magnetique B se mesure en TESLA (symbole T). C'est la densite de flux par unite de surface : 1 T = 1 Wb/m². A retenir : un aimant frigo fait quelques milliteslas, un IRM medical 1,5 a 3 teslas, et le champ terrestre seulement 50 microteslas." },
    { q: "Loi de Faraday : la force electromotrice induite dans une bobine vaut...", c: ["L × I", "moins la derivee du flux par rapport au temps", "B × vitesse", "R × I"], r: 1, d: 'F',
      explanation: "Loi de Faraday : la force electromotrice induite (= 'tension de l'effet generateur') vaut e = - dΦ/dt. Autrement dit : c'est la variation rapide du flux qui cree la tension. Pas de variation = pas de tension induite. Plus la variation est rapide, plus la tension est elevee. C'est le principe meme des alternateurs et transformateurs." },
    { q: "Une bobine de 100 spires voit son flux varier de 0,2 Wb en 2 secondes. Force electromotrice induite ?", c: ["10 V", "100 V", "20 V", "1 V"], r: 0, d: 'M',
      explanation: "Pour une bobine, la force electromotrice induite est multipliee par le nombre de spires : e = N × ΔΦ / Δt = 100 × 0,2 / 2 = 10 V. C'est le principe du transformateur : plus de spires = plus de tension induite par variation de flux." },
    { q: "Energie stockee dans une bobine de 1 H parcourue par 10 A ?", c: ["10 J", "50 J", "100 J", "5 J"], r: 1, d: 'M',
      formula: "W = ½ × L × I²",
      explanation: "Une bobine stocke de l'energie sous forme magnetique : W = (1/2) × L × I² = 0,5 × 1 × 10² = 0,5 × 100 = 50 joules. Cette energie devient libre si on coupe brutalement le courant, ce qui cree des surtensions (d'ou la diode de roue libre en parallele d'une bobine de relais)." },
    { q: "Energie stockee dans un condensateur de 100 µF charge a 100 V ?", c: ["0,5 J", "5 J", "1 J", "0,1 J"], r: 0, d: 'M',
      formula: "W = ½ × C × U²",
      explanation: "Un condensateur stocke de l'energie sous forme electrostatique : W = (1/2) × C × U² = 0,5 × 100·10⁻⁶ × 100² = 0,5 × 0,0001 × 10 000 = 0,5 joule. Cette energie peut etre re-extraite rapidement (flash photo, demarrage de pompes)." },
    { q: "Force de Laplace sur un conducteur : F = B × I × L. Avec B = 1 T, I = 5 A, L = 0,2 m, F ?", c: ["1 N", "5 N", "0,5 N", "10 N"], r: 0, d: 'F',
      explanation: "La force de Laplace (ou de Lorentz) s'exerce sur tout conducteur traverse par un courant et place dans un champ : F = B × I × L. Ici : 1 × 5 × 0,2 = 1 newton. C'est cette force qui fait tourner les moteurs : on a un fil dans un champ, on y fait passer un courant, ça pousse." },
    { q: "Materiau ferromagnetique courant pour faire les noyaux de transformateurs et moteurs ?", c: ["Cuivre", "Aluminium", "Fer-silicium en feuilletes", "Carbone"], r: 2, d: 'F',
      explanation: "Le materiau standard est le FER-SILICIUM (alliage Fe + 3 % Si), assemble en toles minces (0,3 a 0,5 mm) isolees entre elles par un vernis. Le silicium reduit les pertes par hysteresis, et le feuilletage reduit les pertes par courants de Foucault. Sans ça, les machines surchaufferaient." },
    { q: "Theoreme d'Ampere : la circulation du champ H autour d'un contour ferme egale...", c: ["B × surface", "La somme des amperes-tours embrasses par le contour", "L × I directement", "Le flux Φ"], r: 1, d: 'M',
      explanation: "Theoreme d'Ampere : la circulation du champ magnetique H le long d'un contour ferme egale la somme des 'amperes-tours' (N × I) qu'il englobe. Concretement, plus on a de spires et plus le courant est fort, plus le champ est intense. C'est la formule qui permet de dimensionner les bobinages." },
    { q: "Reluctance : on l'utilise comme analogie magnetique de quelle grandeur electrique ?", c: ["La capacite", "La resistance", "L'inductance", "La tension"], r: 1, d: 'M',
      explanation: "Loi d'Hopkinson : N × I = R × Φ, qui ressemble a U = R × I. La RELUCTANCE joue le role de la resistance en circuit magnetique. Forte reluctance = peu de flux pour la meme excitation. Air = forte reluctance, fer = faible reluctance (d'ou l'efficacite des noyaux fermes)." },
  ],

  "12. Lois fondamentales (revisions de base)": [
    { q: "Loi d'Ohm : R = 100 Ω, U = 20 V. Courant I ?", c: ["0,2 A", "2 A", "20 A", "200 A"], r: 0, d: 'F',
      explanation: "La loi d'Ohm dit que U = R × I. On isole I : I = U / R = 20 / 100 = 0,2 A. C'est la loi la plus utilisee en electricite : a connaitre absolument." },
    { q: "Deux resistances de 100 Ω placees en serie. Resistance equivalente ?", c: ["50 Ω", "100 Ω", "200 Ω", "10 000 Ω"], r: 2, d: 'F',
      explanation: "En SERIE, les resistances s'additionnent : Req = R1 + R2 = 100 + 100 = 200 Ω. Le courant est le meme dans les deux, les tensions s'additionnent. C'est comme deux obstacles l'un derriere l'autre : on freine deux fois." },
    { q: "Deux resistances de 100 Ω en parallele. Resistance equivalente ?", c: ["50 Ω", "100 Ω", "200 Ω", "0,02 Ω"], r: 0, d: 'F',
      explanation: "En PARALLELE, c'est l'inverse : pour deux R identiques, Req = R / 2 = 100 / 2 = 50 Ω. La tension est la meme aux bornes, les courants s'additionnent. C'est comme deux portes ouvertes : on passe deux fois plus facilement." },
    { q: "Trois resistances de 30 Ω toutes les trois en parallele. Resistance equivalente ?", c: ["10 Ω", "30 Ω", "90 Ω", "3 Ω"], r: 0, d: 'M',
      explanation: "Pour n resistances IDENTIQUES en parallele : Req = R / n. Ici 30 / 3 = 10 Ω. Si elles avaient ete differentes, il aurait fallu calculer 1/Req = 1/R1 + 1/R2 + 1/R3." },
    { q: "Pont diviseur : U = 10 V, R1 = R2 (egales). Tension U2 aux bornes de R2 ?", c: ["10 V", "5 V", "2,5 V", "0 V"], r: 1, d: 'F',
      explanation: "Formule du pont diviseur : U2 = U × R2 / (R1 + R2). Si R1 = R2, on a U2 = U × R / (2R) = U / 2 = 5 V. La tension se partage en deux egales entre deux R identiques. C'est intuitif.", svg: SVG_DIVIDER },
    { q: "Puissance dissipee par une resistance de 10 Ω parcourue par 3 A ?", c: ["30 W", "90 W", "9 W", "300 W"], r: 1, d: 'M',
      formula: "P = R × I²",
      explanation: "L'effet Joule : la puissance dissipee en chaleur par une resistance vaut R × I². Calcul : 10 × 3² = 10 × 9 = 90 W. ATTENTION au carre sur I : c'est pour ça qu'un courant un peu plus grand fait beaucoup plus chauffer." },
    { q: "Energie consommee par un appareil de 3 kW fonctionnant 4 heures ?", c: ["12 kWh", "1,2 kWh", "120 kWh", "12 kJ"], r: 0, d: 'F',
      explanation: "Energie = puissance × temps. W = 3 × 4 = 12 kWh (kilowatt-heures). C'est ce qu'on lit sur la facture EDF. Astuce : 1 kWh = 3,6 millions de joules." },
    { q: "Une batterie 12 V / 20 Ah. Energie stockee ?", c: ["240 Wh", "24 Wh", "2,4 kWh", "12 Wh"], r: 0, d: 'F',
      explanation: "Energie batterie = tension × capacite en Ah = 12 × 20 = 240 Wh (watt-heures). En kWh : 0,24 kWh, soit l'equivalent de la consommation d'une ampoule LED 8 W pendant 30 heures." },
    { q: "Loi des nœuds : 4 A entrent dans un nœud, 1 A sort par une branche. Courant dans l'autre branche ?", c: ["5 A", "3 A", "4 A", "1 A"], r: 1, d: 'F',
      explanation: "Loi des nœuds de Kirchhoff : la somme des courants entrants egale la somme des courants sortants (rien ne se cree, rien ne se perd). Si 4 A entrent et 1 A sort, alors 4 - 1 = 3 A sortent par l'autre branche." },
    { q: "Effet Joule : si on double le courant, les pertes Joule sont multipliees par...", c: ["2", "4", "8", "1"], r: 1, d: 'M',
      explanation: "Pertes Joule = R × I². Si I est multiplie par 2, alors I² est multiplie par 2² = 4. Donc les pertes Joule sont multipliees par 4. Consequence : il vaut MIEUX transporter sous haute tension (faible courant) pour reduire les pertes (d'ou les lignes haute tension)." },
    { q: "Rendement d'un convertisseur : 90 W utiles / 100 W absorbes ?", c: ["10 %", "90 %", "111 %", "Inconnu"], r: 1, d: 'F',
      explanation: "Rendement = puissance utile / puissance absorbee = 90 / 100 = 0,90 = 90 %. Les 10 % manquants (10 W) sont perdus en chaleur. Un rendement ne peut JAMAIS depasser 100 % (sinon on creerait de l'energie a partir de rien)." },
    { q: "Valeur efficace d'une tension sinusoidale dont la valeur crete-a-crete vaut 50 V ?", c: ["50 V", "25 V", "environ 17,7 V", "environ 8,8 V"], r: 2, d: 'M',
      explanation: "Crete-a-crete (50 V) = 2 × crete, donc crete = 25 V. Valeur efficace d'une sinusoide = valeur crete / racine de 2 = 25 / 1,414 ≈ 17,7 V. La valeur efficace est celle qui produit la meme chaleur qu'un courant continu de meme valeur.", svg: SVG_SINE },
  ],

  "13. Asservissement et regulation": [
    { q: "Un systeme en boucle OUVERTE utilise-t-il un retour de la sortie pour se corriger ?", c: ["Oui", "Non", "Parfois", "Toujours"], r: 1, d: 'F',
      explanation: "BOUCLE OUVERTE = aucun retour. On commande aveuglement (par exemple : on alimente un moteur sous une tension donnee, sans verifier qu'il tourne bien a la vitesse voulue). C'est simple mais on ne corrige pas les perturbations exterieures." },
    { q: "Action proportionnelle d'un correcteur : qu'arrive-t-il si on augmente le gain Kp ?", c: ["Le systeme devient plus stable et plus lent", "Plus rapide mais plus oscillant (risque d'instabilite)", "On annule l'erreur statique", "Aucun effet"], r: 1, d: 'M',
      explanation: "Augmenter le gain proportionnel rend le systeme plus REACTIF (correction plus forte sur les erreurs). Mais s'il est trop grand, le systeme corrige tellement qu'il depasse la consigne, puis corrige dans l'autre sens et oscille. Trop grand → instabilite. Reglage = compromis." },
    { q: "Action integrale dans un correcteur : a quoi sert-elle ?", c: ["A annuler l'erreur statique (residu permanent)", "Accelerer la reponse", "Reduire le depassement", "Filtrer le bruit"], r: 0, d: 'F',
      explanation: "L'INTEGRALE accumule l'erreur dans le temps. Tant qu'il reste une erreur, meme faible, l'integrale grandit jusqu'a ce que la sortie atteigne EXACTEMENT la consigne. Avantage : annule l'erreur statique. Inconvenient : ralentit le systeme et peut faire osciller." },
    { q: "Action derivee dans un correcteur : effet principal ?", c: ["Annuler l'erreur statique", "Ameliorer la stabilite en anticipant la variation", "Augmenter la puissance", "Filtrer le bruit"], r: 1, d: 'M',
      explanation: "La DERIVEE 'voit' la VITESSE de variation de l'erreur. Si l'erreur grandit vite, elle reagit fort tout de suite. C'est un effet d'anticipation qui freine les oscillations et ameliore la stabilite. Mais elle amplifie le bruit (variations rapides parasites), donc on doit la filtrer." },
    { q: "Un correcteur P-I-D : ses trois actions sont...", c: ["Proportionnelle, Integrale, Derivee", "Positive, Inverse, Doublee", "Permanente, Normalisee, Standardisee", "Plus, Moins, Zero"], r: 0, d: 'F',
      explanation: "Le correcteur PID est la somme des trois actions : P (Proportionnelle) reagit a l'erreur, I (Integrale) annule l'erreur statique, D (Derivee) anticipe et stabilise. Chacune a son rôle. La plupart des regulations industrielles utilisent un PID." },
    { q: "Constante de temps τ d'un systeme du 1er ordre : a t = 3τ, la sortie atteint environ...", c: ["50 %", "63 %", "95 %", "100 %"], r: 2, d: 'M',
      explanation: "Pour un systeme du 1er ordre repondant a un echelon : a t = 1τ on atteint 63 %, a 3τ on atteint 95 %, a 5τ on atteint 99 % de la valeur finale. Regle pratique pour le temps de reponse : on considere que c'est environ 3 a 5 τ." },
    { q: "Marge de phase typique souhaitee pour un asservissement stable ?", c: ["Environ 0°", "Environ 45° a 60°", "180°", "270°"], r: 1, d: 'M',
      explanation: "La marge de phase mesure 'combien on est loin de l'instabilite'. Une marge de 45 a 60° est un bon compromis : assez de robustesse pour ne pas osciller, sans trop ralentir le systeme. Une marge < 30° = systeme nerveux, > 70° = systeme mou." },
    { q: "Critere de Nyquist : on regarde si la fonction de transfert encercle quel point critique ?", c: ["(0, 0)", "(-1, 0)", "(1, 0)", "(0, 1)"], r: 1, d: 'D',
      explanation: "Le critere graphique de Nyquist consiste a tracer le lieu de la fonction de transfert en boucle ouverte dans le plan complexe et a regarder si elle encercle le point -1 (sur l'axe reel). Si oui dans le sens trigonometrique : le systeme boucle est instable. Sinon : stable." },
    { q: "Capteur de temperature industriel le plus courant ?", c: ["LED infrarouge", "Sonde PT100 (resistance de platine)", "Diode laser", "Condensateur ceramique"], r: 1, d: 'F',
      explanation: "La PT100 est une sonde tres standard en industrie : c'est une resistance de PLATINE qui vaut 100 Ω a 0 °C et qui varie d'environ 0,4 Ω par °C. Tres lineaire, tres precise (±0,1 °C), tres robuste. Elle est utilisee partout : industries chimiques, agroalimentaire, HVAC..." },
    { q: "Un servomoteur de regulation industrielle agit sur...", c: ["L'affichage operateur", "Un actionneur (vanne, registre, etc.)", "Le capteur", "L'alimentation electrique seule"], r: 1, d: 'M',
      explanation: "Le servomoteur convertit le signal de commande (souvent 4-20 mA) en mouvement mecanique : il positionne une vanne (proportion d'ouverture), un registre d'air, un volet... Il a une boucle interne qui asservit la position reelle a la consigne reçue. C'est le 'muscle' du systeme." },
  ],
};

module.exports = QUESTIONS;

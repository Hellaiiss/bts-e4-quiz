# Quiz E4 - BTS Electrotechnique (multijoueur local)

Jeu de revision pour l'epreuve **E4 - Conception et industrialisation d'un systeme electrotechnique**, decoupe en 13 parties qui balayent l'ensemble du programme. Toutes les questions sont des QCM resolvables **mentalement, sans calculatrice** (chiffres ronds et ratios usuels).

## Parties couvertes

1. Lois fondamentales (Ohm, Kirchhoff, ponts diviseurs)
2. Regime continu (puissance, energie)
3. Regime alternatif sinusoidal monophase
4. Systeme triphase
5. Magnetisme et electromagnetisme
6. Transformateurs monophases et triphases
7. Machine a courant continu (MCC)
8. Machine asynchrone (MAS) triphasee
9. Machine synchrone / alternateur
10. Electronique de puissance - redresseurs
11. Electronique de puissance - hacheurs et onduleurs
12. Mesures, securite, regimes de neutre
13. Asservissement et regulation

## Installation

Pre-requis : **Node.js >= 16** installe sur le poste animateur.

```bash
cd Projects/BTS-E4-Quiz
npm install
npm start
```

Le serveur affiche au demarrage les URLs a partager :
```
 Local       : http://localhost:3000
 Reseau LAN  : http://192.168.x.x:3000
```

## Comment jouer (multijoueur local)

1. **Un poste = l'animateur** (prof ou eleve qui pilote). Il ouvre la page
   `http://<ip-du-poste>:3000/host.html` puis clique sur "Devenir animateur".
2. **Les autres joueurs** (jusqu'a une vingtaine en pratique) se connectent
   depuis leur **telephone ou PC** sur la meme adresse `http://<ip-du-poste>:3000/`
   (ils doivent etre sur le meme reseau Wi-Fi / LAN).
3. Chacun entre son prenom et clique sur "Rejoindre".
4. L'animateur choisit **une categorie** (ou "Programme complet"), le **nombre de questions**, puis lance la partie.
5. Les questions s'affichent sur tous les ecrans. Chaque joueur clique sur sa reponse.
   **Bareme** : 500 pts par bonne reponse + bonus de rapidite (jusqu'a 500 pts).
6. Apres chaque question, la bonne reponse est revelee + scores mis a jour.
7. A la fin : classement final avec medailles.

## Astuces

- Pour trouver son IP locale Windows : `ipconfig` (chercher "Adresse IPv4").
- Si le pare-feu bloque, autoriser Node.js sur le reseau prive.
- Pour changer la duree par question, modifier `state.questionDuration` dans `server.js` (par defaut 15000 ms).
- Pour ajouter des questions, editer `questions.js`. Format : `{ q: "...", c: ["A","B","C","D"], r: index_bonne_reponse }`.

## Structure du projet

```
BTS-E4-Quiz/
├── package.json
├── server.js          # serveur Express + Socket.IO
├── questions.js       # banque de questions (13 categories)
├── README.md
└── public/
    ├── index.html     # page joueur
    ├── player.js
    ├── host.html      # page animateur
    ├── host.js
    └── style.css
```

Bonnes revisions !

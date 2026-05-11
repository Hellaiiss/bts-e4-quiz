# 🚀 Guide de deploiement - Quiz BTS E4 au CFA

Tu veux lancer le quiz **sur un PC sans Node.js installe** et **sans reseau prive** au CFA ? Voici 3 solutions classees du plus simple au plus avance.

---

## 🏆 OPTION A (RECOMMANDEE) — Hebergement en ligne gratuit

**Le formateur ouvre une URL** depuis n'importe quel PC, **les eleves scannent le QR depuis leurs telephones**. Aucune installation. Pas de probleme de reseau prive — tout passe par Internet.

### Avantages
- ✅ Zero installation cote formateur (juste un navigateur)
- ✅ Marche **sur le Wi-Fi du CFA, en 4G, partout**
- ✅ Les eleves peuvent meme jouer de chez eux
- ✅ Aucune autorisation IT a demander

### Procedure (15 minutes la 1ere fois)

**1.** Cree un compte gratuit sur [render.com](https://render.com) (avec une adresse email — aucune CB demandee).

**2.** Cree un compte gratuit sur [github.com](https://github.com) si tu n'en as pas.

**3.** Sur GitHub, cree un nouveau **repository public** (par exemple `bts-e4-quiz`).

**4.** Sur ton PC, ouvre PowerShell dans le dossier du projet et lance :
```powershell
cd C:\Users\Sulli\Documents\Claude\Projects\BTS-E4-Quiz
git init
git add .
git commit -m "Initial"
git branch -M main
git remote add origin https://github.com/TON_PSEUDO/bts-e4-quiz.git
git push -u origin main
```

**5.** Sur Render, clique **New → Web Service**, choisis ton repo GitHub `bts-e4-quiz`, valide. Render detecte automatiquement le fichier `render.yaml` que j'ai prepare. Le deploiement prend 2-3 minutes.

**6.** Render te donne une URL du type `https://bts-e4-quiz.onrender.com`. C'est ton URL **permanente**, accessible de partout.

**7.** Le jour J au CFA :
- Le formateur ouvre `https://bts-e4-quiz.onrender.com/host.html` sur le PC (n'importe lequel, meme tablette)
- Les eleves scannent le QR code affiche, ou tapent l'URL
- **C'est tout.**

### ⚠️ Points d'attention
- **Free tier Render dort apres 15 min d'inactivite** : la 1ere connexion peut prendre 30-50 secondes (le temps que le serveur "reveille"). Pour eviter : ouvrir la page 1 minute avant le cours.
- Si tu veux que ça reste toujours actif : passer en plan payant (~7 $/mois) OU utiliser un service de "ping" gratuit (UptimeRobot.com toutes les 10 min).

### Alternatives gratuites a Render
- **Railway.app** (5 $ de credit gratuit/mois, ne dort jamais sur le free tier)
- **Fly.io** (free tier solide, support WebSocket parfait)
- **Glitch.com** (vraiment simple, mais plus lent)

---

## 🏃 OPTION B — Hotspot smartphone (la plus simple si pas d'Internet)

**Solution sans installation et sans IT du CFA : utiliser ton telephone comme box Wi-Fi.**

### Procedure (2 minutes)

**1.** Sur ton telephone : **Parametres → Point d'acces / Partage de connexion → Activer**

**2.** Connecte le **PC du formateur** au Wi-Fi cree par ton telephone.

**3.** Connecte aussi les telephones des eleves au meme Wi-Fi (mot de passe du hotspot).

**4.** Sur le PC du formateur :
   - Double-clic sur `quiz-e4.exe` (fichier portable, voir Option C)
   - **OU** `npm start` si Node est deja installe

**5.** Les eleves scannent le QR code affiche → c'est parti.

### Avantages / inconvenients
- ✅ Aucun reseau d'entreprise involve, aucune autorisation
- ✅ Marche meme si le CFA bloque tout
- ⚠️ Consomme ton forfait data (le quiz est tres leger : < 5 Mo pour toute une session)
- ⚠️ Limite a ~10 telephones simultanes selon le forfait

---

## 💼 OPTION C — Executable portable (.exe sur cle USB)

**Un seul fichier .exe a copier sur une cle USB**, qui contient **TOUT** : Node.js + le serveur + les questions + les pages web. Aucune installation, aucun droit admin requis.

### Le fichier .exe est deja construit !

Il se trouve ici :
```
C:\Users\Sulli\Documents\Claude\Projects\BTS-E4-Quiz\dist\quiz-e4.exe
```
Taille : ~49 Mo. Copie-le sur une cle USB.

### Sur le PC du CFA

**1.** Branche la cle USB.

**2.** Double-clic sur `quiz-e4.exe` (ou clic droit → "Executer en tant qu'administrateur" si refuse).

**3.** Au 1er lancement, Windows peut afficher **"Windows a protege votre PC"** : clique sur **"Informations complementaires" → "Executer quand meme"**. (Tu peux signer l'exe pour eviter ça, mais c'est ~150 €/an.)

**4.** Une fenetre noire s'ouvre et affiche :
```
 Local       : http://localhost:3000
 Reseau LAN  : http://192.168.x.x:3000
```

**5.** Le formateur ouvre `http://localhost:3000/host.html` dans son navigateur.

**6.** Les eleves se connectent via le QR code → necessite un reseau Wi-Fi local commun (CFA ou hotspot, voir Option B).

### ⚠️ Limitations
- Necessite quand meme un **reseau local commun** entre PC et telephones (pas Internet, juste un Wi-Fi commun)
- Le pare-feu Windows peut bloquer : autoriser `quiz-e4.exe` sur reseau prive au 1er lancement
- Si Windows refuse via SmartScreen, demander a ce qu'on autorise l'exe (drag/drop sur "Plus d'infos → Executer quand meme")

### Reconstruire l'exe (si tu modifies les questions)

```powershell
cd C:\Users\Sulli\Documents\Claude\Projects\BTS-E4-Quiz
npm install
npm run build:exe
```
Le nouvel exe est genere dans `dist\quiz-e4.exe`.

---

## 📊 Tableau comparatif

| Critere | A — En ligne (Render) | B — Hotspot tel | C — .exe + LAN |
|---|---|---|---|
| Installation cote formateur | Aucune | Aucune | Double-clic .exe |
| Connexion Internet requise | ✅ Oui | ❌ Non (4G suffit) | ❌ Non |
| Reseau prive du CFA requis | ❌ Non | ❌ Non | ✅ Oui |
| Droits admin sur le PC | ❌ Non | ❌ Non | ⚠️ Parfois (SmartScreen) |
| Consomme du forfait data | ⚠️ Un peu | ✅ Oui (tel) | ❌ Non |
| Marche aussi a distance | ✅ Oui | ❌ Non | ❌ Non |
| Temps de mise en place | 15 min (1 fois) | 2 min | 0 min |
| **Recommande pour CFA** | **⭐ OUI** | Plan B excellent | Si offline obligatoire |

---

## 🎯 Recommandation finale

**Au CFA : Option A (Render).** Tu as une URL fixe, le formateur ouvre la page sur n'importe quel PC du CFA (meme un PC d'eleve), les eleves scannent le QR. Marche meme si le reseau du CFA est tres restreint, du moment qu'Internet est accessible.

**Si Internet est completement filtre / bloque au CFA** → Option B (hotspot du telephone) + Option C (executable portable).

**Pour une session a la maison / petit cours individuel** → Option C suffit largement.

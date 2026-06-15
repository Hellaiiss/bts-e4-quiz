# Soutenance U6.2 — Rétrofit MPH600

Présentation (deck) de la soutenance de Sullivan DEVALLIÈRE — partie automatisme
du rétrofit de l'armoire électrique du bras manipulateur hydraulique **MPH600**
(BTS Électrotechnique, U6.2).

Deck statique navigable au clavier / clicker, conçu avec Claude Design puis
intégré ici. Il est servi directement par le serveur Express existant
(`express.static('public')`).

## Voir la présentation

- En local : `npm start` puis ouvrir <http://localhost:3000/soutenance/>
- En ligne (Render) : `https://<app>.onrender.com/soutenance/`

## Navigation

- **Flèches ← / →** (ou PageUp / PageDown d'un clicker) : slide précédent / suivant
- **F** : plein écran · **G** : grille des miniatures · **S** : notes orateur
- Voir l'aide intégrée du composant `deck-stage` pour les autres raccourcis.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Les 21 slides + notes orateur (`#speaker-notes`) |
| `styles.css` | Système visuel (thème vert SHEM/ENGIE sur fond sombre) |
| `deck-stage.js` | Composant deck : nav clavier, notes, grille, export PDF |
| `image-slot.js` | Emplacement photo (glisser-déposer, stocké en localStorage) |

## Photo à ajouter

Le slide 08 (soudure de l'embase de l'amplificateur Atos) contient un
emplacement photo (`<image-slot id="mph_soudure">`). Glissez-y votre photo
des soudures : elle est mémorisée dans le navigateur.

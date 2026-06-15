# Soutenance U6.2 — Réalisation & mise en service MPH600

Présentation de la soutenance de Sullivan DEVALLIÈRE (BTS Électrotechnique,
épreuve U6.2) sur le rétrofit de l'armoire du bras hydraulique **MPH600**.

Diaporama au format **Prezi** : un canvas unique avec zoom/déplacement entre
les diapositives, 18 vues structurées par tâches du référentiel
(T6.1 → T8.4) et compétences **C4 · C14 · C15 · C16**.

Fichier unique et autonome (CSS + JS intégrés, aucune ressource externe).
Servi directement par le serveur Express existant (`express.static('public')`).

## Voir la présentation

- En local : `npm start` puis ouvrir <http://localhost:3000/soutenance/>
- En ligne (Render) : `https://<app>.onrender.com/soutenance/`
- Hors serveur : ouvrir `Soutenance_MPH600.html` directement dans un navigateur.

## Navigation

- **→ / Espace / PageDown** : diapositive suivante
- **← / PageUp** : diapositive précédente
- **Home / H** : vue d'ensemble · **End** : dernière diapositive
- Panneau de pastilles à gauche, ou les boutons ⌂ ◀ ▶ en bas à droite.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La présentation (servie sur `/soutenance/`) |
| `Soutenance_MPH600.html` | Copie identique, à ouvrir/partager hors serveur |

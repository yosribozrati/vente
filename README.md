# VendoTN — Démo e-commerce (HTML/CSS/JS)

Une mini boutique inspirée de Tunisianet/Mytek. Frontend pur: HTML, CSS, JavaScript — produits mockés, panier en localStorage.

## Démarrer
- Ouvrez `index.html` dans votre navigateur.
- Le panier se synchronise entre `index.html` et `cart.html` via `localStorage`.

## Structure
- `index.html` — accueil, recherche, filtres, tri, grille produits
- `cart.html` — panier, quantités, suppression, total
- `styles.css` — style moderne sombre, responsive
- `app.js` — rendu produits, recherche/tri, ajout au panier
- `cart.js` — gestion du panier, récapitulatif

## Personnaliser
- Mettez vos produits dans `app.js` (tableau `products`).
- Ajoutez de vraies images et prix TND.
- Remplacez l'alerte de commande par une intégration réelle (API paiement/checkout).

Licence: MIT (usage éducatif).

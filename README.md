# KLL Framework

KLL est un framework JavaScript léger conçu pour créer des applications web interactives en utilisant une approche centrée sur le HTML. Il facilite le développement de composants réactifs et réutilisables sans lourdeur.

## Caractéristiques

- **Système de templates** : Utilisez `kll-t` pour définir des templates de composants réutilisables.
- **Binding d'état** : Liez l'état de vos composants à votre DOM avec `kll-bind`.
- **Contrôleurs** : Contrôlez la logique de vos composants avec `kll-ctrl`.
- **Écouteurs d'état** : Écoutez et réagissez aux changements d'état d'autres composants.

## Installation

Incluez KLL dans votre projet :

htmlCopy code

`<script src="path/to/kll.js"></script>`

## Utilisation

### Définir un template

Créez un template de composant HTML et définissez un `id` correspondant.

htmlCopy code

`<template id="button-test">
  <button>Click me</button>
</template>`

### Utiliser un template

Utilisez le template dans votre HTML avec `kll-t`.

htmlCopy code

`<div kll-t="button-test" kll-ctrl="buttonTest"></div>`

### Contrôleur

Créez un fichier de contrôleur pour gérer la logique.

javascriptCopy code

`` // buttonTest.js
export default {
  state: {
    count: 0
  },
  onInit(state, container) {
    // Initialisation
  },
  onClick(state, element) {
    // Réagir aux clics
    state.count++;
  },
  render(state, container) {
    // Mise à jour du rendu
    container.textContent = `Clicks: ${state.count}`;
  }
} ``

### Écouter et Réagir à l'État

Utilisez `kll-b` pour écouter les changements d'état d'autres composants.

htmlCopy code

`<div kll-t="text-to-render" kll-b="my_button.count" kll-ctrl="textToRender"></div>`

## API

- **kllT()** : Initialise et rend tous les composants KLL dans le document.
- **getState(id)** : Récupère l'état d'un composant par son ID.

## Développement et Contribution

Les contributions à KLL sont les bienvenues. Pour contribuer :

1.  Clonez le dépôt.
2.  Créez une branche pour votre fonctionnalité ou correction.
3.  Faites vos modifications.
4.  Soumettez une pull request.

## Licence

KLL est sous licence MIT.

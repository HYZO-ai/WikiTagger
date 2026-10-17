
# 🏷️ WikiTagger

**WikiTagger** est une extension gratuite pour **Google Chrome, Brave et Microsoft Edge**, permettant d'automatiser le tri et l'étiquetage des cartes de votre collection sur [WikiMasters](https://www.wiki-masters.com).

Créez des catégories, associez-leur des mots-clés et laissez WikiTagger rechercher, sélectionner et étiqueter automatiquement vos cartes sur l'ensemble de votre collection.

**Développé par HYZO** — Extension indépendante et non officielle de WikiMasters.

---

## ✨ Fonctionnalités

- 🏷️ Importation des étiquettes existantes sur WikiMasters.
- 📁 Création et gestion de catégories personnalisées.
- 🔎 Association de plusieurs mots-clés à chaque catégorie.
- ☑️ Sélection des catégories à traiter.
- ⚡ Étiquetage automatique avec détection des chargements en temps réel.
- 📄 Gestion automatique de toutes les pages de résultats.
- 📊 Suivi de la progression et comptage des cartes étiquetées.
- ⏯️ Boutons Démarrer, Pause, Reprendre et Arrêter.
- 🔔 Notification à la fin du traitement.
- 📝 Export des logs JSON pour faciliter le dépannage.
- 🌐 Compatible Google Chrome, Brave et Microsoft Edge.

---

## 📥 Installation

WikiTagger s'installe directement dans votre navigateur.

**Aucune installation de Python ou d'un autre logiciel n'est nécessaire.**

### 1. Télécharger WikiTagger

1. Rendez-vous dans la section **Releases** du dépôt GitHub.
2. Téléchargez la dernière version de `WikiTagger.zip`.
3. Extrayez l'archive ZIP dans un dossier sur votre ordinateur.
4. Conservez ce dossier : votre navigateur en a besoin pour charger l'extension.

> ⚠️ Ne supprimez pas le dossier après l'installation.

### 2. Ouvrir les extensions de votre navigateur

WikiTagger est conçu pour fonctionner avec les trois navigateurs suivants.

#### 🌐 Google Chrome

1. Ouvrez Google Chrome.
2. Copiez cette adresse dans la barre d'adresse :

   `chrome://extensions`

3. Appuyez sur **Entrée**.

#### 🦁 Brave

1. Ouvrez Brave.
2. Copiez cette adresse dans la barre d'adresse :

   `brave://extensions`

3. Appuyez sur **Entrée**.

#### 🔵 Microsoft Edge

1. Ouvrez Microsoft Edge.
2. Copiez cette adresse dans la barre d'adresse :

   `edge://extensions`

3. Appuyez sur **Entrée**.

### 3. Activer le mode développeur

Une fois dans la page des extensions :

1. Repérez l'option **Mode développeur**.
2. Activez-la.
3. De nouvelles options apparaîtront.

Sur Chrome et Brave, cette option se trouve généralement en haut à droite. Sur Edge, elle peut se trouver dans le panneau latéral.

### 4. Installer WikiTagger

1. Cliquez sur **Charger l'extension non empaquetée**.
2. Sélectionnez le dossier WikiTagger extrait précédemment.
3. Vérifiez que le fichier `manifest.json` se trouve directement dans ce dossier.
4. Validez.

✅ **WikiTagger est maintenant installé !**

> Si votre navigateur indique « Fichier manifeste absent ou illisible », vérifiez que vous avez sélectionné le bon dossier, celui contenant directement `manifest.json`.

### 5. Épingler WikiTagger

Pour accéder rapidement à l'extension :

1. Cliquez sur l'icône des extensions 🧩 dans la barre du navigateur.
2. Recherchez **WikiTagger**.
3. Cliquez sur l'icône d'épingle ou choisissez l'option permettant d'afficher l'extension dans la barre d'outils.

Vous pourrez désormais ouvrir WikiTagger en un clic.

---

## 🚀 Comment utiliser WikiTagger ?

### Étape 1 — Se connecter à WikiMasters

1. Ouvrez votre navigateur.
2. Rendez-vous sur [WikiMasters](https://www.wiki-masters.com).
3. Connectez-vous normalement à votre compte.
4. Accédez à votre collection.

**Lien direct :**

https://www.wiki-masters.com/collection

WikiTagger utilise votre session déjà ouverte dans le navigateur.

Aucun identifiant ou mot de passe n'est demandé par l'extension.

### Étape 2 — Importer les étiquettes existantes

Si vous possédez déjà des étiquettes sur WikiMasters, vous pouvez les importer automatiquement.

1. Ouvrez WikiTagger.
2. Repérez la rubrique **Importer les étiquettes existantes**.
3. Cliquez sur **Listing des étiquettes**.
4. WikiTagger accède à votre collection si nécessaire.
5. L'extension récupère les étiquettes existantes.
6. Les étiquettes sont ajoutées dans **Mes catégories**.

Une fois l'importation terminée, la liste déroulante des étiquettes est automatiquement refermée.

**Exemple :**

Étiquettes présentes sur WikiMasters :

- Acteur / Actrice
- Aviation
- Football
- Peintre
- Ferrari

Ces étiquettes apparaîtront automatiquement dans **Mes catégories**.

Les catégories déjà présentes ne sont pas dupliquées et leurs mots-clés sont conservés.

### Étape 3 — Créer ou modifier une catégorie

Dans la rubrique **Mes catégories**, vous pouvez :

- Créer une nouvelle catégorie.
- Modifier une catégorie existante.
- Associer des mots-clés.
- Cocher ou décocher une catégorie.
- Supprimer une catégorie de l'extension.

Chaque catégorie correspond au nom d'une étiquette sur WikiMasters.

**Exemple :**

Nom de la catégorie : `Football`

Cette catégorie sera associée à l'étiquette `Football` sur WikiMasters.

### Étape 4 — Ajouter des mots-clés

Chaque catégorie peut posséder un ou plusieurs mots-clés.

Cliquez sur le bouton de modification d'une catégorie pour configurer ses mots-clés.

**Exemple :**

Catégorie : `Football`

Mots-clés :

`football , footballeur , coupe du monde , ligue des champions`

**Important :**

- Séparez les mots-clés uniquement avec une virgule.
- Les espaces autour des virgules sont automatiquement supprimés lors de l'enregistrement.
- Chaque mot-clé sera recherché séparément.
- Les recherches utilisent le moteur de recherche de WikiMasters.

Vous pouvez ajouter autant de mots-clés que nécessaire.

### Étape 5 — Sélectionner les catégories

Avant de démarrer :

1. Ouvrez **Mes catégories**.
2. Cochez les catégories que vous souhaitez traiter.
3. Vérifiez que chacune possède au moins un mot-clé.
4. Laissez décochées les catégories que vous ne souhaitez pas traiter.

**Exemple :**

- [x] Football
- [x] Aviation
- [ ] Ferrari
- [x] Peintre

Dans cet exemple, WikiTagger traitera uniquement Football, Aviation et Peintre.

### Étape 6 — Lancer l'étiquetage automatique

Cliquez sur le bouton **Démarrer**.

WikiTagger effectue automatiquement les opérations suivantes :

1. Recherche le premier mot-clé de la catégorie.
2. Attend la fin du chargement des résultats.
3. Active le mode sélection si nécessaire.
4. Clique sur **Tout sélectionner (page)**.
5. Clique sur **Étiqueter**.
6. Ouvre la fenêtre d'application des étiquettes.
7. Sélectionne l'étiquette correspondant à la catégorie.
8. Attend la fin de l'actualisation.
9. Clique sur **Terminé**.
10. Vérifie que la fenêtre est fermée.
11. Passe à la page suivante si elle existe.
12. Répète le traitement jusqu'à la dernière page.
13. Passe au mot-clé suivant.
14. Passe à la catégorie suivante.

**Exemple de traitement :**

Catégorie : `Football`

Mots-clés : `football , footballeur`

WikiTagger commence par rechercher `football`.

Il traite toutes les pages de résultats avant de passer au mot-clé `footballeur`.

Une fois toutes les pages de `footballeur` terminées, il passe à la prochaine catégorie cochée.

### Étape 7 — Suivre la progression

WikiTagger affiche l'avancement du traitement dans la rubrique **Activité en direct**.

**Exemple :**

`21:45:02 — Étiquette Football en cours de traitement`

`21:46:18 — 87 cartes trouvées et étiquetées — Football`

`21:46:19 — Étiquette Aviation en cours de traitement`

Les compteurs permettent de suivre les résultats du traitement.

**Attention :** une carte peut déjà posséder une étiquette. Le nombre de cartes sélectionnées ne correspond donc pas nécessairement au nombre de nouvelles étiquettes appliquées.

### Étape 8 — Mettre en pause ou arrêter

WikiTagger dispose de trois commandes principales :

**▶️ Démarrer**

Lance le traitement des catégories sélectionnées.

**⏸️ Pause / Reprendre**

Suspend temporairement le traitement, puis permet de le reprendre.

**⏹️ Arrêter**

Demande l'arrêt du traitement automatique.

### Étape 9 — Fin du traitement

Lorsque toutes les catégories sélectionnées ont été traitées avec succès :

1. WikiTagger termine la dernière opération.
2. Il ferme les fenêtres de confirmation.
3. Il quitte automatiquement le mode sélection.
4. Il arrête le traitement.
5. Il affiche une notification.

🎉 **Toutes les cartes sont étiquetées !**

Aucun son n'est joué à la fin du traitement.

---

## ⚡ Mode Instantané

WikiTagger intègre un système de détection des changements de page utilisant `MutationObserver`.

Ce système permet de surveiller :

- Les chargements.
- Les actualisations.
- L'ouverture et la fermeture des fenêtres.
- L'activation et la désactivation des boutons.
- Les changements de résultats.

Au lieu de vérifier uniquement la page à intervalles fixes, WikiTagger peut réagir rapidement aux modifications détectées.

**Avantages :**

- Réduction des attentes inutiles.
- Enchaînement plus rapide des opérations.
- Vérification de la disponibilité des boutons.
- Attente des chargements avant les actions importantes.

La vitesse réelle dépend du navigateur, de la connexion Internet et des performances du site WikiMasters.

---

## 🔵 Détection de WikiMasters

WikiTagger affiche un indicateur de statut dans son interface.

🔴 **Rouge — Site non détecté**

L'onglet actif n'est pas sur WikiMasters.

🔵 **Bleu — Site détecté**

WikiMasters est ouvert dans l'onglet actif.

🟢 **Vert — Traitement actif**

WikiTagger effectue un traitement sur WikiMasters.

La détection repose sur l'adresse de l'onglet et ne garantit pas que l'utilisateur est connecté à son compte.

---

## 📝 Logs et diagnostics

WikiTagger possède un système de diagnostic permettant d'identifier les erreurs rencontrées pendant le traitement.

### Exporter les logs

1. Ouvrez WikiTagger.
2. Rendez-vous dans **Activité en direct**.
3. Cliquez sur **Exporter les logs JSON**.
4. Un fichier de diagnostic sera téléchargé.

Le fichier peut contenir :

- La date et l'heure des actions.
- Les catégories traitées.
- Les mots-clés recherchés.
- Les pages parcourues.
- Les chargements détectés.
- Les boutons présents ou désactivés.
- Les fenêtres ouvertes.
- Les nombres de cartes sélectionnées.
- Les erreurs rencontrées.
- Les informations techniques utiles au dépannage.

### Effacer les logs

Cliquez sur **Effacer les logs** pour supprimer l'historique des diagnostics enregistré par l'extension.

> 🔒 Les diagnostics sont conservés localement. Aucun fichier n'est envoyé automatiquement. Vérifiez leur contenu avant de les partager.

---

## 🛠️ Résolution des problèmes

### WikiTagger ne détecte pas WikiMasters

1. Vérifiez que WikiMasters est ouvert.
2. Vérifiez que vous utilisez la bonne adresse.
3. Actualisez la page WikiMasters.
4. Rechargez l'extension depuis la page des extensions du navigateur.

### Les étiquettes ne sont pas importées

1. Rendez-vous dans votre collection.
2. Attendez la fin du chargement.
3. Cliquez sur **Listing des étiquettes**.
4. Vérifiez que les étiquettes existent bien sur WikiMasters.

### Le traitement s'arrête avec une erreur

1. Vérifiez que vous êtes toujours connecté à WikiMasters.
2. Vérifiez que la page est correctement chargée.
3. Exportez les logs JSON.
4. Consultez les messages d'erreur.
5. Relancez le traitement si nécessaire.

### Erreur « Bouton Sélectionner introuvable »

WikiTagger doit reconnaître le mode sélection déjà actif.

Si cette erreur apparaît malgré tout :

1. Actualisez la collection.
2. Rechargez l'extension.
3. Exportez les logs.
4. Signalez le problème avec le fichier de diagnostic.

### Erreur « Fichier manifeste absent ou illisible »

Vérifiez que vous avez sélectionné le dossier contenant directement le fichier `manifest.json`.

N'essayez pas de charger directement l'archive ZIP comme extension non empaquetée.

---

## 🔄 Mettre à jour WikiTagger

Pour conserver vos catégories et vos mots-clés :

1. Téléchargez la nouvelle version de WikiTagger.
2. Extrayez l'archive.
3. Remplacez les fichiers dans votre dossier WikiTagger actuel.
4. Ouvrez la page des extensions :

   - Chrome : `chrome://extensions`
   - Brave : `brave://extensions`
   - Edge : `edge://extensions`

5. Cliquez sur **Actualiser** sur la fiche WikiTagger.
6. Actualisez également votre page WikiMasters.

> ⚠️ Évitez de supprimer puis réinstaller l'extension lors d'une simple mise à jour. Cela peut entraîner la perte des catégories et mots-clés enregistrés localement.

---

## 🔒 Confidentialité et sécurité

WikiTagger fonctionne localement dans votre navigateur.

- Aucun mot de passe WikiMasters n'est demandé par l'extension.
- La connexion s'effectue directement sur le site officiel.
- Les catégories et paramètres sont conservés dans le stockage local de l'extension.
- Les journaux de diagnostic ne sont pas envoyés automatiquement.
- L'extension ne contourne pas les vérifications humaines ou les protections de sécurité du site.

---

## ⚠️ Avertissement

WikiTagger est une extension indépendante, non officielle et non affiliée à WikiMasters.

Elle est destinée à faciliter l'organisation et l'étiquetage des collections de cartes.

Son utilisation doit respecter les conditions d'utilisation de WikiMasters.

Le fonctionnement de certaines fonctionnalités peut être affecté par les modifications du site.

---

## 👨‍💻 Crédits

**Développé par HYZO**

**Projet :** WikiTagger

**Version documentée :** V1.1

**Navigateurs :**
- Google Chrome
- Brave
- Microsoft Edge (Chromium)

**Site compatible :** https://www.wiki-masters.com

---

### 🏷️ WikiTagger — Organisez votre collection, simplement.

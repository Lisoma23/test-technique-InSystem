# Test Technique – InSystem

Ce projet a été réalisé dans le cadre d’un test technique pour InSystem.

## ⚙️ Stack technique

Stack utilisée :

- **React**  
- **TailwindCSS**  
- **TanStack** – pour récupérer les données et les afficher dans un tableau  
- **MUI X** – pour représenter les données sous forme graphique  

J’ai cependant choisi d’utiliser **Vite** à la place de `create-react-app`, qui est désormais déprécié. Cela m’a permis de bénéficier d’un environnement de développement plus rapide et moderne.

## 🚧 Difficultés rencontrées

- `create-react-app` n'étant plus maintenu, j’ai dû **reconfigurer entièrement le projet avec Vite**, ce qui a nécessité de revoir la structure initiale, les scripts et certaines dépendances.  
- Le **plugin PWA officiel** (`cra-template-pwa`) n’est **plus compatible avec la dernière version de `create-react-app`**, ce qui a empêché de l’utiliser dans sa version standard.  
- J’ai donc **mis en place manuellement une Progressive Web App (PWA)** avec Vite, permettant au site de **fonctionner en mode offline** grâce à l'utilisation d’un service worker automatiquement injecté.  
- La doc officielle de TanStack Table présentait un `useEffect` avec un problème de gestion des dépendances, qui, une fois corrigé, provoquait un rerender infini du composant, faisant monter la consommation mémoire de mon PC. Ce problème est survenu lors du passage de `create-react-app` à Vite.

## 💡 Idées de maquette

<img width="788" height="534" alt="image" src="https://github.com/user-attachments/assets/2239294f-82b4-4b89-8b19-7434e8a33d86" />

<img width="763" height="49" alt="image2" src="https://github.com/user-attachments/assets/50ebf86a-1499-442b-89e9-c1d6a8f30971" />

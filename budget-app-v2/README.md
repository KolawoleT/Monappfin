# Budget App v2 🏦

App de gestion budgétaire avec **3 portefeuilles** (Courant, Épargne urgence, Investissement).

## ✨ Fonctionnalités

✅ **3 Portefeuilles** :
- 💳 Compte courant (310 000 F initial)
- 🛡️ Épargne urgence (objectif 200 000 F)
- 💎 Investissement (objectif 150 000 F)

✅ **Allocation automatique** :
- 213 100 F → Charges fixes
- 40 000 F → Épargne urgence
- 36 900 F → Investissement

✅ **8 Charges fixes** prédéfinies

✅ **Suivi par mois** avec historique

✅ **PWA** : Installable sur téléphone

✅ **localStorage** : Données sauvegardées localement

## 🚀 Installation

```bash
npm install
npm run dev
```

Ouvre : http://localhost:5173

## 📦 Build

```bash
npm run build
```

Le dossier `dist/` est prêt à être déployé sur Vercel.

## 📱 Déploiement

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USER/budget-app-v2.git
git push -u origin main
```

### Vercel

1. Va sur vercel.com
2. Add New → Project
3. Sélectionne budget-app-v2
4. Deploy

C'est tout ! 🎉

# My Recipe App

A cross-platform mobile app that allows users to search for recipes by ingredients, view detailed cooking instructions, and save their favorite meals. Built using React Native (Expo), integrated with the Spoonacular API for recipe data and Firebase for user authentication and data storage.

---

## Features

- Recipe Search: Search for recipes by keywords or filter by dietary preferences, time, cuisine, and more.
- Recipe Details: View ingredients, nutrition info, step-by-step instructions, and similar recipes.
- Save Favorites: Authenticated users can bookmark their favorite recipes to view later.
- User Accounts: Sign in and sign up with Firebase Authentication.
- Sharing: Share your favorite recipes with friends using your device’s native share options.

---

## Tech Stack

- React Native (Expo)
- Spoonacular API – for recipe data
- Firebase Authentication
- Cloud Firestore – to store user favorites
- Redux – to manage search filters
- React Navigation – for navigation and stack management

---

## Installation

1. Clone this repo
2.	Install dependencies:
```bash
  npm install
```
3. Creat an API key at: https://spoonacular.com/food-api
4. Add your environment variables:
Create a .env file:
```bash
SPOONACULAR_API_KEY=your_api_key_here
```
5.	Start the app:
```bash
  npx expo start
```

---

### Firebase Setup
To connect to Firebase:
- Create a Firebase project on https://console.firebase.google.com
- Enable Authentication (Email/Password)
- Set up Cloud Firestore with rules to allow logged-in users to read/write their data

Paste your Firebase config in /config/FirebaseConfig.js.

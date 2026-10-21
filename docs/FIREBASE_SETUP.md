# TripDNA AI: Firebase login and cloud backup

TripDNA can be used without an account. Saved trips, recent searches, favorites and recent full trip-result snapshots are stored in the browser/WebView so they remain after the app is closed. An email/password account adds cloud backup for saved trips, recent searches and favorites.

## One-time Firebase setup

1. Create or open a Firebase project and add a Web app.
2. In Authentication → Sign-in method, enable Email/Password.
3. Create a Cloud Firestore database.
4. Copy the web-app configuration into .env.local using the names in .env.example.
5. Add the same VITE_FIREBASE_* variables to Vercel's project environment variables, then redeploy. Do not add Firebase service-account JSON to the frontend.
6. Use these Firestore rules. They let each signed-in user access only their own saved travel document.

~~~text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/appData/{documentId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
~~~

## What is stored

- On this device: up to 20 saved routes, 10 recent searches, favorites, and up to 4 compact trip snapshots. A cached trip can be shown after the app is reopened and can still be shown when a live refresh fails.
- In the account: saved routes, recent searches and up to 100 favorites are merged with local data on sign-in and backed up to Firestore.
- Offline behavior: local data stays usable without a Firebase connection. Cloud updates are best-effort and sync on later app changes/sign-in; check the browser console if Firebase rules or credentials are incorrect.

Full trip snapshots remain on-device rather than being placed in one Firestore document, which avoids sending large route geometry and place lists as a single cloud record. Local browser/WebView storage survives closing and reopening the app, but can be cleared by uninstalling the app or clearing app/site data. Account backup helps restore route history and favorites on another device.

## APK note

When wrapping this Vite app in a WebView/Capacitor APK, keep the app's storage origin stable between launches. Firebase Auth uses local persistence, so the sign-in session is retained where the platform supports it. Test login, sign-out, and offline saved-trip access on a real Android build before publishing.

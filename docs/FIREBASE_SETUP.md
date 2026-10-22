# TripDNA AI: Firebase login and cloud backup

TripDNA can be used without an account. Saved trips, recent searches, favorites and recent full trip-result snapshots are stored in the browser/WebView so they remain after the app is closed. A Firebase email/password account adds cloud backup for saved trips, recent searches and favorites. If a packaged build has no Firebase configuration, it offers a local profile instead so login still works on that device.

## Local profile fallback

When Firebase is not configured, choose **Create local profile** on the login screen. It saves the profile on this PC and signs you in to the local app. Passwords are stored as salted PBKDF2-SHA-256 hashes. Local profiles are not cloud accounts, do not sync between devices, and cannot be recovered if the password is forgotten. Use **Profile → Backup & Restore** for trip data portability. To use Firebase cloud accounts, complete the setup below and rebuild the app with the Firebase web configuration.

## One-time Firebase setup

1. Create or open a Firebase project and add a Web app.
2. In Authentication → Sign-in method, enable Email/Password.
3. Create a Cloud Firestore database.
4. Copy the web-app configuration into .env.local using the names in .env.example.
5. Add the same VITE_FIREBASE_* variables to Vercel's project environment variables, then redeploy. Do not add Firebase service-account JSON to the frontend.
6. Deploy the rules included in this repository. The root firebase.json points to firestore.rules. From a trusted terminal with the Firebase CLI installed and the correct project selected, run \`firebase deploy --only firestore:rules\`. These rules restrict users to their own backup document and cap the number of saved records.

## What is stored

- On this device: up to 20 saved routes, 10 recent searches, favorites, and up to 4 compact trip snapshots. A cached trip can be shown after the app is reopened and can still be shown when a live refresh fails.
- In the account: saved routes, recent searches and up to 100 favorites are merged with local data on sign-in and backed up to Firestore.
- Offline behavior: local data stays usable without a Firebase connection. Cloud updates are best-effort and sync on later app changes/sign-in; check the browser console if Firebase rules or credentials are incorrect.
- Portable backups: open **Profile → Backup & Restore** to export supported TripDNA-local data to a JSON file or restore it on another device. Restore replaces TripDNA keys on the current device only; it does not overwrite the Firebase account.

Full trip snapshots remain on-device rather than being placed in one Firestore document, which avoids sending large route geometry and place lists as a single cloud record. Local browser/WebView storage survives closing and reopening the app, but can be cleared by uninstalling the app or clearing app/site data. Account backup helps restore route history and favorites on another device.

## APK note

When wrapping this Vite app in a WebView/Capacitor APK, keep the app's storage origin stable between launches. Firebase Auth uses local persistence, so the sign-in session is retained where the platform supports it. Test login, sign-out, and offline saved-trip access on a real Android build before publishing.

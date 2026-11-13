// 部署時由 .github/inject.py 把佔位符換成真實設定（真實值放在 .env 與 GitHub Secrets）
export const firebaseConfig = {
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__',
  projectId: '__FIREBASE_PROJECT_ID__',
  storageBucket: '__FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__FIREBASE_APP_ID__',
};

export const SDK = 'https://www.gstatic.com/firebasejs/11.10.0';
export const VERSION = 'v1.1.0';

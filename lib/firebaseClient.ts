export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyKeyForBuildEdge123456',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'build-edge.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'build-edge',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'build-edge.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

export function loadFirebaseScripts(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }
    if ((window as any).firebase && (window as any).firebase.auth) {
      resolve((window as any).firebase);
      return;
    }

    if (!document.getElementById('firebase-app-script')) {
      const appScript = document.createElement('script');
      appScript.id = 'firebase-app-script';
      appScript.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js';
      appScript.onload = () => {
        const authScript = document.createElement('script');
        authScript.id = 'firebase-auth-script';
        authScript.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js';
        authScript.onload = () => {
          const fb = (window as any).firebase;
          if (!fb.apps.length) {
            fb.initializeApp(firebaseConfig);
          }
          resolve(fb);
        };
        authScript.onerror = reject;
        document.body.appendChild(authScript);
      };
      appScript.onerror = reject;
      document.body.appendChild(appScript);
    } else {
      const checkInterval = setInterval(() => {
        if ((window as any).firebase && (window as any).firebase.auth) {
          clearInterval(checkInterval);
          const fb = (window as any).firebase;
          if (!fb.apps.length) {
            fb.initializeApp(firebaseConfig);
          }
          resolve(fb);
        }
      }, 100);
    }
  });
}

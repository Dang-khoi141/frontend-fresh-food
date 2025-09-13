// "use client"  // KHÔNG thêm dòng này ở file lib
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth chỉ nên tạo trong client component (SSR không có window)
export const getClientAuth = async () => {
  const { getAuth, setPersistence } = await import("firebase/auth");
  const auth = getAuth(app);
  //   Không “giữ đăng nhập” sau khi xác thực — chỉ dùng OTP để verify số
  await setPersistence(auth, inMemoryPersistence);
  return auth;
};

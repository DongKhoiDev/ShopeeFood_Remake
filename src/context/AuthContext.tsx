import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'USER' | 'ADMIN';
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  updateProfileData: (name: string, phone: string, address: string) => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sfood_user');
    const savedToken = localStorage.getItem('sfood_token');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);

    // Sync Auth state
    const initAuth = async () => {
       const { auth } = await import('../firebase');
       auth.onAuthStateChanged(async (firebaseUser) => {
         if (firebaseUser?.email === 'admin@sfood.com' || firebaseUser?.emailVerified || firebaseUser?.providerData?.some(p => p.providerId === 'google.com')) {
           const token = await firebaseUser.getIdToken();
           setToken(token);
           localStorage.setItem('sfood_token', token);

           // Fetch user data from firestore
           try {
             const userRef = doc(db, 'users', firebaseUser.uid);
             console.log("Fetching user doc for", firebaseUser.uid);
             const userDoc = await getDoc(userRef);
             console.log("Fetched user doc", userDoc.exists());
             let userData: User;
             if (userDoc.exists()) {
               userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
               if (firebaseUser.email === 'admin@sfood.com' && userData.role !== 'admin') {
                 console.log("Fixing admin role for existing admin user");
                 userData.role = 'admin';
                 await updateDoc(userRef, { role: 'admin' });
               }
             } else {
               // Create new user profile in firestore
               userData = {
                 id: firebaseUser.uid,
                 email: firebaseUser.email || '',
                 name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                 role: firebaseUser.email === 'admin@sfood.com' ? 'admin' : 'user',
                 createdAt: Date.now()
               } as any;
               console.log("Setting new doc", userData);
               await setDoc(userRef, {
                 email: userData.email,
                 name: userData.name,
                 role: userData.role,
                 createdAt: Date.now()
               });
               console.log("Set doc ok");
             }
             setUser(userData);
             localStorage.setItem('sfood_user', JSON.stringify(userData));
           } catch(e) {
             console.error("Failed to load user from firestore", e);
             console.error("Error code:", (e as any).code, "Message:", (e as any).message);
           }
         } else if (!firebaseUser) {
           setUser(null);
           setToken(null);
           localStorage.removeItem('sfood_user');
           localStorage.removeItem('sfood_token');
         }
       });
    };
    initAuth();
  }, []);

  const login = async (email: string, password = 'password') => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (email !== 'admin@sfood.com' && !result.user.emailVerified) {
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(result.user);
        throw new Error('Vui lòng xác thực email của bạn. Chúng tôi vừa gửi lại link xác thực vào hòm thư.');
      }
      // state changes picked up by onAuthStateChanged
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/invalid-credential') throw new Error('Email hoặc mật khẩu không đúng');
      throw e;
    }
  };

  const register = async (name: string, email: string, password = 'password') => {
    try {
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        if (email !== 'admin@sfood.com') {
          await sendEmailVerification(result.user);
        }
        
        // Ensure user document exists via initial creation even before verified, so they can login later
        await setDoc(doc(db, 'users', result.user.uid), {
           email: result.user.email,
           name: name,
           role: email === 'admin@sfood.com' ? 'admin' : 'user',
           createdAt: Date.now()
        });
        
        if (email !== 'admin@sfood.com') {
          throw new Error('Vui lòng xác thực email của bạn. Chúng tôi đã gửi link về hòm thư!');
        }
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/email-already-in-use') throw new Error('Email này đã được sử dụng.');
      else if (e.code === 'auth/weak-password') throw new Error('Mật khẩu quá yếu, phải từ 6 ký tự.');
      throw e;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../firebase');
      await signInWithPopup(auth, googleProvider);
      // handled by onAuthStateChanged
    } catch (error) {
      console.error('Firebase Google OAuth error:', error);
      throw error;
    }
  };

  const loginWithOTP = async (phone: string, otp: string) => {
    throw new Error('OTP Login in Firebase requires reCaptcha, not fully supported without specific setup.');
  };

  const checkEmailVerification = async () => {
    const { auth } = await import('../firebase');
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return auth.currentUser.emailVerified;
    }
    return false;
  };

  const updateProfileData = async (name: string, phone: string, address: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name, phone, address, 
        updatedAt: Date.now()
      });
      const updatedUser = { ...user, name, phone, address };
      setUser(updatedUser);
      localStorage.setItem('sfood_user', JSON.stringify(updatedUser));
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      const { auth } = await import('../firebase');
      await auth.signOut();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login,
      loginWithGoogle,
      loginWithOTP,
      register,
      updateProfileData,
      checkEmailVerification,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '../firebase-auth/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasWorkspace: boolean | null;
  checkUserWorkspace: (userId: string) => Promise<boolean>;
  refreshWorkspaceStatus: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasWorkspace, setHasWorkspace] = useState<boolean | null>(null);

  const checkUserWorkspace = async (userId: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'workspaceMembers'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.log('Error checking workspace:', error);
      return false;
    }
  };

  const refreshWorkspaceStatus = async (userId: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'workspaceMembers'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const hasWs = !querySnapshot.empty;
      setHasWorkspace(hasWs);
      return hasWs;
    } catch (error) {
      console.log('Error refreshing workspace status:', error);
      setHasWorkspace(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const workspace = await checkUserWorkspace(currentUser.uid);
          setHasWorkspace(workspace);
        } catch (error) {
          console.log('Error checking workspace on mount:', error);
          setHasWorkspace(false);
        }
      } else {
        setHasWorkspace(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, hasWorkspace, checkUserWorkspace, refreshWorkspaceStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

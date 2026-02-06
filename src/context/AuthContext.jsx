import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const STORAGE_KEY = '@USER_PROFILE';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* LOAD USER ON APP START */
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* LOGIN / CREATE ACCOUNT */
  const login = async profile => {
    const normalizedProfile = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      age: profile.age,
      color: profile.color || '#2563EB',
      avatarLetter:
        profile.avatarLetter ||
        profile.name?.charAt(0)?.toUpperCase() ||
        '?',
      createdAt: profile.createdAt || new Date().toISOString(),
    };

    setUser(normalizedProfile);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizedProfile)
    );
  };

  /* UPDATE PROFILE */
  const updateProfile = async updated => {
    setUser(updated);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  /* LOGOUT / SWITCH ACCOUNT */
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  /* DERIVED STATE */
  const isLoggedIn = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

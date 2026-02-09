import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const USERS_KEY = '@USERS_LIST';
const CURRENT_KEY = '@CURRENT_USER';

const capitalizeFullName = name => {
  if (!name) return '';
  return name
    .split(' ')
    .map(
      w =>
        w.charAt(0).toUpperCase() +
        w.slice(1).toLowerCase()
    )
    .join(' ');
};

const hash = str =>
  str
    .split('')
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_KEY);
        const current = await AsyncStorage.getItem(CURRENT_KEY);

        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }

        if (current) {
          setUser(JSON.parse(current));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const emailExists = email => {
    return users.some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  };

  const register = async profile => {
    const newUser = {
      ...profile,
      name: capitalizeFullName(profile.name),
      password: hash(profile.password),
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    setUser(newUser);

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    await AsyncStorage.setItem(
      CURRENT_KEY,
      JSON.stringify(newUser)
    );
  };

  const login = async profile => {
    setUser(profile);

    await AsyncStorage.setItem(
      CURRENT_KEY,
      JSON.stringify(profile)
    );
  };

  const verifyPassword = inputPassword => {
    if (!user) return false;
    return hash(inputPassword) === user.password;
  };

  const updateProfile = async updated => {
    const fixed = {
      ...updated,
      name: capitalizeFullName(updated.name),
    };

    const updatedUsers = users.map(u =>
      u.email === user.email ? fixed : u
    );

    setUsers(updatedUsers);
    setUser(fixed);

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    await AsyncStorage.setItem(
      CURRENT_KEY,
      JSON.stringify(fixed)
    );
  };

  /* 🔥 NEW: DELETE ACCOUNT */
  const deleteAccount = async email => {
    const filtered = users.filter(u => u.email !== email);

    setUsers(filtered);

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(filtered)
    );

    // If the deleted account was current (extra safety)
    if (user?.email === email) {
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_KEY);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_KEY);
  };

  const isLoggedIn = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        emailExists,
        isLoggedIn,
        loading,
        login,
        register,
        verifyPassword,
        logout,
        updateProfile,
        deleteAccount,   // ← REQUIRED by AccountSwitcher
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

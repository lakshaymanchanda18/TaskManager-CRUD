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
const ATTEMPTS_KEY = '@LOGIN_ATTEMPTS';
const LOCKS_KEY = '@LOGIN_LOCKS';
const SESSION_KEY = '@SESSION_TIME';
const THEME_KEY = '@DARK_MODE';

const SESSION_TIMEOUT = 12 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 1000;
const OTP_EXPIRY = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCK_TIME = 2 * 60 * 1000;

const capitalizeFullName = name =>
  name
    ?.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || '';

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
  const [authEntryFlow, setAuthEntryFlow] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [locks, setLocks] = useState({});
  const [otpStore, setOtpStore] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_KEY);
        const current = await AsyncStorage.getItem(CURRENT_KEY);
        const storedAttempts = await AsyncStorage.getItem(ATTEMPTS_KEY);
        const storedLocks = await AsyncStorage.getItem(LOCKS_KEY);
        const sessionTime = await AsyncStorage.getItem(SESSION_KEY);
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedAttempts) setAttempts(JSON.parse(storedAttempts));
        if (storedLocks) setLocks(JSON.parse(storedLocks));
        if (storedTheme) {
          const parsed = JSON.parse(storedTheme);
          setDarkMode(parsed);
        }

        if (current && sessionTime) {
          const now = Date.now();
          const loginTime = Number(sessionTime);

          if (now - loginTime < SESSION_TIMEOUT) {
            setUser(JSON.parse(current));
          } else {
            await AsyncStorage.removeItem(CURRENT_KEY);
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newValue));
  };

  const saveAttempts = async data => {
    setAttempts(data);
    await AsyncStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
  };

  const saveLocks = async data => {
    setLocks(data);
    await AsyncStorage.setItem(LOCKS_KEY, JSON.stringify(data));
  };

  const emailExists = email =>
    users.some(u => u.email.toLowerCase() === email.toLowerCase());

  const getUserByEmail = email =>
    users.find(u => u.email.toLowerCase() === email.toLowerCase());

  const register = async profile => {
    const newUser = {
      ...profile,
      name: capitalizeFullName(profile.name),
      password: hash(profile.password),
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    setUser(newUser);
    setAuthEntryFlow({
      type: 'register',
      name: newUser.name,
      at: Date.now(),
    });

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    await AsyncStorage.setItem(SESSION_KEY, Date.now().toString());
  };

  const login = async profile => {
    setUser(profile);
    setAuthEntryFlow({
      type: 'login',
      name: profile?.name || 'User',
      at: Date.now(),
    });
    await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(profile));
    await AsyncStorage.setItem(SESSION_KEY, Date.now().toString());
  };

  const clearAuthEntryFlow = () => {
    setAuthEntryFlow(null);
  };

  const verifyPassword = (email, inputPassword) => {
    const found = getUserByEmail(email);
    return found && hash(inputPassword) === found.password;
  };

  const isLocked = email => locks[email] && Date.now() < locks[email];

  const getLockRemaining = email =>
    Math.max(0, (locks[email] || 0) - Date.now());

  const recordFailedAttempt = async email => {
    const current = (attempts[email] || 0) + 1;

    if (current >= MAX_ATTEMPTS) {
      const updatedLocks = {
        ...locks,
        [email]: Date.now() + LOCK_TIME,
      };

      await saveLocks(updatedLocks);
      await saveAttempts({ ...attempts, [email]: 0 });
      return 'locked';
    }

    await saveAttempts({ ...attempts, [email]: current });
    return current;
  };

  const resetAttempts = async email =>
    saveAttempts({ ...attempts, [email]: 0 });

  const generateOTP = email => {
    const code = String(Math.floor(100000 + Math.random() * 900000));

    setOtpStore(prev => ({
      ...prev,
      [email.toLowerCase()]: {
        code,
        expiresAt: Date.now() + OTP_EXPIRY,
        tries: 0,
        lockedUntil: null,
      },
    }));

    // simulation only
    console.log(`[OTP] ${email}: ${code}`);
    return code;
  };

  const verifyOTP = async (email, inputOtp) => {
    const key = email.toLowerCase();
    const data = otpStore[key];

    if (!data) {
      return { ok: false, reason: 'expired' };
    }

    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return { ok: false, reason: 'locked' };
    }

    if (Date.now() > data.expiresAt) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      return { ok: false, reason: 'expired' };
    }

    if (String(inputOtp).trim() === data.code) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      return { ok: true };
    }

    const nextTries = (data.tries || 0) + 1;

    if (nextTries >= OTP_MAX_ATTEMPTS) {
      setOtpStore(prev => ({
        ...prev,
        [key]: {
          ...data,
          tries: 0,
          lockedUntil: Date.now() + OTP_LOCK_TIME,
        },
      }));

      return { ok: false, reason: 'locked' };
    }

    setOtpStore(prev => ({
      ...prev,
      [key]: {
        ...data,
        tries: nextTries,
      },
    }));

    return {
      ok: false,
      reason: 'invalid',
      triesLeft: OTP_MAX_ATTEMPTS - nextTries,
    };
  };

  const updateProfile = async updated => {
    const fixed = {
      ...updated,
      name: capitalizeFullName(updated.name),
    };

    const updatedUsers = users.map(u => (u.email === user.email ? fixed : u));

    setUsers(updatedUsers);
    setUser(fixed);

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(fixed));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const isLoggedIn = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        setUsers,
        loading,
        isLoggedIn,
        authEntryFlow,
        clearAuthEntryFlow,
        emailExists,
        getUserByEmail,
        login,
        register,
        verifyPassword,
        updateProfile,
        logout,
        isLocked,
        getLockRemaining,
        recordFailedAttempt,
        resetAttempts,
        generateOTP,
        verifyOTP,
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

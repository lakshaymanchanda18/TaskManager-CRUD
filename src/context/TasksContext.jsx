import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksContext = createContext();

/* ---------- HELPERS ---------- */

const formatDateLocal = date => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const timeToMinutes = t => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/* ---------- PROVIDER ---------- */

export const TasksProvider = ({ children, user }) => {
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(new Date());

  // unique storage per account
  const STORAGE_KEY = user
    ? `@TASKS_APP_DATA_${user.email}`
    : null;

  /* ---------- LOAD TASKS WHEN USER CHANGES ---------- */

  useEffect(() => {
    if (!STORAGE_KEY) {
      setTasks([]);
      return;
    }

    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks([]); // new account → clean start
      }
    })();
  }, [STORAGE_KEY]);

  /* ---------- SAVE TASKS ---------- */

  useEffect(() => {
    if (STORAGE_KEY) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, STORAGE_KEY]);

  /* ---------- CLOCK ---------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /* ---------- CRUD ---------- */

  const addTask = task => {
    setTasks(prev => [
      {
        ...task,
        id: Date.now(),
        title: task.title.toUpperCase(),
        date:
          typeof task.date === 'string'
            ? task.date
            : formatDateLocal(task.date),
      },
      ...prev,
    ]);
  };

  const updateTask = updated => {
    setTasks(prev =>
      prev.map(t =>
        t.id === updated.id
          ? { ...updated, title: updated.title.toUpperCase() }
          : t,
      ),
    );
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = id => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  /* ---------- DATE BASE ---------- */

  const today = formatDateLocal(now);
  const tomorrowDate = formatDateLocal(
    new Date(now.getTime() + 86400000),
  );

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  /* ---------- GROUPS ---------- */

  const todayTasks = tasks
    .filter(t => t.date === today && !t.completed)
    .sort(
      (a, b) =>
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime),
    );

  const tomorrowTasks = tasks
    .filter(t => t.date === tomorrowDate && !t.completed)
    .sort(
      (a, b) =>
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime),
    );

  // tomorrow included in upcoming
  const upcomingTasks = tasks
    .filter(t => t.date > today && !t.completed)
    .sort((a, b) => {
      if (a.date !== b.date)
        return a.date.localeCompare(b.date);
      return (
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime)
      );
    });

  const completedTasks = tasks
    .filter(t => t.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  const startingSoon = tasks
    .filter(t => {
      if (t.completed || t.date !== today) return false;
      const diff =
        timeToMinutes(t.fromTime) - currentMinutes;
      return diff >= 0 && diff <= 60;
    })
    .sort(
      (a, b) =>
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime),
    );

  const overdueTasks = tasks
    .filter(t => {
      if (t.completed) return false;
      if (t.date < today) return true;
      if (t.date === today)
        return (
          timeToMinutes(t.fromTime) < currentMinutes
        );
      return false;
    })
    .map(t => ({ ...t, overdue: true }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const reminderTasks = tasks
    .filter(t => {
      if (t.completed || t.date !== today) return false;
      const diff = timeToMinutes(t.fromTime) - currentMinutes;
      return diff >= -30 && diff <= 120;
    })
    .sort(
      (a, b) =>
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime),
    );

  /* ---------- STATS ---------- */

  const total = tasks.length;
  const completed = completedTasks.length;
  const pending = total - completed;
  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const allTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.date !== b.date)
        return a.date.localeCompare(b.date);
      return (
        timeToMinutes(a.fromTime) -
        timeToMinutes(b.fromTime)
      );
    });

  return (
    <TasksContext.Provider
      value={{
        tasks,
        allTasks,
        todayTasks,
        tomorrowTasks,
        upcomingTasks,
        completedTasks,
        overdueTasks,
        startingSoon,
        reminderTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        total,
        completed,
        pending,
        progress,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);

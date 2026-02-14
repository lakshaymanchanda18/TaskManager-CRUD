import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksContext = createContext();

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

const normalizeTask = task => {
  const isAllDay = !!task?.allDay;
  return {
    ...task,
    allDay: isAllDay,
    fromTime: isAllDay ? '' : task?.fromTime || '',
    toTime: isAllDay ? '' : task?.toTime || '',
  };
};

const sortByDateTime = (a, b) => {
  if (a.date !== b.date) {
    return a.date.localeCompare(b.date);
  }
  if (a.allDay && !b.allDay) return -1;
  if (!a.allDay && b.allDay) return 1;
  return timeToMinutes(a.fromTime) - timeToMinutes(b.fromTime);
};

export const TasksProvider = ({ children, user }) => {
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(new Date());

  const STORAGE_KEY = user ? `@TASKS_APP_DATA_${user.email}` : null;

  useEffect(() => {
    if (!STORAGE_KEY) {
      setTasks([]);
      return;
    }

    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTasks(Array.isArray(parsed) ? parsed.map(normalizeTask) : []);
      } else {
        setTasks([]);
      }
    })();
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (STORAGE_KEY) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, STORAGE_KEY]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const addTask = task => {
    const normalized = normalizeTask(task);
    setTasks(prev => [
      {
        ...normalized,
        id: Date.now(),
        title: normalized.title.toUpperCase(),
        date:
          typeof normalized.date === 'string'
            ? normalized.date
            : formatDateLocal(normalized.date),
      },
      ...prev,
    ]);
  };

  const updateTask = updated => {
    const normalized = normalizeTask(updated);
    setTasks(prev =>
      prev.map(t =>
        t.id === normalized.id
          ? { ...normalized, title: normalized.title.toUpperCase() }
          : t
      )
    );
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = id => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const today = formatDateLocal(now);
  const tomorrowDate = formatDateLocal(new Date(now.getTime() + 86400000));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayTasks = tasks.filter(t => t.date === today && !t.completed).sort(sortByDateTime);

  const tomorrowTasks = tasks
    .filter(t => t.date === tomorrowDate && !t.completed)
    .sort(sortByDateTime);

  const upcomingTasks = tasks.filter(t => t.date > today && !t.completed).sort(sortByDateTime);

  const completedTasks = tasks
    .filter(t => t.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  const startingSoon = tasks
    .filter(t => {
      if (t.completed || t.date !== today || t.allDay) return false;
      const diff = timeToMinutes(t.fromTime) - currentMinutes;
      return diff >= 0 && diff <= 60;
    })
    .sort(sortByDateTime);

  const overdueTasks = tasks
    .filter(t => {
      if (t.completed) return false;
      if (t.date < today) return true;
      if (t.date === today) {
        if (t.allDay) return false;
        return timeToMinutes(t.fromTime) < currentMinutes;
      }
      return false;
    })
    .map(t => ({ ...t, overdue: true }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const reminderTasks = tasks
    .filter(t => {
      if (t.completed || t.date !== today || t.allDay) return false;
      const diff = timeToMinutes(t.fromTime) - currentMinutes;
      return diff >= -30 && diff <= 120;
    })
    .sort(sortByDateTime);

  const total = tasks.length;
  const completed = completedTasks.length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const allTasks = tasks.filter(t => !t.completed).sort(sortByDateTime);

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

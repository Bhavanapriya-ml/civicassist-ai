import React, { createContext, useContext, useState } from 'react';
import { DEMO_GRIEVANCES, DEMO_USERS } from '../data/demoData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth state — demo only, not connected to any real auth service
  const [currentUser, setCurrentUser] = useState(null);
  const [grievances, setGrievances] = useState(DEMO_GRIEVANCES);

  const login = (email, password) => {
    const user = DEMO_USERS.find(u => u.email === email);
    if (user && password === 'demo1234') {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials. Use demo credentials shown on the login page.' };
  };

  const logout = () => setCurrentUser(null);

  const submitGrievance = (data) => {
    const newGrievance = {
      id: `GRV-${Date.now()}`,
      ...data,
      status: 'Open',
      priority: 'Medium',
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          event: 'Grievance submitted',
          description: 'Your complaint has been registered successfully.',
        },
      ],
    };
    setGrievances(prev => [newGrievance, ...prev]);
    return newGrievance;
  };

  const updateGrievanceStatus = (id, status) => {
    setGrievances(prev =>
      prev.map(g =>
        g.id === id
          ? {
              ...g,
              status,
              updatedAt: new Date().toISOString().split('T')[0],
              timeline: [
                ...g.timeline,
                {
                  date: new Date().toISOString().split('T')[0],
                  event: status,
                  description: `Status updated to "${status}" by admin.`,
                },
              ],
            }
          : g
      )
    );
  };

  return (
    <AppContext.Provider
      value={{ currentUser, login, logout, grievances, submitGrievance, updateGrievanceStatus }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

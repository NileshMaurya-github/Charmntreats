import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const AuthDebug = () => {
  const { user, isAdmin, loading } = useAuth();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
      <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
      <div>User Email: {user?.email || 'None'}</div>
      <div>LocalStorage Admin: {localStorage.getItem('isAdmin') || 'None'}</div>
    </div>
  );
};

export default AuthDebug;
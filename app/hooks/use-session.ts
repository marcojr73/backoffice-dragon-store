import { useEffect, useState } from 'react';

type TSession = {
  id: number;
  email: string;
  userName: string;
  is_admin: boolean;
  organizationId: number;
  iat: number;
  exp: number;
};

function useSession() {
  const [session, setSession] = useState<TSession | null>(null);

  function getToken() {
    return localStorage.getItem('accessToken');
  }

  useEffect(() => {
    getSession();
  }, []);

  function getSession() {
    const accessToken = getToken();

    if (!accessToken) return null;

    const parts = accessToken.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    setSession(JSON.parse(jsonPayload));
  }

  return {
    getToken,
    session,
  };
}

export default useSession;

import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { createHash } from 'crypto';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

// types
import { AuthProps } from 'types/auth';
import { SHAContextType } from 'types/auth';
import { s } from 'react-router/dist/development/index-react-server-client-BKpa2trA';

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  token: null,
  timeout: null,       
  tokenExpiry: null  
};

// SHA256 helper functions matching your service
const arrayBufferToHexString = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const sha256UsernamePwd = async (username: string, password: string): Promise<string> => {
  // Check if crypto.subtle is available
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    // throw new Error('Web Crypto API not available in this environment');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${username}_${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToHexString(hash);
};

const sha256AddTimestamp = async (sha256UPStr: string, username: string): Promise<{
  username: string;
  password_encrypted: string;
  timestamp: number;
}> => {
  // Check if crypto.subtle is available
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API not available in this environment');
  }
  
  const timestamp = Math.floor(Date.now() / 1000);
  const encoder = new TextEncoder();
  const data = encoder.encode(`${sha256UPStr}_${timestamp}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const password_encrypted = 'SHA256_T:' + arrayBufferToHexString(hash);
  return { username, password_encrypted, timestamp };
};


const generateSHA256Timestamp = async (username: string, password: string) => {
  const sha256UPStr = await sha256UsernamePwd(username, password);
  return await sha256AddTimestamp(sha256UPStr, username);
};

// Persist token + timeout + expiry; set axios header
const setSession = (serviceToken?: string | null, timeout?: number | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = serviceToken; // no Bearer prefix per service
    if (typeof timeout === 'number') {
      const expiry = Math.floor(Date.now() / 1000) + timeout;
      localStorage.setItem('tokenTimeout', String(timeout));
      localStorage.setItem('tokenExpiry', String(expiry));
    }
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('tokenTimeout');
    localStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common.Authorization;
  }
};

  // // Refresh logic that considers expiry
  // const checkAndRefreshToken = async () => {
  //   const { isLoggedIn, token, tokenExpiry } = useAuth();
  //   try {
  //     console.log('Checking token expiry...');

  //     // console.log('This is context state:', state);

  //     if (!token || !isLoggedIn) return false;

  //     const remaining = getSecondsUntilExpiry(tokenExpiry);
  //     console.log('Seconds until token expiry:', remaining);
  //     // Only attempt refresh when within 5 minutes of expiry
  //     if (remaining <= 30 * 60) {
  //       console.log('Token is expiring soon, refreshing...');
  //       await true;
  //     }
  //   } catch (err) {
  //     console.error('checkAndRefreshToken error:', err);
  //     // If anything goes wrong, logout to be safe
  //     return false;
  //   }
  // };

// ==============================|| SHA CONTEXT & PROVIDER ||============================== //

const SHAContext = createContext<SHAContextType | null>(null);

// Utility: seconds until expiry
const getSecondsUntilExpiry = (expiry?: number | null) => {
  if (!expiry) return 0;
  return expiry - Math.floor(Date.now() / 1000);
};

// Utility: check expiring soon
const isExpiringSoon = (expiry?: number | null, thresholdSeconds = 5 * 60) => {
  const remaining = getSecondsUntilExpiry(expiry);
  return remaining <= thresholdSeconds;
};

export const SHAProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Use a ref to always have the latest state
  const stateRef = useRef(state);
  stateRef.current = state;

  // Use ReturnType to be safe in browser environments
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // const executeRefreshCheck = async () => {
  //   const result = await checkAndRefreshToken();

  //   if (result) {
  //     refreshToken();
  //     console.log('Token refresh successful during periodic check');
  //   } else {  
  //     logout();
  //     console.log('Token refresh not needed or failed during periodic check');
  //   }
  // };
 const checkAndRefreshToken = async () => {
    try {
      const currentState = stateRef.current;
      console.log('Checking token expiry...');
      console.log('This is context state:', currentState);

      if (!currentState.isLoggedIn || !currentState.token) return logout();

      const remaining = getSecondsUntilExpiry(currentState.tokenExpiry);
      console.log('Seconds until token expiry:', remaining);
      if (remaining <= 10800) {
        console.log('Token is expiring soon, refreshing...');
        await refreshToken();
      }
    } catch (err) {
      console.error('checkAndRefreshToken error:', err);
      logout();
    }
  };

  const startRefreshInterval = () => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    // Check every minute
    refreshIntervalRef.current = setInterval(checkAndRefreshToken, 60 * 1000);
  };

  const stopRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        const storedTimeout = localStorage.getItem('tokenTimeout');
        const storedExpiry = localStorage.getItem('tokenExpiry');

        if (serviceToken && storedExpiry) {
          const timeout = storedTimeout ? parseInt(storedTimeout, 10) : null;
          const expiry = parseInt(storedExpiry, 10);
          const now = Math.floor(Date.now() / 1000);

          console.log('Stored token expiry:', expiry, 'Current time:', now);
          if (!isNaN(expiry) && now < expiry) {
            setSession(serviceToken, timeout ?? undefined);
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user: { name: 'User' }, // Replace with actual user data if you fetch it on init
                token: serviceToken,
                timeout,
                tokenExpiry: expiry
              }
            });
            startRefreshInterval();
            return;
          } else {
            console.log('Stored token expired');
          }
        }
        setSession(null);
        dispatch({ type: LOGOUT });
      } catch (err) {
        console.error('Init error:', err);
        setSession(null);
        dispatch({ type: LOGOUT });
      }
    };

    init();

    return () => stopRefreshInterval();
  }, []);

  const login = async (name: string, password: string) => {
    const authData = await generateSHA256Timestamp(name, password);

    const resp = await fetch('/bvcsp/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });

    const data = await resp.json();

    if (!data || data.code !== 0 || !data.data?.token || typeof data.data?.timeout !== 'number') {
      throw new Error(`Authentication failed: ${data?.msg || 'Invalid response'}`);
    }

    const serviceToken = data.data.token as string;
    const timeout = data.data.timeout as number; // e.g., 14400
    const tokenExpiry = Math.floor(Date.now() / 1000) + timeout;

    setSession(serviceToken, timeout);

    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          name: 'User'
        },
        token: serviceToken,
        timeout,
        tokenExpiry: tokenExpiry
      }
    });

    console.log('Login successful', state);

    startRefreshInterval();

    return data.data;
  };

  const refreshToken = async (): Promise<string> => {
    const currentToken = state.token || localStorage.getItem('serviceToken');
    if (!currentToken) throw new Error('No token available to refresh');


    const response = await fetch('/bvcsp/v1/auth/refresh', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: currentToken
        },
      body:JSON.stringify({})
    });

    const data = await response.json();

    if (!data || data.code !== 0 || !data.data?.token || typeof data.data?.timeout !== 'number') {
      throw new Error(`Authentication failed: ${data?.msg || 'Invalid response'}`);
    }

    const newServiceToken = data.data.token as string;
    const newTimeout = data.data.timeout as number; // e.g., 14400
    const newTokenExpiry = Math.floor(Date.now() / 1000) + newTimeout;

    setSession(newServiceToken, newTimeout);


    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: state.user,
        token: newServiceToken,
        timeout: newTimeout,
        tokenExpiry: newTokenExpiry
      }
    });

    return newServiceToken;
  };

  const logout = () => {
    stopRefreshInterval();
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  // Loader while initializing (assumes reducer sets isInitialized true on LOGIN/LOGOUT)
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <SHAContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </SHAContext.Provider>
  );
};

export default SHAContext;

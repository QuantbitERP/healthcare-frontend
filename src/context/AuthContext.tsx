"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { setupFetchInterceptor } from "@/utils/fetchInterceptor";

interface AuthContextType {
  isAuthenticated: boolean;
  apiKey: string | null;
  apiSecret: string | null;
  posProfile: string | null;
  currentUser: string | null;
  setPosProfile: (profile: string) => void;
  login: (apiKey: string, apiSecret: string) => void;
  loginWithSession: (user: string, apiKey?: string, apiSecret?: string) => void;
  logout: () => void;
  checkOpenPOS: (posProfile: string, user: string) => Promise<boolean>;
  checkAnyOpenPOS: (posProfile: string) => Promise<{ isOpen: boolean; entryName?: string; userName?: string } | null>;
  getCurrentUser: () => Promise<string | null>;
  isInitialized: boolean;
  csrfToken: string | null;
  checkUserRole: (roleName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { checkFrappeSession, getAuthHeaders, setSessionAuthPreference } from "@/utils/sessionAuth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [posProfile, setPosProfile] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  // Ref mirrors isAuthenticated so the visibilitychange listener (registered
  // once on mount) always reads the latest value instead of a stale closure.
  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Setup global fetch interceptor to handle auth systemically.
      setupFetchInterceptor();

      // Check localStorage for existing authentication data.
      const storedApiKey = localStorage.getItem("apiKey");
      const storedApiSecret = localStorage.getItem("apiSecret");
      const storedPosProfile = localStorage.getItem("posProfile");
      const storedUser = localStorage.getItem("currentUser");
      const storedCsrfToken = localStorage.getItem('csrfToken');

      const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;

      if (storedPosProfile) {
        setPosProfile(storedPosProfile);
      }
      if (storedUser) {
        setCurrentUser(storedUser);
      }
      if (storedCsrfToken) {
        setCsrfToken(storedCsrfToken);
      }

      // First, always try to check for an active Frappe session (prioritize session over localStorage)
      try {
        console.log("AuthContext: Checking for active Frappe session...");
        const sessionUser = await checkFrappeSession();

        if (sessionUser && sessionUser.user) {
          console.log("AuthContext: Active Frappe session found for user:", sessionUser.user);

          // If the Frappe session user is DIFFERENT than the Next.js stored user -> SWITCH USER
          if (storedUser && sessionUser.user !== storedUser) {
            console.log(`User changed on mount from ${storedUser} to ${sessionUser.user}. Clearing old data...`);
            const { clearAllCache } = await import("@/api/api");
            clearAllCache();
            setPosProfile(null);
            localStorage.removeItem("posProfile");
          }

          // If session is found, try to get API keys
          if (sessionUser.api_key && sessionUser.api_secret && !isMasked(sessionUser.api_secret)) {
            console.log("AuthContext: Session found with valid API keys!");
            setApiKey(sessionUser.api_key);
            setApiSecret(sessionUser.api_secret);
            setCurrentUser(sessionUser.user);
            setIsAuthenticated(true);
            localStorage.setItem("apiKey", sessionUser.api_key);
            localStorage.setItem("apiSecret", sessionUser.api_secret);
            localStorage.setItem("currentUser", sessionUser.user);
            setSessionAuthPreference(false);
          } else {
            console.log("AuthContext: Session found but API keys are missing or masked, attempting to generate...");
            setCurrentUser(sessionUser.user);
            setIsAuthenticated(true);
            localStorage.setItem("currentUser", sessionUser.user);

            // Clear any invalid or masked secrets from localStorage
            localStorage.removeItem("apiKey");
            localStorage.removeItem("apiSecret");
            setApiKey(null);
            setApiSecret(null);

            // Try to generate new API keys for the user
            try {
              const { getApiKeys } = await import("@/utils/sessionAuth");
              const newKeys = await getApiKeys(sessionUser.user);
              if (newKeys && newKeys.api_key && newKeys.api_secret && !isMasked(newKeys.api_secret)) {
                console.log("AuthContext: Successfully generated new API keys!");
                setApiKey(newKeys.api_key);
                setApiSecret(newKeys.api_secret);
                localStorage.setItem("apiKey", newKeys.api_key);
                localStorage.setItem("apiSecret", newKeys.api_secret);
                localStorage.removeItem("useSessionAuth");
              } else {
                setSessionAuthPreference(true);
              }
            } catch (error) {
              console.error("AuthContext: Failed to generate API keys", error);
              setSessionAuthPreference(true);
            }

            // Refresh CSRF token
            const { getFrappeCSRFToken } = await import("@/utils/sessionAuth");
            const token = await getFrappeCSRFToken();
            if (token) {
              setCsrfToken(token);
              localStorage.setItem('csrfToken', token);
            }
          }
        } else {
          console.log("AuthContext: No active Frappe session found.");
          if (storedUser) {
            console.log("Frappe is logged out. Next.js was logged in. Performing full logout...");

            // Clear all storage as requested
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            window.location.href = "/login";
            return;
          }

          // If no session, fall back to localStorage (only if not previously logged out)
          if (storedApiKey && storedApiSecret && !isMasked(storedApiSecret)) {
            console.log("AuthContext: Using stored API keys from localStorage");
            setApiKey(storedApiKey);
            setApiSecret(storedApiSecret);
            setIsAuthenticated(true);

            // Refresh current user if needed
            if (!storedUser) {
              const user = await getCurrentUser(storedApiKey, storedApiSecret);
              if (user) {
                setCurrentUser(user);
                localStorage.setItem("currentUser", user);
              }
            }
          } else {
            console.log("AuthContext: No valid authentication found");
            setSessionAuthPreference(true);
          }
        }
      } catch (error) {
        console.error("AuthContext: Error checking session during init:", error);

        // Fallback to localStorage if session check fails
        if (storedApiKey && storedApiSecret && !isMasked(storedApiSecret)) {
          console.log("AuthContext: Fallback to localStorage API keys");
          setApiKey(storedApiKey);
          setApiSecret(storedApiSecret);
          setIsAuthenticated(true);

          if (!storedUser) {
            const user = await getCurrentUser(storedApiKey, storedApiSecret);
            if (user) {
              setCurrentUser(user);
              localStorage.setItem("currentUser", user);
            }
          }
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // NOTE: A `beforeunload` handler that cleared apiKey/apiSecret/csrfToken
    // from localStorage used to live here. It was removed because
    // `beforeunload` fires on ordinary page reloads, some client-side
    // navigations, and tab backgrounding on mobile — not just real tab
    // closes. That meant the tokens this effect just wrote to localStorage
    // were being wiped moments later, so on the next load `initializeAuth`
    // found nothing and the user appeared logged out immediately after
    // logging in. Sensitive data is cleared explicitly in `logout()`
    // instead, which is the only place that should do it.

    // Add visibility change handler to re-check session when tab becomes visible
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log("AuthContext: Tab became visible, verifying active session...");

        try {
          const { checkFrappeSession } = await import("@/utils/sessionAuth");
          const sessionUser = await checkFrappeSession();

          const currentStoredUser = localStorage.getItem("currentUser");

          // If the Frappe session is dead, but we were logged in -> FULL LOGOUT
          if (!sessionUser || !sessionUser.user) {
            if (isAuthenticatedRef.current) {
              console.log("Session died in background. Performing full logout...");
              localStorage.clear();
              sessionStorage.clear();
              document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
              });
              window.location.href = "/login";
            }
            return;
          }

          // If the Frappe session user is DIFFERENT than the Next.js user -> SWITCH USER
          if (sessionUser.user && sessionUser.user !== currentStoredUser) {
            console.log(`User changed from ${currentStoredUser} to ${sessionUser.user}. Re-authenticating...`);

            // First, clear the old user's cache so the new user doesn't see it!
            const { clearAllCache } = await import("@/api/api");
            clearAllCache();

            // Wipe old POS profile so new user has to select their own
            setPosProfile(null);
            localStorage.removeItem("posProfile");

            setCurrentUser(sessionUser.user);
            setIsAuthenticated(true);
            localStorage.setItem("currentUser", sessionUser.user);

            // Grab new API keys for the new user
            const { getApiKeys } = await import("@/utils/sessionAuth");
            const newKeys = await getApiKeys(sessionUser.user);
            const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;

            if (newKeys && newKeys.api_key && newKeys.api_secret && !isMasked(newKeys.api_secret)) {
              setApiKey(newKeys.api_key);
              setApiSecret(newKeys.api_secret);
              localStorage.setItem("apiKey", newKeys.api_key);
              localStorage.setItem("apiSecret", newKeys.api_secret);
              localStorage.removeItem("useSessionAuth");
            } else {
              setSessionAuthPreference(true);
            }

            // Refresh CSRF token
            const { getFrappeCSRFToken } = await import("@/utils/sessionAuth");
            const token = await getFrappeCSRFToken();
            if (token) {
              setCsrfToken(token);
              localStorage.setItem('csrfToken', token);
            }
          }
        } catch (e) {
          console.error("Visibility check failed", e);
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const login = useCallback((apiKey: string, apiSecret: string) => {
    setApiKey(apiKey);
    setApiSecret(apiSecret);
    setIsAuthenticated(true);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);
    setSessionAuthPreference(false); // Clear session auth flag when using API keys

    // Fetch current user after login
    getCurrentUser(apiKey, apiSecret).then((user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", user);
      }
    });

    // Also refresh the CSRF token so write requests made right after login
    // (before any session-based flow has run) have a valid token available.
    (async () => {
      try {
        const { getFrappeCSRFToken } = await import("@/utils/sessionAuth");
        const token = await getFrappeCSRFToken();
        if (token) {
          setCsrfToken(token);
          localStorage.setItem('csrfToken', token);
        }
      } catch (error) {
        console.error("AuthContext: Error fetching CSRF token after login:", error);
      }
    })();
  }, []);

  const loginWithSession = useCallback((user: string, apiKey?: string, apiSecret?: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", user);

    if (apiKey && apiSecret) {
      setApiKey(apiKey);
      setApiSecret(apiSecret);
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("apiSecret", apiSecret);
      localStorage.removeItem("useSessionAuth"); // Clear session auth flag when using API keys
    } else {
      // If no API keys provided, we'll rely on session-based authentication
      console.log("Session-based authentication for user:", user);
      setSessionAuthPreference(true);
    }
  }, []);

  const logout = useCallback(() => {
    setApiKey(null);
    setApiSecret(null);
    setPosProfile(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCsrfToken(null);

    // Clear all authentication-related localStorage items
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    localStorage.removeItem("posProfile");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("csrfToken");
    setSessionAuthPreference(false);

    // Clear all Frappe API cache from localStorage
    const cacheKeys = [
      "frappe_cache_warehouses",
      "frappe_cache_branches",
      "frappe_cache_kits",
      "frappe_cache_classifications",
      "frappe_cache_customers",
      "frappe_cache_companies",
      "frappe_cache_departments",
      "frappe_cache_local_branches",
      "frappe_cache_sub_departments",
      "frappe_cache_doctors",
      "frappe_cache_timestamp",
    ];
    cacheKeys.forEach((key) => localStorage.removeItem(key));
    console.log("Cache and auth data cleared on logout");

    router.push("/login");
  }, [router]);

  const getCurrentUser = useCallback(async (key?: string, secret?: string): Promise<string | null> => {
    try {
      const authKey = key || apiKey;
      const authSecret = secret || apiSecret;

      // Use session-based authentication if no API keys available
      if (!authKey || !authSecret) {
        console.log("Using session-based authentication for getCurrentUser");
        try {
          const { checkFrappeSession } = await import("@/utils/sessionAuth");
          const sessionUser = await checkFrappeSession();
          return sessionUser?.user || null;
        } catch (error) {
          console.error("Error getting current user with session:", error);
          return null;
        }
      }

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(
        "https://gmcerp.quantcloud.in/api/method/frappe.auth.get_logged_user",
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }, [apiKey, apiSecret]);

  const checkOpenPOS = useCallback(async (posProfile: string, user: string): Promise<boolean> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(
        `https://gmcerp.quantcloud.in/api/resource/Opening Entry?filters=[["pos_profile","=","${posProfile}"],["status","=","Open"],["user","=","${user}"]]`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      const responseData = await response.json();
      if (response.ok && responseData.data && responseData.data.length > 0) {
        return true; // Open Opening Entry exists for this user and profile
      }
      return false; // No open Opening Entry
    } catch (error) {
      console.error("Error checking Opening Entry:", error);
      return false; // Treat errors as no open entry
    }
  }, []);

  const checkAnyOpenPOS = useCallback(async (posProfile: string): Promise<{ isOpen: boolean; entryName?: string; userName?: string } | null> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(
        `https://gmcerp.quantcloud.in/api/resource/Opening Entry?filters=[["pos_profile","=","${posProfile}"],["status","=","Open"]]&fields=["name","user"]`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      const responseData = await response.json();
      console.log("checkAnyOpenPOS API response:", responseData); // Debug log
      if (response.ok && responseData.data && responseData.data.length > 0) {
        const openEntry = responseData.data[0];
        console.log("Found open Opening Entry:", openEntry); // Debug log
        return {
          isOpen: true,
          entryName: openEntry.name,
          userName: openEntry.user,
        };
      }
      console.log("No open Opening Entries found"); // Debug log
      return { isOpen: false }; // No open Opening Entry
    } catch (error) {
      console.error("Error checking any open Opening Entry:", error);
      return null; // Treat errors as null
    }
  }, []);

  const checkUserRole = useCallback(async (roleName: string): Promise<boolean> => {
    try {
      if (!currentUser) {
        console.warn("Missing current user for role check");
        return false;
      }

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(
        `https://gmcerp.quantcloud.in/api/resource/User/${currentUser}?fields=["name","roles"]`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Error fetching user roles:", response.status);
        return false;
      }

      const data = await response.json();
      const userRoles = data.data?.roles || [];

      // Check if user has the specified role
      const hasRole = userRoles.some((role: any) => role.role === roleName);
      console.log(`User ${currentUser} has role ${roleName}:`, hasRole);

      return hasRole;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }, [currentUser]);

  const setPosProfileHandler = useCallback((profile: string) => {
    setPosProfile(profile);
    localStorage.setItem("posProfile", profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        apiKey,
        apiSecret,
        posProfile,
        currentUser,
        setPosProfile: setPosProfileHandler,
        login,
        loginWithSession,
        logout,
        checkOpenPOS,
        checkAnyOpenPOS,
        getCurrentUser,
        isInitialized,
        csrfToken,
        checkUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
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



import { checkFrappeSession, getAuthHeaders } from "@/utils/sessionAuth";

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

  useEffect(() => {
    const initializeAuth = async () => {
      // Setup global fetch interceptor to handle auth systemiclyaries.
      setupFetchInterceptor();

      // Check localStorage for existing authentication dataaries.
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

      if (storedApiKey && storedApiSecret && !isMasked(storedApiSecret)) {
        setApiKey(storedApiKey);
        setApiSecret(storedApiSecret);
        setIsAuthenticated(true);
        setIsInitialized(true);

        // Refresh current user if needed
        if (!storedUser) {
          const user = await getCurrentUser(storedApiKey, storedApiSecret);
          if (user) {
            setCurrentUser(user);
            localStorage.setItem("currentUser", user);
          }
        }
      } else {
        // Try to check for an active Frappe session if no keys in localStorage
        try {
          console.log("AuthContext: No keys in localStorage, checking for active session...");
          const sessionUser = await checkFrappeSession();

          if (sessionUser && sessionUser.user) {
            if (sessionUser.api_key && sessionUser.api_secret && !isMasked(sessionUser.api_secret)) {
              console.log("AuthContext: Session found with valid API keys!");
              setApiKey(sessionUser.api_key);
              setApiSecret(sessionUser.api_secret);
              setCurrentUser(sessionUser.user);
              setIsAuthenticated(true);
              localStorage.setItem("apiKey", sessionUser.api_key);
              localStorage.setItem("apiSecret", sessionUser.api_secret);
              localStorage.setItem("currentUser", sessionUser.user);
            } else {
              console.warn("AuthContext: Session found but API keys are missing or masked for user:", sessionUser.user);
              setCurrentUser(sessionUser.user);
              setIsAuthenticated(true);
              localStorage.setItem("currentUser", sessionUser.user);

              // Clear any invalid or masked secrets from localStorage
              localStorage.removeItem("apiKey");
              localStorage.removeItem("apiSecret");
              setApiKey(null);
              setApiSecret(null);
              
              // Try to generate new API keys for the user
              console.log("AuthContext: Attempting to generate new API keys...");
              try {
                const { getApiKeys } = await import("@/utils/sessionAuth");
                const newKeys = await getApiKeys(sessionUser.user);
                if (newKeys && newKeys.api_key && newKeys.api_secret && !isMasked(newKeys.api_secret)) {
                  console.log("AuthContext: Successfully generated new API keys!");
                  setApiKey(newKeys.api_key);
                  setApiSecret(newKeys.api_secret);
                  localStorage.setItem("apiKey", newKeys.api_key);
                  localStorage.setItem("apiSecret", newKeys.api_secret);
                } else {
                  console.warn("AuthContext: Failed to generate valid API keys");
                }
              } catch (error) {
                console.error("AuthContext: Error generating API keys:", error);
                // Force session-based authentication as fallback
                console.log("AuthContext: Forcing session-based authentication as fallback");
                localStorage.setItem("useSessionAuth", "true");
                setApiKey(null);
                setApiSecret(null);
                setCurrentUser(sessionUser.user);
                setIsAuthenticated(true);
                localStorage.setItem("currentUser", sessionUser.user);
                return;
              }

              // If we reach here, API keys failed but we have a session - use session auth
              if (sessionUser.user) {
                console.log("AuthContext: Using session-based authentication due to API key failure");
                localStorage.setItem("useSessionAuth", "true");
                setApiKey(null);
                setApiSecret(null);
                setCurrentUser(sessionUser.user);
                setIsAuthenticated(true);
                localStorage.setItem("currentUser", sessionUser.user);
                return;
              }
            }

            // Always try to refresh CSRF token if we have a session
            const { getFrappeCSRFToken } = await import("@/utils/sessionAuth");
            const token = await getFrappeCSRFToken();
            if (token) {
              setCsrfToken(token);
              localStorage.setItem('csrfToken', token);
            }
          } else {
            console.log("AuthContext: No active session found.");
          }
        } catch (error) {
          console.error("AuthContext: Error checking session during init:", error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = (apiKey: string, apiSecret: string) => {
    setApiKey(apiKey);
    setApiSecret(apiSecret);
    setIsAuthenticated(true);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);
    // Fetch current user after login
    getCurrentUser(apiKey, apiSecret).then((user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", user);
      }
    });
  };

  const loginWithSession = (user: string, apiKey?: string, apiSecret?: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", user);

    if (apiKey && apiSecret) {
      setApiKey(apiKey);
      setApiSecret(apiSecret);
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("apiSecret", apiSecret);
    } else {
      // If no API keys provided, we'll rely on session-based authentication
      console.log("Session-based authentication for user:", user);
    }
  };

  const logout = () => {
    setApiKey(null);
    setApiSecret(null);
    setPosProfile(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    localStorage.removeItem("posProfile");
    localStorage.removeItem("currentUser");

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
    console.log("Cache cleared on logout");

    router.push("/login");
  };

  const getCurrentUser = async (key?: string, secret?: string): Promise<string | null> => {
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
        "https://192.168.7.221:4422/api/method/frappe.auth.get_logged_user",
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
  };

  const checkOpenPOS = async (posProfile: string, user: string): Promise<boolean> => {
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
        `https://192.168.7.221:4422/api/resource/POS Opening Entry?filters=[["pos_profile","=","${posProfile}"],["status","=","Open"],["user","=","${user}"]]`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      const responseData = await response.json();
      if (response.ok && responseData.data && responseData.data.length > 0) {
        return true; // Open POS Opening Entry exists for this user and profile
      }
      return false; // No open POS Opening Entry
    } catch (error) {
      console.error("Error checking POS Opening Entry:", error);
      return false; // Treat errors as no open entry
    }
  };

  const checkAnyOpenPOS = async (posProfile: string): Promise<{ isOpen: boolean; entryName?: string; userName?: string } | null> => {
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
        `https://192.168.7.221:4422/api/resource/POS Opening Entry?filters=[["pos_profile","=","${posProfile}"],["status","=","Open"]]&fields=["name","user"]`,
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
        console.log("Found open POS entry:", openEntry); // Debug log
        return {
          isOpen: true,
          entryName: openEntry.name,
          userName: openEntry.user,
        };
      }
      console.log("No open POS entries found"); // Debug log
      return { isOpen: false }; // No open POS Opening Entry
    } catch (error) {
      console.error("Error checking any open POS Opening Entry:", error);
      return null; // Treat errors as null
    }
  };

  const checkUserRole = async (roleName: string): Promise<boolean> => {
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
        `https://192.168.7.221:4422/api/resource/User/${currentUser}?fields=["name","roles"]`,
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
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        apiKey,
        apiSecret,
        posProfile,
        currentUser,
        setPosProfile: (profile: string) => {
          setPosProfile(profile);
          localStorage.setItem("posProfile", profile);
        },
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
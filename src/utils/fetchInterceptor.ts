import { FRAPPE_CONFIG } from '@/config/frappe';
import axios from 'axios';

/**
 * Sets up a global fetch interceptor to automatically add Frappe authentication headers
 * and ensure session cookies are sent for all requests to the Frappe backend.ries.
 * This is a systemic fix for 401 Unauthorized issues in legacy code.RIES.
 */
// Utility function to show the auth error popup and redirect
const showAuthErrorPopupAndRedirect = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('auth-error-popup')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-error-popup';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '999999';
    overlay.style.backdropFilter = 'blur(4px)';

    const popup = document.createElement('div');
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '32px';
    popup.style.borderRadius = '16px';
    popup.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    popup.style.maxWidth = '420px';
    popup.style.textAlign = 'center';
    popup.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    const icon = document.createElement('div');
    icon.innerHTML = '⚠️';
    icon.style.fontSize = '56px';
    icon.style.marginBottom = '16px';

    const title = document.createElement('h2');
    title.innerText = 'Authentication Error';
    title.style.margin = '0 0 12px 0';
    title.style.color = '#dc2626';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    
    const message = document.createElement('p');
    message.innerText = 'Your session has expired. You are being redirected to the login page...';
    message.style.color = '#4b5563';
    message.style.fontSize = '16px';
    message.style.lineHeight = '1.6';
    message.style.marginBottom = '24px';

    const timerText = document.createElement('p');
    timerText.style.color = '#6b7280';
    timerText.style.fontSize = '15px';
    timerText.style.fontWeight = '600';

    popup.appendChild(icon);
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(timerText);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    let secondsLeft = 3;
    timerText.innerText = `Redirecting in ${secondsLeft}s`;

    const interval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            timerText.innerText = `Redirecting in ${secondsLeft}s`;
        } else {
            clearInterval(interval);
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            const loginUrl = window.location.origin + '/pos/login';
            if (window.top) {
                window.top.location.href = loginUrl;
            } else {
                window.location.href = loginUrl;
            }
        }
    }, 1000);
};

export const setupFetchInterceptor = () => {
    if (typeof window === 'undefined') return;

    // Avoid double intercepting
    if ((window as any)._frappeInterceptorSetup) return;
    (window as any)._frappeInterceptorSetup = true;

    const originalFetch = window.fetch;
    const FRAPPE_BASE_URL = FRAPPE_CONFIG.BASE_URL;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        let url = "";
        if (typeof input === "string") {
            url = input;
        } else if (input instanceof URL) {
            url = input.toString();
        } else {
            url = input.url;
        }

        // Check if this is a request to our Frappe backendries.
        if (url.includes(FRAPPE_BASE_URL) || url.includes('103.219.1.138:4430')) {
            const newInit: RequestInit = { ...init };

            // 1. Ensure credentials are included for session cookiesaries.
            if (newInit.credentials === undefined) {
                newInit.credentials = 'include';
            }

            // 2. Setup headersaries.
            const headers = new Headers(newInit.headers || {});

            // 3. Add Authorization header if missing and valid keys exist
            if (!headers.has('Authorization')) {
                const apiKey = localStorage.getItem('apiKey');
                const apiSecret = localStorage.getItem('apiSecret');
                const useSessionAuth = localStorage.getItem('useSessionAuth');
                const isMasked = (secret: string | null) => secret ? secret.includes('***') : false;

                // Only add token auth if not using session auth and keys are valid
                if (!useSessionAuth && apiKey && apiSecret && !isMasked(apiSecret)) {
                    console.log(`[FetchInterceptor] Adding Authorization header for ${url}`);
                    headers.set('Authorization', `token ${apiKey}:${apiSecret}`);
                } else if (useSessionAuth) {
                    console.log(`[FetchInterceptor] Using session-based authentication for ${url}`);
                }
            }

            // 4. Add CSRF token if missingaries.
            if (!headers.has('X-Frappe-CSRF-Token')) {
                const csrfToken = localStorage.getItem('csrfToken');
                if (csrfToken) {
                    headers.set('X-Frappe-CSRF-Token', csrfToken);
                }
            }

            newInit.headers = headers;
            try {
                const response = await originalFetch(input, newInit);
                // Handle 401 Unauthorized directly (DO NOT catch 403 as that may just be a permission error)
                if (response.status === 401) {
                    if (!window.location.pathname.endsWith('/login')) {
                        // If token auth was attached, it might be that the token is invalid/expired while cookie session is still alive.
                        // Try clearing token and retrying with cookie session before failing completely!
                        if (headers.has('Authorization')) {
                            console.warn("[FetchInterceptor] Token auth returned 401, trying fallback to session cookies...");
                            localStorage.removeItem('apiKey');
                            localStorage.removeItem('apiSecret');
                            localStorage.setItem('useSessionAuth', 'true');

                            const retryHeaders = new Headers(newInit.headers || {});
                            retryHeaders.delete('Authorization');
                            newInit.headers = retryHeaders;
                            try {
                                const retryResponse = await originalFetch(input, newInit);
                                if (retryResponse.status !== 401) {
                                    return retryResponse;
                                }
                            } catch (e) {
                                // proceed to popup
                            }
                        }

                        console.log("[FetchInterceptor] Unauthorized response, showing popup and logging out...");
                        showAuthErrorPopupAndRedirect();
                        // Return a never-resolving promise to prevent components from catching the error
                        // and showing their own red box alerts while the popup counts down.
                        return new Promise(() => {}) as unknown as Promise<Response>;
                    }
                }
                return response;
            } catch (error) {
                throw error;
            }
        }

        return originalFetch(input, init);
    };

    // Add Axios interceptor as well
    try {
        if (axios.interceptors && !(window as any)._axiosInterceptorSetup) {
            (window as any)._axiosInterceptorSetup = true;
            axios.interceptors.response.use(
                (response: any) => response,
                (error: any) => {
                    if (error.response && error.response.status === 401) {
                        if (!window.location.pathname.endsWith('/login')) {
                            console.log("[AxiosInterceptor] Unauthorized response, showing popup and logging out...");
                            showAuthErrorPopupAndRedirect();
                            // Return a never-resolving promise to block the component from showing an alert
                            return new Promise(() => {});
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }
    } catch (e) {
        console.log("Axios interceptor setup error:", e);
    }

    console.log("[FetchInterceptor] Frappe Fetch Interceptor initialized");
};

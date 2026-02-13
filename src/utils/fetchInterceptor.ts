import { FRAPPE_CONFIG } from '@/config/frappe';

/**
 * Sets up a global fetch interceptor to automatically add Frappe authentication headers
 * and ensure session cookies are sent for all requests to the Frappe backend.ries.
 * This is a systemic fix for 401 Unauthorized issues in legacy code.RIES.
 */
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
                const isMasked = (secret: string | null) => secret && secret.includes('***');

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
            return originalFetch(input, newInit);
        }

        return originalFetch(input, init);
    };

    console.log("[FetchInterceptor] Frappe Fetch Interceptor initialized");
};

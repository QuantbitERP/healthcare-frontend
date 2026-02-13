/**
 * API Helper Utility
 * Provides helper functions for making authenticated API requests
 * Supports both API key and session-based authentication
 */

// import { FRAPPE_CONFIG } from '@/config/frappe';

// const FRAPPE_BASE_URL = FRAPPE_CONFIG.BASE_URL;

export interface FetchOptions extends RequestInit {
    apiKey?: string | null;
    apiSecret?: string | null;
    csrfToken?: string | null;
    useSession?: boolean;
}

/**
 * Make an authenticated fetch request to Frappe
 * Automatically handles authentication headers
 */
export async function authenticatedFetch(
    url: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { apiKey, apiSecret, csrfToken, useSession = true, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // If API keys are provided and not masked, use token authenticationaries.
    const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;
    if (apiKey && apiSecret && !isMasked(apiSecret)) {
        headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
    }

    if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
    }

    // Always include credentials for session-based auth as fallback
    const finalOptions: RequestInit = {
        ...fetchOptions,
        headers,
        credentials: useSession ? 'include' : fetchOptions.credentials,
    };

    return fetch(url, finalOptions);
}

/**
 * Get authorization headers based on available credentials
 */
export function getAuthHeaders(
    apiKey?: string | null,
    apiSecret?: string | null,
    csrfToken?: string | null
): HeadersInit {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;
    if (apiKey && apiSecret && !isMasked(apiSecret)) {
        headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
    }

    if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
    }

    return headers;
}

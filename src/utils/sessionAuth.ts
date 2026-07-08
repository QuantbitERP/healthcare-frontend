/**
 * Session Authentication Utility
 * This utility checks if a user is already logged in to the Frappe site
 * and retrieves their session information
 */

import { FRAPPE_CONFIG } from '@/config/frappe';

const FRAPPE_BASE_URL = FRAPPE_CONFIG.BASE_URL;

export function setSessionAuthPreference(enabled: boolean) {
    if (typeof window === "undefined") return;

    try {
        if (enabled) {
            window.localStorage.setItem("useSessionAuth", "true");
        } else {
            window.localStorage.removeItem("useSessionAuth");
        }
    } catch (error) {
        console.warn("Unable to persist useSessionAuth preference:", error);
    }
}

export function getSessionAuthPreference(): boolean {
    if (typeof window === "undefined") return false;

    try {
        return window.localStorage.getItem("useSessionAuth") === "true";
    } catch (error) {
        console.warn("Unable to read useSessionAuth preference:", error);
        return false;
    }
}

export interface SessionUser {
    user: string;
    api_key?: string;
    api_secret?: string;
}

/**
 * Check if user has an active session on the Frappe site
 * This function makes a request to the Frappe site to check the current session
 */
export async function checkFrappeSession(): Promise<SessionUser | null> {
    try {
        console.log("=== Checking Frappe Session ===");

        // First, try to get the current logged-in user
        const response = await fetch(
            `${FRAPPE_BASE_URL}/api/method/frappe.auth.get_logged_user`,
            {
                method: "GET",
                credentials: "include", // Important: include cookies for session
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                // Ensure cookies are sent across contexts
            }
        );

        if (!response.ok) {
            console.log("No active Frappe session found - Response status:", response.status);
            return null;
        }

        const data = await response.json();
        const user = data.message;

        // If user is "Guest", they're not logged in
        if (!user || user === "Guest") {
            console.log("User is Guest, no active session");
            return null;
        }

        console.log("✓ Active Frappe session found for user:", user);

        // Try to get API keys for this user
        console.log("Fetching API keys...");
        const apiKeysData = await getApiKeys(user);

        if (!apiKeysData || !apiKeysData.api_key || !apiKeysData.api_secret) {
            console.warn("⚠ Could not retrieve API keys for user:", user);
            console.warn("The user may not have permission to generate API keys");
            console.warn("Please ensure the user has API keys generated in Frappe");

            // Return user info even without API keys
            // The app will need to handle this case
            return {
                user,
                api_key: undefined,
                api_secret: undefined,
            };
        }

        console.log("✓ Successfully retrieved API keys");
        return {
            user,
            api_key: apiKeysData.api_key,
            api_secret: apiKeysData.api_secret,
        };
    } catch (error) {
        console.error("Error checking Frappe session:", error);
        return null;
    }
}

/**
 * Get API keys for the current session user
 */
export async function getApiKeys(user: string): Promise<{ api_key: string; api_secret: string } | null> {
    try {
        console.log("Attempting to fetch API keys for user:", user);

        // Try to fetch existing API keys
        const response = await fetch(
            `${FRAPPE_BASE_URL}/api/resource/User/${user}?fields=["api_key","api_secret"]`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.log("Could not fetch API keys, status:", response.status, "- attempting to generate...");
            // Try to generate keys even if fetch failed
            return await generateApiKeys(user);
        }

        const data = await response.json();
        const apiKey = data.data?.api_key;
        const apiSecret = data.data?.api_secret;

        // Frappe masks the secret with '*' characters in API responses.
        // If we see a masked secret, we must generate new keys because masked ones are useless for authentication.
        const isMasked = (secret: string) => secret && secret.includes('***');

        if (apiKey && apiSecret && !isMasked(apiSecret)) {
            console.log("Successfully retrieved existing API keys");
            return { api_key: apiKey, api_secret: apiSecret };
        }

        if (isMasked(apiSecret)) {
            console.warn("Retrieved API secret is masked. Generating new keys...");
        }

        console.log("No valid API keys found in user record, attempting to generate...");
        // If no API keys exist or they're masked, try to generate them
        return await generateApiKeys(user);
    } catch (error) {
        console.error("Error getting API keys:", error);
        // Still try to generate as a last resort
        try {
            return await generateApiKeys(user);
        } catch (genError) {
            console.error("Failed to generate API keys as fallback:", genError);
            return null;
        }
    }
}

/**
 * Generate API keys for the user
 */
async function generateApiKeys(user: string): Promise<{ api_key: string; api_secret: string } | null> {
    try {
        console.log("Attempting to generate new API keys for user:", user);
        
        const response = await fetch(
            `${FRAPPE_BASE_URL}/api/method/frappe.core.doctype.user.user.generate_keys`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user }),
            }
        );

        if (!response.ok) {
            console.error("Failed to generate API keys - Status:", response.status);
            const errorText = await response.text();
            console.error("Error response:", errorText);
            // Fallback to session-based authentication
            setSessionAuthPreference(true);
            return null;
        }

        const data = await response.json();
        
        console.log("API key generation response:", data);
        
        // Check if response has the expected structure
        if (data.message) {
            const apiKey = data.message.api_key;
            const apiSecret = data.message.api_secret;
            
            if (apiKey && apiSecret) {
                console.log("✓ Successfully generated new API keys");
                return {
                    api_key: apiKey,
                    api_secret: apiSecret,
                };
            } else if (apiSecret && !apiKey) {
                console.warn("⚠ Only API secret returned, attempting to get API key from user record...");
                // Sometimes Frappe only returns the secret, we need to fetch the key separately
                // Add a small delay to ensure the API key is saved in the database
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                let retryCount = 0;
                const maxRetries = 3;
                
                while (retryCount < maxRetries) {
                    try {
                        console.log(`Fetching API keys from user record (attempt ${retryCount + 1}/${maxRetries})...`);
                        const userResponse = await fetch(
                            `${FRAPPE_BASE_URL}/api/resource/User/${user}?fields=["api_key","api_secret"]`,
                            {
                                method: "GET",
                                credentials: "include",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            const userApiKey = userData.data?.api_key;
                            const userApiSecret = userData.data?.api_secret;
                            
                            console.log("User record response:", {
                                hasApiKey: !!userApiKey,
                                hasApiSecret: !!userApiSecret,
                                apiKeyPreview: userApiKey ? userApiKey.substring(0, 10) + "..." : "none",
                                apiSecretPreview: userApiSecret ? userApiSecret.substring(0, 10) + "..." : "none"
                            });
                            
                            if (userApiKey && userApiSecret && !userApiSecret.includes('***')) {
                                console.log("✓ Retrieved complete API keys from user record");
                                return {
                                    api_key: userApiKey,
                                    api_secret: userApiSecret,
                                };
                            } else if (userApiKey && userApiSecret && userApiSecret.includes('***')) {
                                console.warn("API secret is still masked, trying regeneration...");
                                // If still masked, try to generate again
                                break;
                            } else if (!userApiKey && userApiSecret) {
                                console.warn("API key still missing, waiting and retrying...");
                                // Wait longer before next retry
                                if (retryCount < maxRetries - 1) {
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                }
                            } else {
                                console.warn("No API keys found in user record");
                                break;
                            }
                        } else {
                            console.error("Failed to fetch user record:", userResponse.status);
                            break;
                        }
                    } catch (fetchError) {
                        console.error(`Error fetching API keys (attempt ${retryCount + 1}):`, fetchError);
                    }
                    
                    retryCount++;
                }
                
                // If all retries failed, try generating keys one more time
                console.log("All retries failed, attempting final API key generation...");
                try {
                    const finalResponse = await fetch(
                        `${FRAPPE_BASE_URL}/api/method/frappe.core.doctype.user.user.generate_keys`,
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user }),
                        }
                    );
                    
                    if (finalResponse.ok) {
                        const finalData = await finalResponse.json();
                        console.log("Final generation response:", finalData);
                        
                        if (finalData.message?.api_secret) {
                            // Wait one more time and fetch the complete keys
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            const finalUserResponse = await fetch(
                                `${FRAPPE_BASE_URL}/api/resource/User/${user}?fields=["api_key","api_secret"]`,
                                {
                                    method: "GET",
                                    credentials: "include",
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                            
                            if (finalUserResponse.ok) {
                                const finalUserData = await finalUserResponse.json();
                                if (finalUserData.data?.api_key && finalUserData.data?.api_secret && !finalUserData.data.api_secret.includes('***')) {
                                    console.log("✓ Finally retrieved complete API keys!");
                                    return {
                                        api_key: finalUserData.data.api_key,
                                        api_secret: finalUserData.data.api_secret,
                                    };
                                }
                            }
                        }
                    }
                } catch (finalError) {
                    console.error("Final generation attempt failed:", finalError);
                }
            } else {
                console.error("❌ Missing API key or secret in response");
            }
        } else {
            console.error("❌ Invalid response format from generate_keys:", data);
        }
        
        return null;
    } catch (error) {
        console.error("Error generating API keys:", error);
        return null;
    }
}

/**
 * Redirect to Frappe login page if no session exists
 */
export function redirectToFrappeLogin() {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `${FRAPPE_BASE_URL}/login?redirect-to=${returnUrl}`;
}

/**
 * Get CSRF token from Frappe site
 */
export async function getFrappeCSRFToken(): Promise<string | null> {
    try {
        const response = await fetch(`${FRAPPE_BASE_URL}/`, {
            method: "GET",
            credentials: "include",
        });

        const text = await response.text();
        const match = text.match(/csrf_token\s*=\s*"([^"]+)"/);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    } catch (error) {
        console.error("Error getting CSRF token:", error);
        return null;
    }
}

/**
 * Force regenerate API keys for a user (clear existing and generate new)
 */
export async function forceRegenerateApiKeys(user: string): Promise<{ api_key: string; api_secret: string } | null> {
    try {
        console.log("Force regenerating API keys for user:", user);
        
        // First try to generate new keys (this will invalidate old ones)
        const result = await generateApiKeys(user);
        
        if (result) {
            console.log("✓ Successfully regenerated API keys");
            return result;
        } else {
            console.error("Failed to regenerate API keys");
            return null;
        }
    } catch (error) {
        console.error("Error regenerating API keys:", error);
        return null;
    }
}

/**
 * Get authentication headers for API requests
 * Returns appropriate headers based on whether session-based auth is enabled
 */
export function getAuthHeaders(): HeadersInit {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecret = localStorage.getItem("apiSecret");
    const useSessionAuth = getSessionAuthPreference();
    
    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };
    
    // If session auth is enabled, don't add Authorization header
    if (useSessionAuth) {
        return headers;
    }
    
    // Otherwise use token-based auth if available
    if (apiKey && apiSecret) {
        headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }
    
    return headers;
}

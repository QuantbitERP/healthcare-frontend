/**
 * Test script to verify API key generation and storage
 * This can be run in the browser console to debug authentication issues
 */

import { checkFrappeSession, getApiKeys, forceRegenerateApiKeys } from './sessionAuth';

export async function testApiKeyGeneration() {
    console.log("=== Testing API Key Generation ===");
    
    try {
        // 1. Check current session
        console.log("1. Checking current Frappe session...");
        const session = await checkFrappeSession();
        
        if (!session || !session.user) {
            console.error("❌ No active session found. Please log in first.");
            return null;
        }
        
        console.log("✓ Active session found for user:", session.user);
        
        // 2. Try to get existing API keys
        console.log("2. Checking existing API keys...");
        const existingKeys = await getApiKeys(session.user);
        
        if (existingKeys && existingKeys.api_key && existingKeys.api_secret) {
            console.log("✓ Valid API keys found");
            console.log("API Key:", existingKeys.api_key.substring(0, 10) + "...");
            console.log("API Secret:", existingKeys.api_secret.substring(0, 10) + "...");
            return existingKeys;
        } else {
            console.log("⚠ No valid API keys found, attempting to generate...");
        }
        
        // 3. Force generate new API keys
        console.log("3. Generating new API keys...");
        const newKeys = await forceRegenerateApiKeys(session.user);
        
        if (newKeys && newKeys.api_key && newKeys.api_secret) {
            console.log("✓ Successfully generated new API keys");
            console.log("New API Key:", newKeys.api_key.substring(0, 10) + "...");
            console.log("New API Secret:", newKeys.api_secret.substring(0, 10) + "...");
            
            // 4. Store in localStorage
            localStorage.setItem("test_api_key", newKeys.api_key);
            localStorage.setItem("test_api_secret", newKeys.api_secret);
            localStorage.setItem("test_user", session.user);
            console.log("✓ API keys stored in localStorage with 'test_' prefix");
            
            return newKeys;
        } else {
            console.error("❌ Failed to generate API keys");
            return null;
        }
        
    } catch (error) {
        console.error("❌ Error during API key test:", error);
        return null;
    }
}

export function clearTestApiKeys() {
    localStorage.removeItem("test_api_key");
    localStorage.removeItem("test_api_secret");
    localStorage.removeItem("test_user");
    console.log("✓ Test API keys cleared from localStorage");
}

export function getStoredTestApiKeys() {
    const apiKey = localStorage.getItem("test_api_key");
    const apiSecret = localStorage.getItem("test_api_secret");
    const user = localStorage.getItem("test_user");
    
    if (apiKey && apiSecret && user) {
        console.log("✓ Test API keys found in localStorage");
        console.log("User:", user);
        console.log("API Key:", apiKey.substring(0, 10) + "...");
        console.log("API Secret:", apiSecret.substring(0, 10) + "...");
        return { apiKey, apiSecret, user };
    } else {
        console.log("⚠ No test API keys found in localStorage");
        return null;
    }
}

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
    (window as any).testApiKeyGeneration = testApiKeyGeneration;
    (window as any).clearTestApiKeys = clearTestApiKeys;
    (window as any).getStoredTestApiKeys = getStoredTestApiKeys;
    console.log("🔧 API Key testing functions available in console:");
    console.log("- testApiKeyGeneration()");
    console.log("- clearTestApiKeys()");
    console.log("- getStoredTestApiKeys()");
}

/**
 * Debug Authentication Script
 * Copy and paste this code into the browser console on the POS page
 * to debug API key generation and storage issues
 */

(async function debugAuth() {
    console.log("=== Debug Authentication Script ===");

    // Check current localStorage state
    console.log("1. Current localStorage state:");
    console.log("apiKey:", localStorage.getItem("apiKey") ? localStorage.getItem("apiKey").substring(0, 10) + "..." : "null");
    console.log("apiSecret:", localStorage.getItem("apiSecret") ? localStorage.getItem("apiSecret").substring(0, 10) + "..." : "null");
    console.log("currentUser:", localStorage.getItem("currentUser"));
    console.log("csrfToken:", localStorage.getItem("csrfToken") ? "Set" : "Not set");

    // Function to check if secret is masked
    const isMasked = (secret) => secret && secret.includes('***');

    // Check if current keys are masked
    const currentSecret = localStorage.getItem("apiSecret");
    if (currentSecret && isMasked(currentSecret)) {
        console.log("⚠ Current API secret is MASKED and unusable");
    } else if (currentSecret) {
        console.log("✓ Current API secret appears to be valid");
    }

    // Test API call to check session
    console.log("2. Testing Frappe session...");
    try {
        const sessionResponse = await fetch("https://gmcerp.quantcloud.in/api/method/frappe.auth.get_logged_user", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            const user = sessionData.message;
            console.log("✓ Active session found for user:", user);

            if (user && user !== "Guest") {
                // Try to generate new API keys
                console.log("3. Attempting to generate new API keys...");
                try {
                    const generateResponse = await fetch("https://gmcerp.quantcloud.in/api/method/frappe.core.doctype.user.user.generate_keys", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user }),
                    });

                    if (generateResponse.ok) {
                        const keyData = await generateResponse.json();
                        if (keyData.message && keyData.message.api_key && keyData.message.api_secret) {
                            console.log("✓ Successfully generated new API keys!");
                            console.log("New API Key:", keyData.message.api_key.substring(0, 10) + "...");
                            console.log("New API Secret:", keyData.message.api_secret.substring(0, 10) + "...");

                            // Store the new keys
                            localStorage.setItem("apiKey", keyData.message.api_key);
                            localStorage.setItem("apiSecret", keyData.message.api_secret);
                            localStorage.setItem("currentUser", user);
                            console.log("✓ New API keys stored in localStorage");

                            // Test the new keys
                            console.log("4. Testing new API keys...");
                            const testResponse = await fetch("https://gmcerp.quantcloud.in/api/method/frappe.auth.get_logged_user", {
                                method: "GET",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": `token ${keyData.message.api_key}:${keyData.message.api_secret}`,
                                },
                            });

                            if (testResponse.ok) {
                                console.log("✓ New API keys are working correctly!");
                            } else {
                                console.error("❌ New API keys failed test:", testResponse.status);
                            }
                        } else {
                            console.error("❌ Invalid response format from generate_keys:", keyData);
                        }
                    } else {
                        console.error("❌ Failed to generate API keys:", generateResponse.status);
                        const errorText = await generateResponse.text();
                        console.error("Error details:", errorText);
                    }
                } catch (error) {
                    console.error("❌ Error generating API keys:", error);
                }
            }
        } else {
            console.error("❌ No active session found:", sessionResponse.status);
        }
    } catch (error) {
        console.error("❌ Error checking session:", error);
    }

    console.log("=== Debug Complete ===");
    console.log("💡 Refresh the page after running this script to see if authentication improves");
})();

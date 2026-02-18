/**
 * Direct API Key Fix - Try different approach
 * This script tries to bypass the masked API issue by using session authentication
 */

(async function directFix() {
    console.log("=== Direct API Key Fix ===");

    try {
        // Step 1: Check current session
        console.log("1. Checking current session...");
        const sessionResponse = await fetch("https://192.168.7.221:4422/api/method/frappe.auth.get_logged_user", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!sessionResponse.ok) {
            console.error("❌ No active session found. Please log in first.");
            return;
        }

        const sessionData = await sessionResponse.json();
        const user = sessionData.message;
        console.log("✓ Active session for user:", user);

        // Step 2: Try to get API keys using session auth instead of token auth
        console.log("2. Fetching API keys using session authentication...");
        const userResponse = await fetch(`https://192.168.7.221:4422/api/resource/User/${encodeURIComponent(user)}?fields=["api_key","api_secret"]`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            console.error("❌ Failed to fetch user record:", userResponse.status);
            return;
        }

        const userData = await userResponse.json();
        console.log("User record response:", userData);

        const apiKey = userData.data?.api_key;
        const apiSecret = userData.data?.api_secret;

        // Step 3: If we have an API key but secret is masked, try a different approach
        if (apiKey && (!apiSecret || apiSecret.includes('***'))) {
            console.log("3. API key found but secret is masked. Trying to regenerate with session...");

            // Generate new keys using session authentication
            const generateResponse = await fetch("https://192.168.7.221:4422/api/method/frappe.core.doctype.user.user.generate_keys", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user }),
            });

            if (!generateResponse.ok) {
                console.error("❌ Failed to generate API keys:", generateResponse.status);
                const errorText = await generateResponse.text();
                console.error("Error details:", errorText);
                return;
            }

            const generateData = await generateResponse.json();
            console.log("Generation response:", generateData);

            // Wait for the keys to be saved
            console.log("4. Waiting for keys to be saved...");
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Try to fetch the keys again
            console.log("5. Fetching updated API keys...");
            const updatedUserResponse = await fetch(`https://192.168.7.221:4422/api/resource/User/${encodeURIComponent(user)}?fields=["api_key","api_secret"]`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (updatedUserResponse.ok) {
                const updatedUserData = await updatedUserResponse.json();
                console.log("Updated user record:", updatedUserData);

                const updatedApiKey = updatedUserData.data?.api_key;
                const updatedApiSecret = updatedUserData.data?.api_secret;

                if (updatedApiKey && updatedApiSecret && !updatedApiSecret.includes('***')) {
                    console.log("✅ SUCCESS! Got unmasked API keys");

                    // Store in localStorage
                    localStorage.setItem("apiKey", updatedApiKey);
                    localStorage.setItem("apiSecret", updatedApiSecret);
                    localStorage.setItem("currentUser", user);

                    console.log("✅ API keys stored in localStorage");
                    console.log("API Key:", updatedApiKey.substring(0, 10) + "...");
                    console.log("API Secret:", updatedApiSecret.substring(0, 10) + "...");

                    // Test the keys
                    console.log("6. Testing API keys...");
                    const testResponse = await fetch("https://192.168.7.221:4422/api/method/frappe.auth.get_logged_user", {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `token ${updatedApiKey}:${updatedApiSecret}`,
                        },
                    });

                    if (testResponse.ok) {
                        console.log("🎉 SUCCESS! API keys are working correctly!");
                        console.log("📋 Please refresh the page to apply the changes.");
                        console.log("✨ The authentication issue should now be resolved.");
                    } else {
                        console.error("❌ API keys test failed:", testResponse.status);
                    }

                    return;
                }
            }
        }

        // Step 4: If still masked, try to use session-based authentication as fallback
        console.log("6. API keys still masked. Setting up session-based authentication fallback...");

        // Store session-based authentication info
        localStorage.setItem("currentUser", user);
        localStorage.setItem("useSessionAuth", "true");

        // Clear any existing API keys to force session auth
        localStorage.removeItem("apiKey");
        localStorage.removeItem("apiSecret");

        console.log("✅ Session-based authentication configured");
        console.log("📋 Please refresh the page to apply the changes.");
        console.log("ℹ️ The system will now use session authentication instead of API keys.");

    } catch (error) {
        console.error("❌ Direct fix failed:", error);
    }

    console.log("=== Direct Fix Complete ===");
})();

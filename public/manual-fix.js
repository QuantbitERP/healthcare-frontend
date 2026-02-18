/**
 * Manual API Key Fix Script
 * Run this in the browser console to manually fix the authentication issue
 */

(async function manualFix() {
    console.log("=== Manual API Key Fix ===");

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

        // Step 2: Generate API keys
        console.log("2. Generating API keys...");
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
            return;
        }

        const generateData = await generateResponse.json();
        console.log("Generation response:", generateData);

        // Step 3: Wait and fetch complete keys
        console.log("3. Waiting for keys to be saved...");
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 4: Fetch user record with API keys
        console.log("4. Fetching complete API keys...");
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
        console.log("User record data:", userData);

        const apiKey = userData.data?.api_key;
        const apiSecret = userData.data?.api_secret;

        if (!apiKey || !apiSecret) {
            console.error("❌ API keys not found in user record");
            console.log("Available fields:", Object.keys(userData.data || {}));
            return;
        }

        if (apiSecret.includes('***')) {
            console.error("❌ API secret is still masked");
            return;
        }

        // Step 5: Store in localStorage
        console.log("5. Storing API keys in localStorage...");
        localStorage.setItem("apiKey", apiKey);
        localStorage.setItem("apiSecret", apiSecret);
        localStorage.setItem("currentUser", user);

        console.log("✅ API keys stored successfully!");
        console.log("API Key:", apiKey.substring(0, 10) + "...");
        console.log("API Secret:", apiSecret.substring(0, 10) + "...");

        // Step 6: Test the keys
        console.log("6. Testing API keys...");
        const testResponse = await fetch("https://192.168.7.221:4422/api/method/frappe.auth.get_logged_user", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `token ${apiKey}:${apiSecret}`,
            },
        });

        if (testResponse.ok) {
            console.log("🎉 SUCCESS! API keys are working correctly!");
            console.log("📋 Please refresh the page to apply the changes.");
            console.log("✨ The authentication issue should now be resolved.");
        } else {
            console.error("❌ API keys test failed:", testResponse.status);
        }

    } catch (error) {
        console.error("❌ Manual fix failed:", error);
    }

    console.log("=== Manual Fix Complete ===");
})();

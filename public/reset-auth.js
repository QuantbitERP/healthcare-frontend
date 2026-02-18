// Clear Authentication and Force Session Auth
// Run this in browser console to reset authentication state

console.log('🔄 Clearing authentication state...');

// Clear all auth-related localStorage items
localStorage.removeItem('apiKey');
localStorage.removeItem('apiSecret');
localStorage.removeItem('currentUser');
localStorage.removeItem('csrfToken');

// Force session-based authentication
localStorage.setItem('useSessionAuth', 'true');

console.log('✅ Authentication state cleared');
console.log('🔐 Session-based authentication enabled');
console.log('📋 Refreshing page to apply changes...');

// Refresh the page after a short delay
setTimeout(() => {
    window.location.reload();
}, 1000);

// Test Patient Requisition Authentication
// Run this in browser console to test if the authentication fix works

console.log('🔍 Testing Patient Requisition Authentication...');

// Check current authentication state
const useSessionAuth = localStorage.getItem('useSessionAuth');
const apiKey = localStorage.getItem('apiKey');
const apiSecret = localStorage.getItem('apiSecret');
const currentUser = localStorage.getItem('currentUser');

console.log('📋 Authentication State:');
console.log('- Use Session Auth:', useSessionAuth);
console.log('- API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'null');
console.log('- API Secret:', apiSecret ? `${apiSecret.substring(0, 8)}...` : 'null');
console.log('- Current User:', currentUser);

// Test API call
async function testPatientRequisitionAPI() {
    try {
        console.log('🌐 Testing Patient Requisition API call...');

        const response = await fetch('https://demohims.quantcloud.in/api/resource/Patient%20Requisition?limit_page_length=10', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(useSessionAuth !== 'true' && apiKey && apiSecret ? {
                    'Authorization': `token ${apiKey}:${apiSecret}`
                } : {})
            }
        });

        console.log('📊 Response Status:', response.status);
        console.log('📊 Response OK:', response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API call successful!');
            console.log('📋 Found', data.data?.length || 0, 'requisitions');
            return true;
        } else {
            console.log('❌ API call failed:', response.statusText);
            const errorText = await response.text();
            console.log('📄 Error details:', errorText);
            return false;
        }
    } catch (error) {
        console.error('💥 API call error:', error);
        return false;
    }
}

// Run the test
testPatientRequisitionAPI().then(success => {
    if (success) {
        console.log('🎉 Authentication fix is working! Patient Requisitions should load now.');
    } else {
        console.log('⚠️ Authentication issue persists. Try refreshing the page or running the reset script.');
    }
});

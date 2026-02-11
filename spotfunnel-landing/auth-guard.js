// auth-guard.js
// Protects dashboard routes. Redirects to login if not authenticated.

(async function checkAuth() {
    // Wait for Supabase to be ready if needed, likely it's loaded before this script
    if (typeof supabase === 'undefined') {
        console.error('Supabase client not found. Ensure config.js is loaded.');
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // No active session, redirect to login
        // Store current path to redirect back after login? (Optional enhancement)
        window.location.href = 'login.html';
    } else {
        // Authenticated. 
        // Optional: Check if we are on login page (unlikely if guard is used correctly)
        console.log('✅ Authenticated as:', session.user.email);
    }

    // Listener for auth state changes (e.g. token expiry)
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            window.location.href = 'login.html';
        }
    });
})();

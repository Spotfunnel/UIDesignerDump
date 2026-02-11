// auth-service.js
// Handles Supabase Authentication logic

async function login(email, password) {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    return { data, error };
}

async function logout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    } else {
        console.error('Logout failed:', error);
    }
}

async function getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
}

// Password Reset (Triggers Supabase to send email)
async function resetPassword(email) {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };

    // Ensure URL points to a page handling password updates (e.g. update-password.html)
    // For now, we'll just redirect to login
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password.html',
    });
    return { data, error };
}

// Update Password (logged in or recovery mode)
async function updatePassword(newPassword) {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    return { data, error };
}

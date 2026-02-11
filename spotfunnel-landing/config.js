// Supabase Configuration
// REPLACE these values with your actual project details from the Supabase Dashboard

const SUPABASE_URL = 'https://mskabsnklhprlmzugwbl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Y0DrAtSgyqs6h3cELFUOEg_79CVYEAx';

// Initialize the client
// We explicitly overwrite 'window.supabase' to ensure all scripts verify it as the CLIENT, not the library.
if (window.supabase && window.supabase.createClient) {
    const _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabase = _client;
    // Also set a const for local scope safety in some browsers (optional but good practice)
    var supabase = _client;
} else {
    console.error('Supabase library not loaded or already initialized.');
}

if (!window.supabase) {
    console.error('CRITICAL: Supabase client failed to initialize.');
}

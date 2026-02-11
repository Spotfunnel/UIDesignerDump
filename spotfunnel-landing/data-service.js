// Handles all interactions with Supabase for the SpotFunnel Dashboard

async function getProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*, company_name, company_phone')
        .eq('id', session.user.id)
        .single();

    if (error || !data) return null;
    return data;
}

async function getUserSquadId() {
    const profile = await getProfile();
    return profile?.vapi_squad_id;
}

async function fetchDashboardStats() {
    if (!supabase) return null;
    const squadId = await getUserSquadId();

    const today = new Date().toISOString().split('T')[0];

    // Calls Today
    let query1 = supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`);
    if (squadId) query1 = query1.eq('squad_id', squadId);

    const { count: callsToday, error: err1 } = await query1;

    // Bookings Today
    let query2 = supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('booking_completed', true)
        .gte('created_at', `${today}T00:00:00`);
    if (squadId) query2 = query2.eq('squad_id', squadId);

    const { count: bookingsToday, error: err2 } = await query2;

    // Action Items
    let query3 = supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')
        .eq('booking_completed', false);
    if (squadId) query3 = query3.eq('squad_id', squadId);

    const { count: actionItems, error: err3 } = await query3;

    if (err1 || err2 || err3) {
        console.error('Error fetching stats:', err1, err2, err3);
    }

    return {
        callsToday: callsToday || 0,
        bookingsToday: bookingsToday || 0,
        actionItems: actionItems || 0
    };
}

async function fetchCallHistory(filterType = 'all', limit = 50) {
    if (!supabase) return [];

    // Check if we are in "Mock Mode" for testing
    if (window.MOCK_DATA_MODE) {
        return generateMockCalls(limit);
    }

    const squadId = await getUserSquadId();

    let query = supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (squadId) {
        query = query.eq('squad_id', squadId);
    }

    if (filterType === 'booking') {
        query = query.eq('booking_completed', true);
    } else if (filterType === 'followup') {
        query = query.eq('booking_completed', false);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching history:', error);
        return [];
    }

    // Post-process to map new n8n column names to UI expected fields
    return data.map(call => {
        // Map caller_name -> customer_name for UI compatibility
        const customer_name = call.caller_name || call.customer_name || 'Anonymous';

        // Map date + called at -> created_at for UI time display
        // If we have "date" and "called at", we can combine them or just display them.
        // For existing UI relying on created_at, we might want to fallback or override.
        let created_at = call.created_at;
        if (call.date && call['called at']) {
            // Construct a date string if possible, or just keep created_at as fallback
            // Format: YYYY-MM-DD and HH:mm:ss
            created_at = `${call.date}T${call['called at']}`;
        }

        // Labels logic
        let labels = call.labels || [];
        if (!labels || !labels.length) {
            labels = [];
            if (call.intent) labels.push(call.intent.replace('_', ' '));
            if (call.resolution_status) labels.push(call.resolution_status);
            if (call.booking_status) labels.push(call.booking_status);
            if (call.verified === 'verified') labels.push('Verified Address');
        }

        return {
            ...call,
            customer_name,
            created_at,
            labels
        };
    });
}

async function fetchCallById(id) {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching call:', error);
        return null;
    }

    // Normalize single call response too
    if (data) {
        data.customer_name = data.caller_name || data.customer_name;
        // Don't strictly need to normalize created_at here if only modal uses it, 
        // but consistent with list is good.
    }

    return data;
}

async function deleteCalls(callIds) {
    if (!supabase) return { error: 'No connection' };
    const { data, error } = await supabase
        .from('calls')
        .delete()
        .in('id', callIds);

    return { data, error };
}

// Mock Data Generator for Stress Testing
function generateMockCalls(count) {
    const names = ['Michael Chen', 'Sarah Williams', 'David Smith', 'Emma Brown', 'James Wilson'];
    const reasons = ['Commercial pricing', 'Booking confirmation', 'Site visit request', 'Service inquiry'];

    return Array.from({ length: count }, (_, i) => {
        const isBooked = i % 3 === 0;
        const intent = isBooked ? 'booking_request' : 'inquiry';
        const resolution = isBooked ? 'booked' : 'answered';

        return {
            id: `mock-${i}`,
            created_at: new Date(Date.now() - i * 3600000).toISOString(),
            // Mock new schema names (and alias for UI)
            caller_name: names[i % names.length] + ' ' + (i + 1),
            customer_name: names[i % names.length] + ' ' + (i + 1),
            customer_phone: '04' + Math.floor(10000000 + Math.random() * 90000000),
            duration_seconds: Math.floor(Math.random() * 600) + 30, // 30s to 10m
            duration: `${Math.floor(Math.random() * 10) + 1} min ${Math.floor(Math.random() * 60)} sec`, // Mock pretty duration
            recording_url: 'https://vapi-recordings.s3.amazonaws.com/demo.mp3', // Dummy
            labels: [intent.replace('_', ' '), resolution, isBooked ? 'Verified Address' : null].filter(Boolean),
            cost: (Math.random() * 2).toFixed(2),
            transcript: "This is a dummy transcript for testing the modal and scroll performance...",
            summary: "Customer called to inquire about " + reasons[i % reasons.length],
            booking_completed: isBooked,
            status: i % 4 === 0 ? 'new' : 'handled',
            // Specific fields for modal if we want to show them raw later
            intent: intent,
            resolution_status: resolution,
            booking_status: isBooked ? 'booked' : null,
            verified: isBooked ? 'verified' : 'unverified'
        };
    });
}

// Helper to format timestamps relative (e.g. "2 hours ago") or absolute
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric'
    });
}

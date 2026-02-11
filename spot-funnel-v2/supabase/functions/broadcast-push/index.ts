import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore
Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("Step 1: Request Received");
        const body = await req.json(); // Don't destructure yet to avoid crashes on empty body
        const { squadId } = body;

        // Check Secrets
        const sbUrl = Deno.env.get('SUPABASE_URL');
        const sbKey = Deno.env.get('SERVICE_ROLE_KEY');

        if (!sbUrl || !sbKey) {
            throw new Error(`Missing Secrets: URL=${!!sbUrl}, KEY=${!!sbKey}`);
        }

        const supabaseClient = createClient(sbUrl, sbKey);

        console.log("Step 2: DB Query (Subs)");
        const { data: subs, error: subError } = await supabaseClient
            .from('push_subscriptions')
            .select('*');

        if (subError) throw subError;

        if (!subs || subs.length === 0) {
            return new Response(
                JSON.stringify({ success: true, count: 0, message: "No subscriptions found" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Manual Join to avoid schema crash
        const userIds = [...new Set(subs.map((s: any) => s.user_id))];
        console.log(`Step 3: Fetching profiles for ${userIds.length} users`);

        const { data: profiles, error: profError } = await supabaseClient
            .from('user_profiles')
            .select('id, squad_id')
            .in('id', userIds);

        if (profError) console.error("Profile warning:", profError); // Don't crash on profile error

        // Filter
        let targetSubs = subs;
        if (squadId && profiles) {
            const allowedUsers = new Set(
                profiles
                    .filter((p: any) => p.squad_id === squadId)
                    .map((p: any) => p.id)
            );
            targetSubs = subs.filter((s: any) => allowedUsers.has(s.user_id));
        }

        console.log(`Step 4: Sending to ${targetSubs.length} targets`);

        if (targetSubs.length === 0) {
            return new Response(
                JSON.stringify({ success: true, count: 0, message: "No targets after filter" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Send Push
        // @ts-ignore
        const webpush = await import("npm:web-push@3.6.7");

        const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');
        const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY');

        if (!vapidPublic || !vapidPrivate) throw new Error("Missing VAPID keys");

        webpush.default.setVapidDetails(
            'mailto:alerts@spotfunnel.com',
            vapidPublic,
            vapidPrivate
        );

        const payload = JSON.stringify({
            title: body.title || 'New Booking',
            body: body.body || 'You have a new booking!',
            data: body.data,
            icon: 'https://mskabsnklhprlmzugwbl.supabase.co/storage/v1/object/public/assets/logo-black.png'
        });

        const promises = targetSubs.map((sub: any) =>
            webpush.default.sendNotification(
                { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                payload
            ).catch((e: any) => ({ error: e.message }))
        );

        await Promise.all(promises);

        return new Response(
            JSON.stringify({
                success: true,
                step: "SENT",
                count: targetSubs.length,
                squadId
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )

    } catch (error) {
        console.error("Crash:", error.message);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
    }
})

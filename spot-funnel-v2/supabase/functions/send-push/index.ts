import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { subscriptionId, title, body, data } = await req.json()

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get subscription from database
        const { data: subscription, error: subError } = await supabaseClient
            .from('push_subscriptions')
            .select('*')
            .eq('id', subscriptionId)
            .single()

        if (subError || !subscription) {
            throw new Error('Subscription not found')
        }

        // Prepare push notification payload
        const payload = JSON.stringify({
            title: title || 'SpotFunnel',
            body: body || 'You have a new notification',
            icon: '/logo-black.svg',
            badge: '/logo-black.svg',
            data: data || {}
        })

        // Send push notification using Web Push API
        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

        if (!vapidPublicKey || !vapidPrivateKey) {
            throw new Error('VAPID keys not configured')
        }

        // Use web-push library
        const webpush = await import('npm:web-push@3.6.7')

        webpush.setVapidDetails(
            'mailto:alerts@getspotfunnel.com',
            vapidPublicKey,
            vapidPrivateKey
        )

        const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
            }
        }

        await webpush.sendNotification(pushSubscription, payload)

        return new Response(
            JSON.stringify({ success: true, message: 'Notification sent' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error sending push notification:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

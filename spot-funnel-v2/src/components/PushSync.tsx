import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { syncSubscriptionToDb } from '@/hooks/usePushNotifications';

export function PushSync() {
    const { user } = useAuth();
    const { subscription, isSupported, permission, subscribe } = usePushNotifications();

    useEffect(() => {
        const sync = async () => {
            if (!isSupported || !user) return;

            // Case 1: Already have a subscription -> Sync it to be sure
            if (subscription) {
                console.log('PushSync: Syncing existing subscription for user:', user.id);
                await syncSubscriptionToDb(subscription, user.id);
            }
            // Case 2: Permission granted but NO subscription -> Auto-heal/Subscribe
            else if (permission === 'granted') {
                console.log('PushSync: Permission granted but no sub. Auto-subscribing...');
                try {
                    const newSub = await subscribe();
                    if (newSub) {
                        await syncSubscriptionToDb(newSub, user.id);
                    }
                } catch (err) {
                    console.error('PushSync: Auto-subscribe failed:', err);
                }
            }
        };

        sync().catch(err => console.error('PushSync error:', err));
    }, [isSupported, user, subscription, permission, subscribe]);

    return null; // Background worker
}

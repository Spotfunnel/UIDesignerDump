import { Bell, BellOff, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

export function NotificationSettings() {
    const {
        isSupported,
        permission,
        isInstalled,
        subscription,
        requestPermission,
        unsubscribe
    } = usePushNotifications();

    const handleEnable = async () => {
        try {
            const granted = await requestPermission();
            if (granted) {
                toast.success('Notifications enabled!');
            } else {
                // Show helpful message instead of error
                toast.info('Notifications are optional - you can enable them anytime from Settings');
            }
        } catch (error) {
            console.log('Notification permission not granted:', error);
            toast.info('Notifications are optional and can be enabled later');
        }
    };

    const handleDisable = async () => {
        try {
            await unsubscribe();
            toast.success('Notifications disabled');
        } catch (error) {
            toast.error('Failed to disable notifications');
        }
    };

    const handleTestNotification = async () => {
        if (!subscription) {
            toast.error('Please enable notifications first');
            return;
        }

        try {
            const { supabase } = await import('@/lib/supabase');

            // Get subscription ID from database
            const subscriptionData = subscription.toJSON();
            const { data: dbSub } = await supabase
                .from('push_subscriptions')
                .select('id')
                .eq('endpoint', subscriptionData.endpoint!)
                .single();

            if (!dbSub) {
                toast.error('Subscription not found');
                return;
            }

            // Call Edge Function to send test notification
            const { error } = await supabase.functions.invoke('broadcast-push', {
                body: {
                    title: 'Test Notification',
                    body: 'This is a test from SpotFunnel! 🎉',
                    data: { type: 'test' }
                }
            });

            if (error) {
                toast.error('Failed to send test notification');
                console.error(error);
            } else {
                toast.success('Test notification sent!');
            }
        } catch (error) {
            toast.error('Failed to send test notification');
            console.error(error);
        }
    };

    if (!isSupported) {
        return (
            <Card className="p-6">
                <div className="flex items-start gap-4">
                    <BellOff className="w-6 h-6 text-muted-foreground mt-1" />
                    <div>
                        <h3 className="font-semibold mb-2">Push Notifications Not Supported</h3>
                        <p className="text-sm text-muted-foreground">
                            Your browser doesn't support push notifications. Try using Chrome, Edge, or Safari.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!isInstalled) {
        return (
            <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-4">
                    <Smartphone className="w-6 h-6 text-primary mt-1" />
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">Install App for Notifications</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            To receive push notifications on iPhone, you need to install SpotFunnel to your Home Screen.
                        </p>
                        <div className="bg-background/50 rounded-lg p-4 text-sm space-y-2">
                            <p className="font-medium">On iPhone/iPad:</p>
                            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                <li>Tap the Share button in Safari</li>
                                <li>Scroll down and tap "Add to Home Screen"</li>
                                <li>Tap "Add" in the top right</li>
                                <li>Open SpotFunnel from your Home Screen</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-start gap-4">
                <Bell className={`w-6 h-6 mt-1 ${subscription ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                    <h3 className="font-semibold mb-2">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Get instant alerts for new bookings and action-required calls.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {permission === 'granted' && subscription ? (
                            <>
                                <Button variant="outline" onClick={handleDisable}>
                                    <BellOff className="w-4 h-4 mr-2" />
                                    Disable Notifications
                                </Button>
                                <Button variant="secondary" onClick={handleTestNotification}>
                                    Send Test Notification
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleEnable}>
                                <Bell className="w-4 h-4 mr-2" />
                                Enable Notifications
                            </Button>
                        )}
                    </div>

                    {permission === 'granted' && subscription && (
                        <p className="text-xs text-muted-foreground mt-3">
                            ✓ Notifications are enabled. You'll receive alerts for new bookings and urgent calls.
                        </p>
                    )}

                    {permission === 'denied' && (
                        <p className="text-xs text-destructive mt-3">
                            Notifications are blocked. Please enable them in your browser settings.
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}

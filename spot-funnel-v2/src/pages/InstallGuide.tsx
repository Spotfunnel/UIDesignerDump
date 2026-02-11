import { ArrowLeft, Share2, Plus, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function InstallGuide() {
    const navigate = useNavigate();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Install SpotFunnel</h1>
                    <p className="text-muted-foreground">
                        Get instant notifications for new bookings and urgent calls
                    </p>
                </div>

                {/* Instructions Card */}
                <Card className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                1
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold">Tap the Share button</p>
                                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                                    <Share2 className="w-5 h-5 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Look for the share icon in Safari
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold">Select "Add to Home Screen"</p>
                                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                                    <Plus className="w-5 h-5 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Add to Home Screen +
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold">Tap "Add"</p>
                                <p className="text-sm text-muted-foreground">
                                    The app will appear on your home screen
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-sm font-semibold text-muted-foreground">What you'll get:</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Push notifications for new bookings</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Instant alerts for urgent calls</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Full-screen app experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Works offline</span>
                            </li>
                        </ul>
                    </div>
                </Card>

                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="w-full"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Note */}
                {isIOS && (
                    <p className="text-xs text-center text-muted-foreground">
                        Note: Push notifications only work when installed as an app on iOS 16.4+
                    </p>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            // 1. Check for tokens in URL (Manual Force)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');

            // Invite links ONLY have access_token, not refresh_token
            if (accessToken) {
                console.log('Found access token in URL, forcing session...');
                setCheckingSession(true);

                // FORCE set the session
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || accessToken
                });

                if (!error && data.session) {
                    console.log('Session forced successfully');
                    setHasSession(true);
                    setCheckingSession(false);
                } else {
                    console.error('Failed to force session:', error);
                    // CRITICAL: Set error and STOP. Do not fallback.
                    setError(error?.message || 'Failed to establish session from tokens');
                    setCheckingSession(false);
                }
                return; // Stop here regardless of success/failure
            }

            // 2. Fallback (Only if no tokens in URL)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setHasSession(true);
            } else {
                setError('Auth session missing! Please click the invite link from your email again.');
            }
            setCheckingSession(false);
        };

        checkSession();
    }, []);



    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { error: apiError } = await supabase.auth.updateUser({ password });

            if (apiError) {
                setError(apiError.message);
                toast({ title: 'Error', description: apiError.message, variant: 'destructive' });
            } else {
                toast({ title: 'Success', description: 'Password updated successfully!' });
                // Short delay to let the toast show
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md shadow-lg border-border/60">
                <CardHeader className="space-y-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Set New Password</CardTitle>
                    <CardDescription>Please secure your account with a strong password.</CardDescription>
                </CardHeader>
                <CardContent>
                    {checkingSession ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Verifying session...</span>
                        </div>
                    ) : !hasSession ? (
                        <div className="space-y-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error || 'No valid session found.'}
                                </AlertDescription>
                            </Alert>
                            <div className="p-4 bg-slate-100 rounded text-xs font-mono break-all">
                                <p className="font-bold">Debug Info:</p>
                                <p>Hash: {window.location.hash.substring(0, 50)}...</p>
                                <p>Access Token: {new URLSearchParams(window.location.hash.substring(1)).get('access_token') ? 'Yes' : 'No'}</p>
                                <p>Refresh Token: {new URLSearchParams(window.location.hash.substring(1)).get('refresh_token') ? 'Yes' : 'No'}</p>
                                <p>Type: {new URLSearchParams(window.location.hash.substring(1)).get('type')}</p>
                                <p className="mt-2 font-bold border-t pt-2">Environment Config:</p>
                                <p>URL: {supabase.supabaseUrl}</p>
                                <p className="text-red-500 mt-2">Error: {error}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-4">


                            {error && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Updating Password...' : 'Update Password'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

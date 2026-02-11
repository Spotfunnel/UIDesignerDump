import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: apiError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (apiError) {
                setError(apiError.message);
            } else {
                setSubmitted(true);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6 pb-8 space-y-4">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-in zoom-in">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold">Check your email</h2>
                        <p className="text-muted-foreground text-sm">
                            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                            Try another email
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center border-t bg-muted/20 py-4">
                        <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Log In
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md shadow-lg border-border/60">
                <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>Enter your email to receive recovery instructions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="py-2">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t bg-muted/10 py-4">
                    <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary font-medium flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Log In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

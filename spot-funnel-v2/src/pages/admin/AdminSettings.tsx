import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
                <p className="text-muted-foreground mt-1">System configuration and preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        Configuration Options
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium">Settings Coming Soon</p>
                        <p className="text-sm mt-2">Admin configuration panel will be available here</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

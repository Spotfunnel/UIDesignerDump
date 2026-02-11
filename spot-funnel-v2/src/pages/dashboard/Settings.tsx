import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, BookOpen, Mail, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { NotificationSettings } from '@/components/NotificationSettings';

const DEFAULT_KNOWLEDGE_BASE = `# Company Information
- Business: SpotFunnel AI Phone Assistant
- Services: Automated call handling, appointment booking, lead qualification
- Hours: 24/7 availability
- Service Area: Australia-wide

# Common Questions
Q: What services do you offer?
A: We provide AI-powered phone answering, appointment scheduling, and lead management.

Q: How much does it cost?
A: Plans start at $99/month. Visit our pricing page for details.

Q: Do you offer a free trial?
A: Yes, we offer a 14-day free trial with no credit card required.`;

const DEFAULT_EMAIL_TEMPLATES = {
    booking_confirmation: `Subject: Appointment Confirmed - {{date}} at {{time}}\n\nHi {{customer_name}},\n\nYour appointment has been confirmed for {{date}} at {{time}}.\n\nLocation: {{address}}\n\nIf you need to reschedule, please call us at {{business_phone}}.\n\nLooking forward to seeing you!\n\nBest regards,\n{{business_name}}`,
    follow_up: `Subject: Following Up - {{business_name}}\n\nHi {{customer_name}},\n\nThank you for your recent call. We wanted to follow up regarding {{topic}}.\n\n{{custom_message}}\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\n{{business_name}}`,
    quote_request: `Subject: Your Quote Request\n\nHi {{customer_name}},\n\nThank you for requesting a quote. Based on our conversation:\n\nService: {{service_type}}\nEstimated Cost: {{estimated_cost}}\n\nWe'll send you a detailed quote within 24 hours.\n\nBest regards,\n{{business_name}}`
};

type SettingSection = 'profile' | 'knowledge' | 'emails';

export default function Settings() {
    const [activeSection, setActiveSection] = useState<SettingSection>('profile');
    const [knowledgeBase, setKnowledgeBase] = useState(DEFAULT_KNOWLEDGE_BASE);
    const [emailTemplates, setEmailTemplates] = useState(DEFAULT_EMAIL_TEMPLATES);

    const handleSaveKnowledge = () => {
        toast.success('Knowledge base updated');
    };

    const handleSaveTemplate = (templateKey: string) => {
        toast.success('Email template saved');
    };

    const NAV_ITEMS = [
        { id: 'profile' as SettingSection, label: 'Profile', icon: User },
        { id: 'knowledge' as SettingSection, label: 'Knowledge Base', icon: BookOpen },
        { id: 'emails' as SettingSection, label: 'Email Templates', icon: Mail },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">Settings</h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Manage your account and AI preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                    activeSection === item.id
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                            <Card className="border-slate-300 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal and business details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" className="rounded-xl" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" className="rounded-xl" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Input id="company" placeholder="Acme Inc." className="rounded-xl" />
                                    </div>
                                    <Button className="rounded-xl px-8">Save Profile</Button>
                                </CardContent>
                            </Card>

                            <NotificationSettings />
                        </div>
                    )}



                    {/* Knowledge Base Section */}
                    {activeSection === 'knowledge' && (
                        <Card className="border-slate-300 shadow-sm animate-in slide-in-from-right-2 duration-300">
                            <CardHeader>
                                <CardTitle>Knowledge Base</CardTitle>
                                <CardDescription>Information your AI uses to answer questions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    value={knowledgeBase}
                                    onChange={(e) => setKnowledgeBase(e.target.value)}
                                    className="min-h-[300px] font-mono text-sm rounded-xl resize-none"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveKnowledge} className="rounded-xl">Save Changes</Button>
                                    <Button variant="outline" className="rounded-xl" onClick={() => setKnowledgeBase(DEFAULT_KNOWLEDGE_BASE)}>Reset</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Email Templates Section */}
                    {activeSection === 'emails' && (
                        <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                            {Object.entries(emailTemplates).map(([key, template]) => (
                                <Card key={key} className="border-slate-300 shadow-sm">
                                    <CardHeader className="pb-3 text-primary">
                                        <CardTitle className="text-lg capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            value={template}
                                            onChange={(e) => setEmailTemplates({ ...emailTemplates, [key]: e.target.value })}
                                            className="min-h-[150px] font-mono text-xs rounded-xl"
                                        />
                                        <Button onClick={() => handleSaveTemplate(key)} size="sm" className="rounded-xl">Save Template</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

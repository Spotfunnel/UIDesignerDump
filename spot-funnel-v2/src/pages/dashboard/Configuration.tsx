import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, BookOpen, Mail, Check, ChevronRight, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const VOICE_OPTIONS = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Warm and friendly' },
    { id: 'fable', name: 'Fable', description: 'Professional and clear' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Energetic and bright' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
];

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
    booking_confirmation: `Subject: Appointment Confirmed - {{date}} at {{time}}

Hi {{customer_name}},

Your appointment has been confirmed for {{date}} at {{time}}.

Location: {{address}}

If you need to reschedule, please call us at {{business_phone}}.

Looking forward to seeing you!

Best regards,
{{business_name}}`,

    follow_up: `Subject: Following Up - {{business_name}}

Hi {{customer_name}},

Thank you for your recent call. We wanted to follow up regarding {{topic}}.

{{custom_message}}

If you have any questions, feel free to reach out.

Best regards,
{{business_name}}`,

    quote_request: `Subject: Your Quote Request

Hi {{customer_name}},

Thank you for requesting a quote. Based on our conversation:

Service: {{service_type}}
Estimated Cost: {{estimated_cost}}

We'll send you a detailed quote within 24 hours.

Best regards,
{{business_name}}`
};

type ConfigSection = 'voice' | 'knowledge' | 'emails';

const NAV_ITEMS = [
    { id: 'voice' as ConfigSection, label: 'Voice', icon: Mic, description: 'AI voice settings' },
    { id: 'knowledge' as ConfigSection, label: 'Knowledge Base', icon: BookOpen, description: 'Information & FAQs' },
    { id: 'emails' as ConfigSection, label: 'Email Templates', icon: Mail, description: 'Automated emails' },
];

export default function Configuration() {
    const [activeSection, setActiveSection] = useState<ConfigSection>('voice');
    const [selectedVoice, setSelectedVoice] = useState('echo');
    const [knowledgeBase, setKnowledgeBase] = useState(DEFAULT_KNOWLEDGE_BASE);
    const [emailTemplates, setEmailTemplates] = useState(DEFAULT_EMAIL_TEMPLATES);
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

    const handleVoiceChange = (voiceId: string) => {
        setSelectedVoice(voiceId);
        toast.success(`Voice changed to ${VOICE_OPTIONS.find(v => v.id === voiceId)?.name}`);
    };

    const handleSaveKnowledge = () => {
        toast.success('Knowledge base updated');
    };

    const handleSaveTemplate = (templateKey: string) => {
        setEditingTemplate(null);
        toast.success('Email template saved');
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] gap-6 pb-24 md:pb-8">
            {/* Left Sidebar Navigation */}
            <div className="hidden md:block w-64 shrink-0">
                <Card className="bg-card border-slate-300 shadow-md h-full">
                    <CardHeader className="p-5 border-b">
                        <CardTitle className="text-lg font-bold">Configuration</CardTitle>
                        <CardDescription className="text-xs">Customize your AI assistant</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                        <nav className="space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left group",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "hover:bg-muted/50"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                                        <div className="flex-1 min-w-0">
                                            <div className={cn("font-semibold text-sm", isActive ? "text-primary-foreground" : "text-foreground")}>
                                                {item.label}
                                            </div>
                                            <div className={cn("text-xs truncate", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                                {item.description}
                                            </div>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-primary-foreground shrink-0" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile Section Selector */}
            <div className="md:hidden fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-40 px-4 py-2">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all shrink-0",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-muted/50 text-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto mt-14 md:mt-0">
                <div className="animate-in fade-in duration-300">
                    {/* Voice Selection Section */}
                    {activeSection === 'voice' && (
                        <Card className="bg-card border-slate-300 shadow-md">
                            <CardHeader className="p-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Mic className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Voice Selection</CardTitle>
                                        <CardDescription className="mt-1">Choose how your AI sounds on calls</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {VOICE_OPTIONS.map((voice) => (
                                        <button
                                            key={voice.id}
                                            onClick={() => handleVoiceChange(voice.id)}
                                            className={cn(
                                                "p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden group",
                                                selectedVoice === voice.id
                                                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/30 shadow-lg"
                                                    : "border-slate-300 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="font-bold text-base">{voice.name}</span>
                                                {selectedVoice === voice.id && (
                                                    <div className="p-1 bg-primary rounded-full">
                                                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{voice.description}</p>
                                            {selectedVoice === voice.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Knowledge Base Section */}
                    {activeSection === 'knowledge' && (
                        <Card className="bg-card border-slate-300 shadow-md">
                            <CardHeader className="p-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl font-bold">Knowledge Base</CardTitle>
                                        <CardDescription className="mt-1">Information your AI uses to answer questions</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    value={knowledgeBase}
                                    onChange={(e) => setKnowledgeBase(e.target.value)}
                                    className="min-h-[400px] font-mono text-sm resize-none"
                                    placeholder="Enter your knowledge base in markdown format..."
                                />
                                <div className="flex gap-3 mt-4">
                                    <Button onClick={handleSaveKnowledge} size="lg" className="px-6">
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setKnowledgeBase(DEFAULT_KNOWLEDGE_BASE)}
                                    >
                                        Reset to Default
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Email Templates Section */}
                    {activeSection === 'emails' && (
                        <div className="space-y-4">
                            <Card className="bg-card border-slate-300 shadow-md">
                                <CardHeader className="p-6 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
                                            <CardDescription className="mt-1">Customize automated email responses</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {Object.entries(emailTemplates).map(([key, template]) => (
                                <Card key={key} className="bg-card border-slate-300 shadow-md">
                                    <CardHeader className="p-5 border-b bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-bold capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    {key === 'booking_confirmation' && 'Sent when appointments are booked'}
                                                    {key === 'follow_up' && 'Sent for general follow-ups'}
                                                    {key === 'quote_request' && 'Sent when quotes are requested'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <Textarea
                                            value={template}
                                            onChange={(e) =>
                                                setEmailTemplates({
                                                    ...emailTemplates,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            className="min-h-[250px] font-mono text-sm resize-none"
                                        />
                                        <Button onClick={() => handleSaveTemplate(key)} size="lg" className="mt-4 px-6">
                                            <Check className="w-4 h-4 mr-2" />
                                            Save Template
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Variable Reference */}
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-sm font-bold">Available Template Variables</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{customer_name}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{date}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{time}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{business_name}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{business_phone}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{address}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{service_type}}'}</code>
                                        <code className="bg-white px-2 py-1 rounded border font-mono">{'{{custom_message}}'}</code>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

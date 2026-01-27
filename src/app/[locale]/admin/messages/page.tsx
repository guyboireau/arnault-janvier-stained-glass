import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/Card';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { Database } from '@/types/database';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const supabase = createClient();
    const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
    const messages = data as ContactSubmission[] | null;

    // Simple date formatter since we might not have date-fns
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-display text-neutral-900">Messages</h1>
                <div className="text-sm text-neutral-500">
                    {messages?.length || 0} messages
                </div>
            </div>

            <div className="space-y-4">
                {messages?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-neutral-200 text-neutral-500">
                        No messages yet.
                    </div>
                )}

                {messages?.map((msg) => (
                    <Card key={msg.id} className={`transition-opacity ${msg.is_read ? 'opacity-60 bg-neutral-50' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-full ${msg.is_read ? 'bg-neutral-200 text-neutral-500' : 'bg-primary-100 text-primary-600'}`}>
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900">{msg.subject}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-2">
                                            <span className="font-medium text-neutral-700">{msg.name}</span>
                                            <span>&bull;</span>
                                            <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                                            {msg.phone && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span>{msg.phone}</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-neutral-700 whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className="text-xs text-neutral-400 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDate(msg.created_at)}
                                    </span>
                                    {!msg.is_read && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

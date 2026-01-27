import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { FolderOpen, Eye, Mail, BarChart } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = createClient();

    // Fetch basic stats
    const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: msgCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false);

    const stats = [
        { label: 'Total Projects', value: projectCount || 0, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Unread Messages', value: msgCount || 0, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Total Views', value: 'Coming soon', icon: Eye, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Engagement', value: '--', icon: BarChart, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500">Welcome back, Arnault.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="flex items-center p-6">
                            <div className={`p-4 rounded-xl ${stat.bg} mr-4`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <h3 className="text-lg font-bold">Recent Projects</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-500 text-sm">No recent activity.</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <h3 className="text-lg font-bold">Recent Messages</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-500 text-sm">No new messages.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

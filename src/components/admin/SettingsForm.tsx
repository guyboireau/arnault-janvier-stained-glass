'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useToast } from '@/hooks/useToast';

interface SiteSettings {
    title_fr: string;
    title_en: string;
    title_es: string;
    description_fr: string;
    description_en: string;
    description_es: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    youtube: string;
}

interface SettingsFormProps {
    initialSettings: SiteSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [settings, setSettings] = useState<SiteSettings>(initialSettings);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    const handleChange = (field: keyof SiteSettings, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error('Failed to update settings');
            }

            addToast('Settings updated successfully', 'success');
            router.refresh();
        } catch (error) {
            console.error('Error updating settings:', error);
            addToast('Failed to update settings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Information */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Site Information</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Site Title (FR) *
                            </label>
                            <input
                                type="text"
                                value={settings.title_fr}
                                onChange={(e) => handleChange('title_fr', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Site Title (EN)
                            </label>
                            <input
                                type="text"
                                value={settings.title_en}
                                onChange={(e) => handleChange('title_en', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Site Title (ES)
                            </label>
                            <input
                                type="text"
                                value={settings.title_es}
                                onChange={(e) => handleChange('title_es', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Description (FR)
                            </label>
                            <textarea
                                value={settings.description_fr}
                                onChange={(e) => handleChange('description_fr', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Description (EN)
                            </label>
                            <textarea
                                value={settings.description_en}
                                onChange={(e) => handleChange('description_en', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Description (ES)
                            </label>
                            <textarea
                                value={settings.description_es}
                                onChange={(e) => handleChange('description_es', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            value={settings.instagram}
                            onChange={(e) => handleChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/username"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            YouTube URL
                        </label>
                        <input
                            type="url"
                            value={settings.youtube}
                            onChange={(e) => handleChange('youtube', e.target.value)}
                            placeholder="https://youtube.com/@username"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

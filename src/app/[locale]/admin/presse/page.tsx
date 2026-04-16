'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { PRESS_ITEMS_SETTINGS_KEY, type PressItem } from '@/lib/constants';

const emptyItem = (): PressItem => ({
    id: `press-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: '',
    publication: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    url: '',
    cover_image_url: '',
});

export default function AdminPressePage() {
    const supabase = createClient();
    const { addToast } = useToast();
    const [items, setItems] = useState<PressItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await (supabase as any)
                .from('site_settings')
                .select('value')
                .eq('key', PRESS_ITEMS_SETTINGS_KEY)
                .maybeSingle();

            if (data?.value && Array.isArray(data.value)) {
                setItems(data.value);
            }
            setLoading(false);
        };
        load();
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            const { error } = await (supabase as any)
                .from('site_settings')
                .upsert({ key: PRESS_ITEMS_SETTINGS_KEY, value: items });

            if (error) throw error;
            addToast('Articles de presse sauvegardés', 'success');
        } catch (e: any) {
            addToast(e.message || 'Erreur lors de la sauvegarde', 'error');
        } finally {
            setSaving(false);
        }
    };

    const addItem = () => setItems((prev) => [...prev, emptyItem()]);

    const removeItem = (id: string) =>
        setItems((prev) => prev.filter((i) => i.id !== id));

    const updateItem = (id: string, field: keyof PressItem, value: string) =>
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        );

    if (loading) return <div className="p-8 text-neutral-500">Chargement…</div>;

    return (
        <div className="max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Presse</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Articles et mentions dans la presse
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                    </Button>
                    <Button type="button" onClick={save} isLoading={saving}>
                        Enregistrer
                    </Button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400">
                    <p className="mb-4">Aucun article pour l'instant</p>
                    <Button type="button" variant="outline" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter le premier article
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <span className="text-sm font-semibold text-neutral-500">
                                    Article #{idx + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                    aria-label="Supprimer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Titre de l'article *"
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                    placeholder="Ex : Arnault Janvier, maître verrier à Paris"
                                />
                                <Input
                                    label="Publication *"
                                    value={item.publication}
                                    onChange={(e) => updateItem(item.id, 'publication', e.target.value)}
                                    placeholder="Ex : Le Monde, Architectural Digest…"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Date *"
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                                />
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-neutral-700">
                                        Lien de l'article
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={item.url ?? ''}
                                            onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center h-10 w-10 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                                                aria-label="Ouvrir le lien"
                                            >
                                                <ExternalLink className="h-4 w-4 text-neutral-400" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Textarea
                                label="Extrait / résumé (optionnel)"
                                value={item.excerpt ?? ''}
                                onChange={(e) => updateItem(item.id, 'excerpt', e.target.value)}
                                placeholder="Courte description de l'article…"
                                className="min-h-[80px]"
                            />

                            <Input
                                label="Image de couverture (URL, optionnel)"
                                value={item.cover_image_url ?? ''}
                                onChange={(e) => updateItem(item.id, 'cover_image_url', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <div className="flex justify-end gap-3 pb-8">
                    <Button type="button" variant="outline" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un article
                    </Button>
                    <Button type="button" onClick={save} isLoading={saving}>
                        Enregistrer
                    </Button>
                </div>
            )}
        </div>
    );
}

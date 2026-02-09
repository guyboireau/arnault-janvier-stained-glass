'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Edit, Trash2, X, Check, GripVertical } from 'lucide-react';
import { Database } from '@/types/database';
import { useRouter } from '@/i18n/routing';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryManagerProps {
    initialCategories: Category[];
}

interface CategoryFormData {
    slug: string;
    name_fr: string;
    name_en: string;
    name_es: string;
    description_fr: string;
    display_order: number;
    is_active: boolean;
}

const emptyForm: CategoryFormData = {
    slug: '',
    name_fr: '',
    name_en: '',
    name_es: '',
    description_fr: '',
    display_order: 0,
    is_active: true,
};

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    name === 'display_order' ? parseInt(value) || 0 : value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.name_fr
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setShowForm(false);
        setEditingId(null);
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setFormData({
            slug: cat.slug,
            name_fr: cat.name_fr,
            name_en: cat.name_en || '',
            name_es: cat.name_es || '',
            description_fr: cat.description_fr || '',
            display_order: cat.display_order || 0,
            is_active: cat.is_active ?? true,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                slug: formData.slug,
                name_fr: formData.name_fr,
                name_en: formData.name_en || null,
                name_es: formData.name_es || null,
                description_fr: formData.description_fr || null,
                display_order: formData.display_order,
                is_active: formData.is_active,
            };

            if (editingId) {
                const { error } = await (supabase as any)
                    .from('categories')
                    .update(payload)
                    .eq('id', editingId);

                if (error) throw error;

                setCategories(prev =>
                    prev.map(c => c.id === editingId ? { ...c, ...formData } as Category : c)
                );
            } else {
                const { data, error } = await (supabase as any)
                    .from('categories')
                    .insert(payload)
                    .select()
                    .single();

                if (error) throw error;
                if (data) setCategories(prev => [...prev, data as Category]);
            }

            resetForm();
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const { error } = await (supabase as any).from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(prev => prev.filter(c => c.id !== id));
            setDeleteConfirm(null);
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la suppression');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (cat: Category) => {
        const newActive = !cat.is_active;
        const { error } = await (supabase as any)
            .from('categories')
            .update({ is_active: newActive })
            .eq('id', cat.id);

        if (!error) {
            setCategories(prev =>
                prev.map(c => c.id === cat.id ? { ...c, is_active: newActive } : c)
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-display text-neutral-900">Catégories</h1>
                {!showForm && (
                    <Button onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle catégorie
                    </Button>
                )}
            </div>

            {/* Formulaire ajout/édition */}
            {showForm && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">
                                {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                            </h3>
                            <button onClick={resetForm} className="text-neutral-400 hover:text-neutral-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        name="name_fr"
                                        label="Nom (FR) *"
                                        value={formData.name_fr}
                                        onChange={handleChange}
                                        onBlur={!editingId && !formData.slug ? generateSlug : undefined}
                                        required
                                        placeholder="Ex: Vitraux Religieux"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="slug"
                                        label="Slug *"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        placeholder="vitraux-religieux"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="name_en"
                                        label="Nom (EN)"
                                        value={formData.name_en}
                                        onChange={handleChange}
                                        placeholder="Religious Stained Glass"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="name_es"
                                        label="Nom (ES)"
                                        value={formData.name_es}
                                        onChange={handleChange}
                                        placeholder="Vidrieras Religiosas"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="display_order"
                                        label="Ordre d'affichage"
                                        type="number"
                                        value={formData.display_order}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium text-neutral-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Annuler
                                </Button>
                                <Button type="submit" isLoading={loading}>
                                    <Check className="h-4 w-4 mr-2" />
                                    {editingId ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Liste des catégories */}
            <div className="grid gap-3">
                {categories.map((cat) => (
                    <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-neutral-300 cursor-grab">
                                    <GripVertical className="h-5 w-5" />
                                </span>
                                <span className="font-mono text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                                    #{cat.display_order}
                                </span>
                                <div>
                                    <h3 className="font-bold text-neutral-900">{cat.name_fr}</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                        <span className="font-mono text-xs">{cat.slug}</span>
                                        {cat.name_en && (
                                            <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">EN</span>
                                        )}
                                        {cat.name_es && (
                                            <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">ES</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleActive(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                        cat.is_active
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    {cat.is_active ? 'Active' : 'Inactive'}
                                </button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEdit(cat)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>

                                {deleteConfirm === cat.id ? (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-600 hover:bg-red-50"
                                            isLoading={loading}
                                        >
                                            Confirmer
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteConfirm(cat.id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
                        <p className="text-neutral-500 mb-4">Aucune catégorie pour le moment.</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Créer la première catégorie
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

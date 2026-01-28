'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { Database } from '@/types/database';
import ImageUpload from '@/components/admin/ImageUpload';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface UploadedImage {
    id: string;
    url: string;
    name: string;
    size: number;
    preview?: string;
}

interface ProjectFormProps {
    initialData?: Partial<Project>;
    categories?: Category[];
    isEdit?: boolean;
    initialImages?: UploadedImage[];
}

export default function ProjectForm({ initialData, categories = [], isEdit = false, initialImages = [] }: ProjectFormProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<UploadedImage[]>(initialImages);
    const [formData, setFormData] = useState<Partial<Project>>(initialData || {
        title_fr: '',
        slug: '',
        description_fr: '',
        category_id: '',
        is_published: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSlugGen = () => {
        const slug = formData.title_fr?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            const payload = {
                ...formData,
                // Sauvegarder l'URL de la première image comme cover_image_url
                cover_image_url: images.length > 0 ? images[0].url : formData.cover_image_url,
                updated_at: new Date().toISOString(),
            };

            let projectId = initialData?.id;

            if (!isEdit) {
                // Create
                // @ts-ignore - Supabase typing issue with insert
                const { data, error } = await supabase.from('projects').insert(payload).select().single();
                if (error) throw error;
                projectId = data.id;
                
                // Sauvegarder les images dans la table project_images
                if (images.length > 0 && projectId) {
                    const imageRecords = images.map((img, index) => ({
                        project_id: projectId,
                        image_url: img.url,
                        display_order: index,
                        alt_text: img.name
                    }));
                    const { error: imgError } = await supabase.from('project_images').insert(imageRecords);
                    if (imgError) console.error('Erreur lors de la sauvegarde des images:', imgError);
                }
                
                addToast('Project created successfully', 'success');
                router.push('/admin/projects');
            } else {
                // Update
                // @ts-ignore - Supabase typing issue with update
                const { error } = await supabase.from('projects').update(payload).eq('id', projectId!);
                if (error) throw error;
                
                // Mettre à jour les images si nécessaire
                // Supprimer les anciennes images et ajouter les nouvelles
                if (images.length > 0) {
                    await supabase.from('project_images').delete().eq('project_id', projectId!);
                    const imageRecords = images.map((img, index) => ({
                        project_id: projectId!,
                        image_url: img.url,
                        display_order: index,
                        alt_text: img.name
                    }));
                    const { error: imgError } = await supabase.from('project_images').insert(imageRecords);
                    if (imgError) console.error('Erreur lors de la mise à jour des images:', imgError);
                }
                
                addToast('Project updated successfully', 'success');
                router.push('/admin/projects');
            }

            router.refresh();

        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Error saving project', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">General (FR)</h3>
                    <Input
                        name="title_fr"
                        label="Title (FR)"
                        value={formData.title_fr || ''}
                        onChange={handleChange}
                        onBlur={!isEdit && !formData.slug ? handleSlugGen : undefined}
                        required
                    />
                    <Input name="slug" label="Slug" value={formData.slug || ''} onChange={handleChange} required />

                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-neutral-700">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id || ''}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name_fr}</option>
                            ))}
                        </select>
                    </div>

                    <Textarea name="description_fr" label="Short Description (FR)" value={formData.description_fr || ''} onChange={handleChange} />
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Details</h3>
                    <Input name="year" label="Year" type="number" value={formData.year || ''} onChange={handleChange} />
                    <Input name="location" label="Location" value={formData.location || ''} onChange={handleChange} />
                    <Input name="cover_image_url" label="Cover Image URL (optionnel)" value={formData.cover_image_url || ''} onChange={handleChange} placeholder="https://..." />

                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            checked={formData.is_published || false}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-neutral-900">Published</label>
                    </div>
                </div>
            </div>

            {/* Section Upload d'images */}
            <div className="border-t pt-6">
                <ImageUpload 
                    onImagesChange={setImages}
                    maxFiles={20}
                    maxSizeMB={10}
                    initialImages={images}
                />
            </div>

            <div className="pt-4 border-t flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={loading}>{isEdit ? 'Update Project' : 'Create Project'}</Button>
            </div>
        </form>
    );
}

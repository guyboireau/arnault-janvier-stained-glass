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
import { Plus, X, Link as LinkIcon, Image as ImageIcon, Upload } from 'lucide-react';

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
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
    const [urlInput, setUrlInput] = useState('');
    const [formData, setFormData] = useState<Partial<Project>>(initialData || {
        title_fr: '',
        title_en: '',
        title_es: '',
        slug: '',
        description_fr: '',
        description_en: '',
        description_es: '',
        category_id: '',
        year: undefined,
        location: '',
        cover_image_url: '',
        is_published: false,
        is_featured: false,
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
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const addImageByUrl = () => {
        if (!urlInput.trim()) return;
        const url = urlInput.trim();
        const newImage: UploadedImage = {
            id: `url-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            url,
            name: url.split('/').pop() || 'image',
            size: 0,
            preview: url,
        };
        const newImages = [...images, newImage];
        setImages(newImages);
        setUrlInput('');
    };

    const removeImage = (imageId: string) => {
        // If it's an uploaded image (not URL-based), also delete from Supabase Storage
        const imageToRemove = images.find(img => img.id === imageId);
        if (imageToRemove && !imageId.startsWith('url-')) {
            const supabase = createClient();
            // Try to extract file path from the URL or use the ID directly
            const filePath = `uploads/${imageId}`;
            supabase.storage.from('project-images').remove([filePath]).catch(console.error);
        }
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            const payload = {
                ...formData,
                cover_image_url: images.length > 0 ? images[0].url : formData.cover_image_url,
                images: JSON.stringify(images.map((img, i) => ({
                    url: img.url,
                    alt_fr: img.name,
                    order: i,
                }))),
                updated_at: new Date().toISOString(),
            };

            let projectId = initialData?.id;

            const sb = supabase as any;

            if (!isEdit) {
                const { data, error } = await sb.from('projects').insert(payload).select().single();
                if (error) throw error;
                projectId = data.id;

                if (images.length > 0 && projectId) {
                    const imageRecords = images.map((img, index) => ({
                        project_id: projectId,
                        image_url: img.url,
                        display_order: index,
                        alt_text: img.name
                    }));
                    const { error: imgError } = await sb.from('project_images').insert(imageRecords);
                    if (imgError) console.error('Error inserting project_images:', imgError);
                }

                addToast('Projet créé avec succès', 'success');
                router.push('/admin/projects');
            } else {
                const { error } = await sb.from('projects').update(payload).eq('id', projectId!);
                if (error) throw error;

                // Always sync project_images: delete old ones and re-insert current ones
                const { error: delError } = await sb.from('project_images').delete().eq('project_id', projectId!);
                if (delError) console.error('Error deleting old project_images:', delError);

                if (images.length > 0) {
                    const imageRecords = images.map((img, index) => ({
                        project_id: projectId!,
                        image_url: img.url,
                        display_order: index,
                        alt_text: img.name
                    }));
                    const { error: imgError } = await sb.from('project_images').insert(imageRecords);
                    if (imgError) console.error('Error inserting project_images:', imgError);
                }

                addToast('Projet mis à jour avec succès', 'success');
                router.push('/admin/projects');
            }

            router.refresh();
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Erreur lors de la sauvegarde', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Info générales */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
                <h3 className="font-bold text-lg border-b pb-3">Informations générales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input
                            name="title_fr"
                            label="Titre (FR) *"
                            value={formData.title_fr || ''}
                            onChange={handleChange}
                            onBlur={!isEdit && !formData.slug ? handleSlugGen : undefined}
                            required
                            placeholder="Ex: Cathédrale Saint-Jean"
                        />
                        <Input
                            name="title_en"
                            label="Titre (EN)"
                            value={formData.title_en || ''}
                            onChange={handleChange}
                            placeholder="St. John Cathedral"
                        />
                        <Input
                            name="title_es"
                            label="Titre (ES)"
                            value={formData.title_es || ''}
                            onChange={handleChange}
                            placeholder="Catedral de San Juan"
                        />
                    </div>

                    <div className="space-y-4">
                        <Input
                            name="slug"
                            label="Slug *"
                            value={formData.slug || ''}
                            onChange={handleChange}
                            required
                            placeholder="cathedrale-saint-jean"
                        />

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-neutral-700">Catégorie</label>
                            <select
                                name="category_id"
                                value={formData.category_id || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name_fr}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                name="year"
                                label="Année"
                                type="number"
                                value={formData.year || ''}
                                onChange={handleChange}
                                placeholder="2024"
                            />
                            <Input
                                name="location"
                                label="Lieu"
                                value={formData.location || ''}
                                onChange={handleChange}
                                placeholder="Paris"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
                <h3 className="font-bold text-lg border-b pb-3">Descriptions</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Textarea
                        name="description_fr"
                        label="Description courte (FR)"
                        value={formData.description_fr || ''}
                        onChange={handleChange}
                        placeholder="Restauration complète des vitraux de la nef..."
                    />
                    <Textarea
                        name="description_en"
                        label="Description courte (EN)"
                        value={formData.description_en || ''}
                        onChange={handleChange}
                        placeholder="Complete restoration of the nave stained glass..."
                    />
                    <Textarea
                        name="description_es"
                        label="Description courte (ES)"
                        value={formData.description_es || ''}
                        onChange={handleChange}
                        placeholder="Restauración completa de las vidrieras de la nave..."
                    />
                </div>
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-lg">Images</h3>
                    <div className="flex bg-neutral-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                imageMode === 'upload'
                                    ? 'bg-white text-neutral-900 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                imageMode === 'url'
                                    ? 'bg-white text-neutral-900 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            <LinkIcon className="h-3.5 w-3.5" />
                            URL
                        </button>
                    </div>
                </div>

                {imageMode === 'upload' ? (
                    <ImageUpload
                        onImagesChange={(newImages) => setImages(prev => [...prev.filter(img => img.id.startsWith('url-')), ...newImages])}
                        maxFiles={20}
                        maxSizeMB={10}
                        initialImages={images.filter(img => !img.id.startsWith('url-'))}
                        showPreview={false}
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    label="URL de l'image"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addImageByUrl();
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button type="button" onClick={addImageByUrl} disabled={!urlInput.trim()}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Ajouter
                                </Button>
                            </div>
                        </div>

                        <Input
                            name="cover_image_url"
                            label="URL image de couverture (optionnel, sinon la 1ère image sera utilisée)"
                            value={formData.cover_image_url || ''}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                )}

                {/* Aperçu de toutes les images */}
                {images.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-neutral-700">
                            {images.length} image{images.length > 1 ? 's' : ''} ajoutée{images.length > 1 ? 's' : ''}
                            {images.length > 0 && !formData.cover_image_url && (
                                <span className="text-neutral-400 ml-2">
                                    (la 1ère sera l'image de couverture)
                                </span>
                            )}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {images.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative group aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.preview || img.url}
                                        alt={img.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e5e5" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">Error</text></svg>';
                                        }}
                                    />
                                    {index === 0 && !formData.cover_image_url && (
                                        <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            Cover
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                    {img.id.startsWith('url-') && (
                                        <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                            URL
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Publication */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-4">
                <h3 className="font-bold text-lg border-b pb-3">Publication</h3>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:bg-neutral-100 transition-colors">
                        <input
                            type="checkbox"
                            name="is_published"
                            checked={formData.is_published || false}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-neutral-900">Publié</span>
                            <p className="text-xs text-neutral-500">Visible sur le site public</p>
                        </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:bg-neutral-100 transition-colors">
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={formData.is_featured || false}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-neutral-900">Mis en avant</span>
                            <p className="text-xs text-neutral-500">Affiché sur la page d'accueil</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pb-8">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Annuler
                </Button>
                <Button type="submit" isLoading={loading}>
                    {isEdit ? 'Mettre à jour le projet' : 'Créer le projet'}
                </Button>
            </div>
        </form>
    );
}

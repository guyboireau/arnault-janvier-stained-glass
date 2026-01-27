'use client';

import { createProject } from '@/lib/actions'; // We will adjust createProject to accept URLs
import ImageUpload from '@/components/admin/ImageUpload';
import { useState } from 'react';

// Client component wrapper for the form logic
export default function NewProjectForm({ categories }: { categories: any[] }) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const handleImagesUploaded = (urls: string[]) => {
        setImageUrls(prev => [...prev, ...urls]);
    };

    return (
        <form action={createProject} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titre du projet</label>
                <input type="text" name="title" className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-slate-500" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                <select name="category_id" className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-slate-500">
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea name="description" rows={5} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-slate-500"></textarea>
            </div>

            {/* Hidden input to send image URLs to Server Action */}
            <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />

            <ImageUpload onImagesUploaded={handleImagesUploaded} />

            <div className="pt-4 flex justify-end gap-4">
                <a href="/admin/projects" className="px-6 py-2 rounded text-slate-600 hover:bg-slate-100 transition-colors">Annuler</a>
                <button type="submit" className="bg-slate-900 text-white px-8 py-2 rounded hover:bg-slate-800 transition-colors font-medium">
                    Créer le projet
                </button>
            </div>
        </form>
    );
}

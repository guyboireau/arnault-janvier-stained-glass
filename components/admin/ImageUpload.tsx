'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Image from 'next/image';

interface ProjectImage {
    url: string;
    name: string;
}

export default function ImageUpload({
    onImagesUploaded
}: {
    onImagesUploaded: (urls: string[]) => void
}) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<ProjectImage[]>([]);
    const supabase = createClient();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        for (const file of files) {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images') // Ensure this bucket exists
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                continue;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            setImages(prev => [...prev, { url: publicUrl, name: file.name }]);
            uploadedUrls.push(publicUrl);
        }

        onImagesUploaded(uploadedUrls); // Pass up only the *new* URLs (this might need logic adjustment if parent accumulates)
        setUploading(false);

        // Reset file input if needed, but managing state is enough
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Photos</label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <p className="text-sm text-slate-500">Upload en cours...</p>
                        ) : (
                            <>
                                <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="text-xs text-slate-500">SVG, PNG, JPG (Max 5MB)</p>
                            </>
                        )}
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} disabled={uploading} />
                </label>
            </div>

            {/* Preview */}
            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-full h-24 bg-slate-100 rounded overflow-hidden border border-slate-200">
                            <Image src={img.url} alt="Preview" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useRef, DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadedImage {
    id: string;
    url: string;
    name: string;
    size: number;
    preview?: string;
}

interface ImageUploadProps {
    onImagesChange: (images: UploadedImage[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    initialImages?: UploadedImage[];
}

export default function ImageUpload({ 
    onImagesChange, 
    maxFiles = 10,
    maxSizeMB = 10,
    initialImages = []
}: ImageUploadProps) {
    const [images, setImages] = useState<UploadedImage[]>(initialImages);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Compression d'image basique
    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Redimensionner si trop grand
                    const MAX_WIDTH = 2048;
                    const MAX_HEIGHT = 2048;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not available'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Compression failed'));
                            }
                        },
                        'image/jpeg',
                        0.85 // Qualité de compression
                    );
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const uploadFile = async (file: File): Promise<UploadedImage | null> => {
        try {
            // Vérifier la taille
            if (file.size > maxSizeBytes) {
                console.log(`Compression de ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                const compressedBlob = await compressImage(file);
                file = new File([compressedBlob], file.name, { type: 'image/jpeg' });
                console.log(`Nouvelle taille: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            }

            // Upload vers Supabase Storage
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Erreur upload Supabase:', uploadError);
                throw uploadError;
            }

            // Obtenir l'URL publique
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            return {
                id: fileName,
                url: publicUrl,
                name: file.name,
                size: file.size,
                preview: publicUrl
            };
        } catch (err: any) {
            console.error('Erreur lors de l\'upload:', err);
            setError(`Erreur: ${err.message || 'Upload échoué'}`);
            return null;
        }
    };

    const handleFiles = async (files: FileList | File[]) => {
        setError(null);
        
        const fileArray = Array.from(files);
        
        // Vérifier le nombre de fichiers
        if (images.length + fileArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} images autorisées`);
            return;
        }

        // Vérifier les types de fichiers
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const invalidFiles = fileArray.filter(f => !validTypes.includes(f.type));
        
        if (invalidFiles.length > 0) {
            setError(`Formats acceptés: JPG, PNG, WebP, GIF`);
            return;
        }

        setUploading(true);

        const uploadPromises = fileArray.map(file => uploadFile(file));
        const uploadedImages = await Promise.all(uploadPromises);
        
        const successfulUploads = uploadedImages.filter((img): img is UploadedImage => img !== null);
        
        if (successfulUploads.length > 0) {
            const newImages = [...images, ...successfulUploads];
            setImages(newImages);
            onImagesChange(newImages);
        }

        setUploading(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        await handleFiles(e.target.files);
        
        // Réinitialiser l'input pour permettre le même fichier
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await handleFiles(e.dataTransfer.files);
        }
    };

    const removeImage = async (imageId: string) => {
        const imageToRemove = images.find(img => img.id === imageId);
        if (imageToRemove) {
            // Supprimer de Supabase Storage
            const filePath = `uploads/${imageId}`;
            await supabase.storage.from('project-images').remove([filePath]);
        }

        const newImages = images.filter(img => img.id !== imageId);
        setImages(newImages);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-700">
                    Images du projet ({images.length}/{maxFiles})
                </label>
                <span className="text-xs text-neutral-500">
                    Max {maxSizeMB}MB par image
                </span>
            </div>

            {/* Zone de drop */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative flex flex-col items-center justify-center w-full min-h-[200px] p-6
                    border-2 border-dashed rounded-lg cursor-pointer transition-all
                    ${dragActive 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100'
                    }
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading || images.length >= maxFiles}
                />

                {uploading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-sm font-medium text-neutral-700">Upload en cours...</p>
                        <p className="text-xs text-neutral-500 mt-1">Compression et optimisation automatiques</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                        <div className="flex text-sm text-neutral-600 mb-2">
                            <span className="font-semibold text-primary-600">Cliquez pour sélectionner</span>
                            <span className="ml-1">ou glissez-déposez vos images</span>
                        </div>
                        <p className="text-xs text-neutral-500">
                            JPG, PNG, WebP, GIF jusqu'à {maxSizeMB}MB
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Fonctionne depuis ordinateur, téléphone et tablette
                        </p>
                    </div>
                )}
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Prévisualisation des images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative group aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 hover:border-primary-300 transition-colors"
                        >
                            <Image
                                src={img.preview || img.url}
                                alt={img.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            
                            {/* Overlay avec infos */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(img.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                                    title="Supprimer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Taille du fichier */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white truncate">{img.name}</p>
                                <p className="text-xs text-neutral-300">
                                    {(img.size / 1024 / 1024).toFixed(2)}MB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message si aucune image */}
            {images.length === 0 && !uploading && (
                <div className="text-center py-6">
                    <ImageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-500">Aucune image ajoutée</p>
                </div>
            )}
        </div>
    );
}

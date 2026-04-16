'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { useState, useRef } from 'react';
import { Paperclip, X, Upload } from 'lucide-react';
import {
    CONTACT_ATTACHMENT_MAX_SIZE_MB,
    CONTACT_ATTACHMENT_MAX_FILES,
    CONTACT_ATTACHMENT_ACCEPTED,
} from '@/lib/constants';

const PROJECT_TYPES = [
    'particuliers',
    'retail',
    'decoration',
    'vitraux-ornementaux',
    'vitreries',
    'vitraux-peints',
    'other',
] as const;

const createSchema = () =>
    z.object({
        firstName: z.string().min(2, 'Le prénom est requis'),
        lastName: z.string().min(2, 'Le nom est requis'),
        email: z.string().email('Email invalide'),
        phone: z.string().optional(),
        subject: z.string().min(3, "L'objet est requis"),
        projectType: z.string().optional(),
        city: z.string().optional(),
        dimensions: z.string().optional(),
        style: z.string().optional(),
        space: z.string().optional(),
        message: z.string().optional(),
    });

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface AttachedFile {
    file: File;
    id: string;
}

export default function ContactForm() {
    const t = useTranslations('contact.form');
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachments, setAttachments] = useState<AttachedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(createSchema()),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const maxSize = CONTACT_ATTACHMENT_MAX_SIZE_MB * 1024 * 1024;

        const valid = files.filter((f) => {
            if (f.size > maxSize) {
                addToast(`${f.name} dépasse ${CONTACT_ATTACHMENT_MAX_SIZE_MB} Mo`, 'error');
                return false;
            }
            return true;
        });

        setAttachments((prev) => {
            const combined = [
                ...prev,
                ...valid.map((f) => ({ file: f, id: `${Date.now()}-${Math.random()}` })),
            ];
            return combined.slice(0, CONTACT_ATTACHMENT_MAX_FILES);
        });

        // Reset input so the same file can be re-added if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Champs texte
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            formData.append('subject', data.subject);
            if (data.projectType) formData.append('projectType', data.projectType);
            if (data.city) formData.append('city', data.city);
            if (data.dimensions) formData.append('dimensions', data.dimensions);
            if (data.style) formData.append('style', data.style);
            if (data.space) formData.append('space', data.space);
            if (data.message) formData.append('message', data.message);

            // Fichiers
            attachments.forEach((a) => formData.append('files', a.file));

            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Échec de l\'envoi');

            addToast(t('success'), 'success');
            reset();
            setAttachments([]);
        } catch {
            addToast(t('error'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-neutral-100"
        >
            {/* Section : Coordonnées */}
            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                        id="firstName"
                        label={t('firstName')}
                        placeholder={t('firstNamePlaceholder')}
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <Input
                        id="lastName"
                        label={t('lastName')}
                        placeholder={t('lastNamePlaceholder')}
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                        id="email"
                        label={t('email')}
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        id="phone"
                        label={`${t('phone')} (optionnel)`}
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        {...register('phone')}
                    />
                </div>

                <Input
                    id="subject"
                    label={t('subject')}
                    placeholder={t('subjectPlaceholder')}
                    error={errors.subject?.message}
                    {...register('subject')}
                />
            </div>

            {/* Section : Votre projet */}
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest border-b border-neutral-100 pb-3">
                    {t('projectSection')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-neutral-700">
                            {t('projectType')}
                        </label>
                        <select
                            {...register('projectType')}
                            className="w-full h-10 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">{t('projectTypePlaceholder')}</option>
                            {PROJECT_TYPES.map((key) => (
                                <option key={key} value={key}>
                                    {t(`projectTypeOptions.${key}` as any)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        id="city"
                        label={`${t('city')} (optionnel)`}
                        placeholder={t('cityPlaceholder')}
                        {...register('city')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                        id="dimensions"
                        label={`${t('dimensions')} (optionnel)`}
                        placeholder={t('dimensionsPlaceholder')}
                        {...register('dimensions')}
                    />
                    <Input
                        id="space"
                        label={`${t('space')} (optionnel)`}
                        placeholder={t('spacePlaceholder')}
                        {...register('space')}
                    />
                </div>

                <Input
                    id="style"
                    label={`${t('style')} (optionnel)`}
                    placeholder={t('stylePlaceholder')}
                    {...register('style')}
                />
            </div>

            {/* Section : Notes + pièces jointes */}
            <div className="space-y-5">
                <Textarea
                    id="message"
                    label={`${t('message')} (optionnel)`}
                    placeholder={t('messagePlaceholder')}
                    className="min-h-[120px]"
                    {...register('message')}
                />

                {/* Upload fichiers */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700">
                        {t('attachments')}
                    </label>
                    <p className="text-xs text-neutral-400">{t('attachmentsHelp')}</p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={CONTACT_ATTACHMENT_ACCEPTED}
                        onChange={handleFileChange}
                        className="sr-only"
                        id="file-upload"
                        disabled={attachments.length >= CONTACT_ATTACHMENT_MAX_FILES}
                    />

                    {attachments.length < CONTACT_ATTACHMENT_MAX_FILES && (
                        <label
                            htmlFor="file-upload"
                            className="flex items-center gap-2 w-fit cursor-pointer rounded-md border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            {t('attachmentsAdd')}
                        </label>
                    )}

                    {attachments.length > 0 && (
                        <ul className="space-y-2">
                            {attachments.map((a) => (
                                <li
                                    key={a.id}
                                    className="flex items-center gap-3 rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2"
                                >
                                    <Paperclip className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                    <span className="text-sm text-neutral-600 truncate flex-1">
                                        {a.file.name}
                                    </span>
                                    <span className="text-xs text-neutral-400 shrink-0">
                                        {(a.file.size / 1024 / 1024).toFixed(1)} Mo
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(a.id)}
                                        className="text-neutral-400 hover:text-red-500 transition-colors"
                                        aria-label="Retirer le fichier"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto px-10" isLoading={isSubmitting}>
                {isSubmitting ? t('sending') : t('submit')}
            </Button>
        </form>
    );
}

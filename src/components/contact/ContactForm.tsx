'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

const createSchema = (t: any) => z.object({
    name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    subject: z.string().min(3, "Le sujet est requis"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export default function ContactForm() {
    const t = useTranslations('contact.form');
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zod schema creation with translations logic would ideally be dynamic,
    // For simplicity here we use hardcoded text or simplistic t usage.
    const schema = createSchema(t);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            addToast(t('success'), 'success');
            reset();
        } catch (error) {
            addToast(t('error'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    id="name"
                    label={t('name')}
                    placeholder={t('namePlaceholder')}
                    error={errors.name?.message}
                    {...register('name')}
                />
                <Input
                    id="email"
                    label={t('email')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    error={errors.email?.message}
                    {...register('email')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    id="phone"
                    label={t('phone')}
                    placeholder={t('phonePlaceholder')}
                    error={errors.phone?.message}
                    {...register('phone')}
                />
                <Input
                    id="subject"
                    label={t('subject')}
                    placeholder={t('subjectPlaceholder')}
                    error={errors.subject?.message}
                    {...register('subject')}
                />
            </div>

            <Textarea
                id="message"
                label={t('message')}
                placeholder={t('messagePlaceholder')}
                error={errors.message?.message}
                className="min-h-[150px]"
                {...register('message')}
            />

            <Button type="submit" className="w-full md:w-auto px-8" isLoading={isSubmitting}>
                {isSubmitting ? t('sending') : t('submit')}
            </Button>
        </form>
    );
}

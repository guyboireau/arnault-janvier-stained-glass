import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Database } from '@/types/database';
import { Resend } from 'resend';
import { CONTACT_ATTACHMENT_BUCKET, CONTACT_ATTACHMENT_MAX_SIZE_MB } from '@/lib/constants';

type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];

const contactSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    projectType: z.string().optional(),
    city: z.string().optional(),
    dimensions: z.string().optional(),
    style: z.string().optional(),
    space: z.string().optional(),
    message: z.string().optional(),
    locale: z.string().optional().default('fr'),
});

function buildStructuredMessage(data: {
    projectType?: string;
    city?: string;
    dimensions?: string;
    style?: string;
    space?: string;
    message?: string;
    attachmentUrls?: string[];
}): string {
    const lines: string[] = [];

    if (data.projectType) lines.push(`Type de projet : ${data.projectType}`);
    if (data.city) lines.push(`Ville : ${data.city}`);
    if (data.dimensions) lines.push(`Dimensions : ${data.dimensions}`);
    if (data.style) lines.push(`Style : ${data.style}`);
    if (data.space) lines.push(`Espace : ${data.space}`);
    if (data.message) lines.push(`\nNotes : ${data.message}`);
    if (data.attachmentUrls?.length) {
        lines.push(`\nPièces jointes :\n${data.attachmentUrls.map((u) => `- ${u}`).join('\n')}`);
    }

    return lines.join('\n');
}

function buildEmailHtml(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    projectType?: string;
    city?: string;
    dimensions?: string;
    style?: string;
    space?: string;
    message?: string;
    attachmentUrls?: string[];
    locale: string;
}): string {
    const projectRows = [
        data.projectType ? `<p><strong>Type de projet :</strong> ${data.projectType}</p>` : '',
        data.city ? `<p><strong>Ville :</strong> ${data.city}</p>` : '',
        data.dimensions ? `<p><strong>Dimensions :</strong> ${data.dimensions}</p>` : '',
        data.style ? `<p><strong>Style :</strong> ${data.style}</p>` : '',
        data.space ? `<p><strong>Espace :</strong> ${data.space}</p>` : '',
    ]
        .filter(Boolean)
        .join('');

    const attachmentsHtml =
        data.attachmentUrls?.length
            ? `<div style="margin:20px 0;">
                <h3 style="margin-top:0;">Pièces jointes :</h3>
                <ul>${data.attachmentUrls.map((u) => `<li><a href="${u}">${u}</a></li>`).join('')}</ul>
               </div>`
            : '';

    return `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0369a1;">Nouveau message de contact</h2>
            <p>Vous avez reçu une nouvelle demande depuis votre site vitrine.</p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nom :</strong> ${data.name}</p>
                <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
                <p><strong>Objet :</strong> ${data.subject}</p>
            </div>

            ${projectRows ? `<div style="background:#fff;border-left:4px solid #0369a1;padding:20px;margin:20px 0;">
                <h3 style="margin-top:0;">Détails du projet :</h3>
                ${projectRows}
            </div>` : ''}

            ${data.message ? `<div style="background:#fff;border-left:4px solid #d4a017;padding:20px;margin:20px 0;">
                <h3 style="margin-top:0;">Notes :</h3>
                <p style="white-space:pre-wrap;">${data.message}</p>
            </div>` : ''}

            ${attachmentsHtml}

            <p style="color:#737373;font-size:14px;">Pour répondre : <a href="mailto:${data.email}">${data.email}</a></p>
        </div>
    `;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const rawData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: (formData.get('phone') as string) || undefined,
            subject: formData.get('subject') as string,
            projectType: (formData.get('projectType') as string) || undefined,
            city: (formData.get('city') as string) || undefined,
            dimensions: (formData.get('dimensions') as string) || undefined,
            style: (formData.get('style') as string) || undefined,
            space: (formData.get('space') as string) || undefined,
            message: (formData.get('message') as string) || undefined,
            locale: (formData.get('locale') as string) || 'fr',
        };

        const validation = contactSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid data', details: validation.error }, { status: 400 });
        }

        const data = validation.data;
        const files = formData.getAll('files') as File[];

        // Upload des fichiers dans Supabase Storage
        const supabase = createClient();
        const attachmentUrls: string[] = [];

        if (files.length > 0) {
            const maxBytes = CONTACT_ATTACHMENT_MAX_SIZE_MB * 1024 * 1024;
            const timestamp = Date.now();

            for (const file of files.slice(0, 5)) {
                if (!(file instanceof File) || file.size === 0) continue;
                if (file.size > maxBytes) continue;

                const ext = file.name.split('.').pop() ?? 'bin';
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const path = `${timestamp}/${safeName}`;

                const arrayBuffer = await file.arrayBuffer();
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(CONTACT_ATTACHMENT_BUCKET)
                    .upload(path, arrayBuffer, { contentType: file.type || `application/${ext}` });

                if (!uploadError && uploadData) {
                    const { data: publicUrlData } = supabase.storage
                        .from(CONTACT_ATTACHMENT_BUCKET)
                        .getPublicUrl(path);
                    if (publicUrlData?.publicUrl) {
                        attachmentUrls.push(publicUrlData.publicUrl);
                    }
                } else {
                    console.error('Storage upload error:', uploadError);
                }
            }
        }

        const fullName = `${data.firstName} ${data.lastName}`;
        const structuredMessage = buildStructuredMessage({
            projectType: data.projectType,
            city: data.city,
            dimensions: data.dimensions,
            style: data.style,
            space: data.space,
            message: data.message,
            attachmentUrls,
        });

        // Sauvegarde en base
        const submissionData: ContactSubmissionInsert = {
            name: fullName,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: structuredMessage || '(aucune note)',
            locale: data.locale,
            is_read: false,
        };

        const { error: dbError } = await supabase
            .from('contact_submissions')
            // @ts-ignore
            .insert(submissionData);

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Envoi email via Resend
        try {
            const resendApiKey = process.env.RESEND_API_KEY;
            const contactEmailTo = process.env.CONTACT_EMAIL_TO || 'arnault.janvier1@gmail.com';
            const contactEmailFrom = process.env.CONTACT_EMAIL_FROM || 'noreply@arnault-janvier.fr';

            if (resendApiKey) {
                const resend = new Resend(resendApiKey);
                const html = buildEmailHtml({
                    name: fullName,
                    email: data.email,
                    phone: data.phone,
                    subject: data.subject,
                    projectType: data.projectType,
                    city: data.city,
                    dimensions: data.dimensions,
                    style: data.style,
                    space: data.space,
                    message: data.message,
                    attachmentUrls,
                    locale: data.locale,
                });

                const { error: emailError } = await resend.emails.send({
                    from: contactEmailFrom,
                    to: contactEmailTo,
                    subject: `[Contact] ${data.subject}`,
                    html,
                    reply_to: data.email,
                });

                if (emailError) {
                    console.error('Email Error:', emailError);
                }
            }
        } catch (emailError) {
            console.error('Unexpected email error:', emailError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

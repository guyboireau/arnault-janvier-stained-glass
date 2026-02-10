import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Database } from '@/types/database';
import { Resend } from 'resend';

type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10),
    locale: z.string().optional().default('fr'),
});

// Email templates based on locale
const getEmailTemplate = (locale: string, data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    const templates = {
        fr: {
            subject: `[Contact] ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Nouveau message de contact</h2>
                    <p>Vous avez reçu un nouveau message depuis votre site vitrine.</p>

                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Nom :</strong> ${data.name}</p>
                        <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
                        <p><strong>Sujet :</strong> ${data.subject}</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Message :</h3>
                        <p style="white-space: pre-wrap;">${data.message}</p>
                    </div>

                    <p style="color: #737373; font-size: 14px;">Pour répondre, utilisez directement l'adresse email : ${data.email}</p>
                </div>
            `,
        },
        en: {
            subject: `[Contact] ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">New contact message</h2>
                    <p>You have received a new message from your portfolio website.</p>

                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
                        <p><strong>Subject:</strong> ${data.subject}</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap;">${data.message}</p>
                    </div>

                    <p style="color: #737373; font-size: 14px;">To reply, use the email address directly: ${data.email}</p>
                </div>
            `,
        },
        es: {
            subject: `[Contacto] ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Nuevo mensaje de contacto</h2>
                    <p>Ha recibido un nuevo mensaje desde su sitio web.</p>

                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Nombre:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
                        <p><strong>Asunto:</strong> ${data.subject}</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Mensaje:</h3>
                        <p style="white-space: pre-wrap;">${data.message}</p>
                    </div>

                    <p style="color: #737373; font-size: 14px;">Para responder, use directamente la dirección de correo: ${data.email}</p>
                </div>
            `,
        },
    };

    return templates[locale as keyof typeof templates] || templates.fr;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate data
        const validationResult = contactSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({ error: 'Invalid data', details: validationResult.error }, { status: 400 });
        }

        const { name, email, phone, subject, message, locale } = validationResult.data;

        // Save to Supabase
        const supabase = createClient();
        const submissionData: ContactSubmissionInsert = {
            name,
            email,
            phone,
            subject,
            message,
            locale: locale || 'fr',
            is_read: false
        };
        const { error: dbError } = await supabase
            .from('contact_submissions')
            // @ts-ignore - Supabase typing issue with insert
            .insert(submissionData);

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Send email via Resend
        try {
            const resendApiKey = process.env.RESEND_API_KEY;
            const contactEmailTo = process.env.CONTACT_EMAIL_TO || 'contact@arnault-janvier.fr';
            const contactEmailFrom = process.env.CONTACT_EMAIL_FROM || 'noreply@arnault-janvier.fr';

            if (resendApiKey) {
                const resend = new Resend(resendApiKey);
                const emailTemplate = getEmailTemplate(locale || 'fr', { name, email, phone, subject, message });

                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: contactEmailFrom,
                    to: contactEmailTo,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                    reply_to: email,
                });

                if (emailError) {
                    console.error('Email Error:', emailError);
                    // Don't fail the request if email fails - data is already in DB
                    console.warn('Contact form submitted successfully but email notification failed');
                } else {
                    console.log('Email sent successfully:', emailData);
                }
            } else {
                console.warn('RESEND_API_KEY not configured - skipping email notification');
            }
        } catch (emailError) {
            console.error('Unexpected email error:', emailError);
            // Continue - form submission was successful even if email failed
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

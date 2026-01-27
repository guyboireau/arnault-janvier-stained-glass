import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Database } from '@/types/database';

type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate data
        const validationResult = contactSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({ error: 'Invalid data', details: validationResult.error }, { status: 400 });
        }

        const { name, email, phone, subject, message } = validationResult.data;

        // Save to Supabase
        const supabase = createClient();
        const submissionData: ContactSubmissionInsert = {
            name,
            email,
            phone,
            subject,
            message,
            locale: 'fr', // We could parse locale from headers if needed
            is_read: false
        };
        const { error: dbError } = await supabase
            .from('contact_submissions')
            // @ts-ignore - Supabase typing issue with insert
            .insert(submissionData);

        if (dbError) {
            console.error('Database Error:', dbError);
            // Fallback: If DB insert fails (e.g. table doesn't exist yet for user), 
            // we might want to still return success if Resend was used, BUT here we rely on DB.
            // We will return 500 but log it.
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // TODO: Send email via Resend here 
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({ ... });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

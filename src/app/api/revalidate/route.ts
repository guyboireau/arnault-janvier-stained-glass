import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * API Route for on-demand revalidation of ISR cached pages
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { x-revalidate-token: "your-secret-token" }
 * Body: { paths: ["/gallery", "/gallery/my-project"] }
 *
 * Response: { revalidated: true, paths: [...] } or { error: "..." }
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication token
        const token = request.headers.get('x-revalidate-token');
        const expectedToken = process.env.REVALIDATE_TOKEN;

        if (!expectedToken) {
            console.error('REVALIDATE_TOKEN not configured in environment variables');
            return NextResponse.json(
                { error: 'Revalidation not configured' },
                { status: 500 }
            );
        }

        if (token !== expectedToken) {
            console.warn('Invalid revalidation token attempt');
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { paths } = body;

        if (!paths || !Array.isArray(paths) || paths.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: paths array required' },
                { status: 400 }
            );
        }

        // Validate paths
        const validPaths = paths.filter((path) => typeof path === 'string' && path.startsWith('/'));

        if (validPaths.length === 0) {
            return NextResponse.json(
                { error: 'No valid paths provided' },
                { status: 400 }
            );
        }

        // Revalidate each path
        const results = [];
        for (const path of validPaths) {
            try {
                revalidatePath(path);
                results.push({ path, success: true });
                console.log(`Revalidated path: ${path}`);
            } catch (error) {
                console.error(`Failed to revalidate path: ${path}`, error);
                results.push({ path, success: false, error: String(error) });
            }
        }

        // Check if any revalidation failed
        const hasFailures = results.some((result) => !result.success);

        return NextResponse.json(
            {
                revalidated: !hasFailures,
                results,
                message: hasFailures
                    ? 'Some paths failed to revalidate'
                    : 'All paths revalidated successfully',
            },
            { status: hasFailures ? 207 : 200 } // 207 Multi-Status for partial success
        );

    } catch (error) {
        console.error('Revalidation API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: String(error) },
            { status: 500 }
        );
    }
}

// Optional: Support GET request to check API status
export async function GET() {
    const isConfigured = !!process.env.REVALIDATE_TOKEN;

    return NextResponse.json({
        status: 'Revalidation API',
        configured: isConfigured,
        usage: 'POST with x-revalidate-token header and { paths: [...] } body',
    });
}

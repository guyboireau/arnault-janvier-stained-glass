import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route pour récupérer les posts Instagram
 *
 * Utilise l'Instagram Graph API (remplacement de l'API Basic Display dépréciée en déc. 2024)
 * Endpoint : https://graph.instagram.com/v21.0/me/media
 *
 * Prérequis :
 * 1. Compte Instagram Business ou Creator
 * 2. App Facebook sur https://developers.facebook.com
 * 3. Configurer "Instagram" (avec Instagram Login) dans l'app
 * 4. Générer un access token via le flux OAuth Instagram Login
 * 5. Échanger contre un token longue durée (60 jours)
 * 6. Ajouter à .env.local :
 *    INSTAGRAM_ACCESS_TOKEN=votre-token-longue-durée
 *
 * Le token longue durée expire après 60 jours.
 * Utiliser le POST /api/instagram avec action "refresh-token" pour le renouveler.
 * Recommandé : mettre en place un cron job tous les 50 jours.
 */

const INSTAGRAM_API_VERSION = 'v21.0';
const INSTAGRAM_API_BASE = `https://graph.instagram.com/${INSTAGRAM_API_VERSION}`;

export async function GET(request: NextRequest) {
    try {
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!accessToken) {
            console.warn('INSTAGRAM_ACCESS_TOKEN non configuré');
            return NextResponse.json(
                {
                    error: 'Instagram API non configurée',
                    posts: []
                },
                { status: 200 }
            );
        }

        const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
        const limit = request.nextUrl.searchParams.get('limit') || '12';

        const response = await fetch(
            `${INSTAGRAM_API_BASE}/me/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`,
            {
                next: { revalidate: 3600 }, // Cache 1 heure
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.error?.message || response.statusText;
            console.error(`Instagram API error (${response.status}): ${errorMsg}`);
            throw new Error(`Instagram API error: ${errorMsg}`);
        }

        const data = await response.json();

        const posts = data.data?.map((post: any) => ({
            id: post.id,
            caption: post.caption || '',
            mediaType: post.media_type,
            mediaUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
            permalink: post.permalink,
            timestamp: post.timestamp,
        })) || [];

        return NextResponse.json({ posts });

    } catch (error) {
        console.error('Instagram API Error:', error);
        return NextResponse.json(
            {
                error: 'Échec de la récupération des posts Instagram',
                posts: []
            },
            { status: 200 }
        );
    }
}

/**
 * POST /api/instagram
 * Actions disponibles :
 * - "refresh-token" : renouvelle le token longue durée (à appeler avant expiration, tous les ~50 jours)
 */
export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        if (action === 'refresh-token') {
            const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

            if (!accessToken) {
                return NextResponse.json({ error: 'Token non configuré' }, { status: 400 });
            }

            const response = await fetch(
                `${INSTAGRAM_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMsg = errorData?.error?.message || response.statusText;
                throw new Error(`Erreur renouvellement token: ${errorMsg}`);
            }

            const data = await response.json();

            return NextResponse.json({
                message: 'Token renouvelé avec succès',
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                // ⚠️ En production, mettre à jour la variable d'env INSTAGRAM_ACCESS_TOKEN
                // avec la nouvelle valeur de data.access_token (via Vercel API, etc.)
            });
        }

        return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

    } catch (error) {
        console.error('Erreur renouvellement token:', error);
        return NextResponse.json({ error: 'Échec du renouvellement du token' }, { status: 500 });
    }
}

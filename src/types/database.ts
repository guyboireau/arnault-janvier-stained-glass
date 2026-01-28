export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    slug: string
                    name_fr: string
                    name_en: string | null
                    name_es: string | null
                    description_fr: string | null
                    description_en: string | null
                    description_es: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    name_fr: string
                    name_en?: string | null
                    name_es?: string | null
                    description_fr?: string | null
                    description_en?: string | null
                    description_es?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    name_fr?: string
                    name_en?: string | null
                    name_es?: string | null
                    description_fr?: string | null
                    description_en?: string | null
                    description_es?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    slug: string
                    title_fr: string
                    title_en: string | null
                    title_es: string | null
                    description_fr: string | null
                    description_en: string | null
                    description_es: string | null
                    content_fr: string | null
                    content_en: string | null
                    content_es: string | null
                    category_id: string | null
                    year: number | null
                    location: string | null
                    client_name: string | null
                    cover_image_url: string | null
                    images: Json
                    videos: Json
                    seo_title_fr: string | null
                    seo_title_en: string | null
                    seo_title_es: string | null
                    seo_description_fr: string | null
                    seo_description_en: string | null
                    seo_description_es: string | null
                    is_featured: boolean
                    is_published: boolean
                    display_order: number
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title_fr: string
                    title_en?: string | null
                    title_es?: string | null
                    description_fr?: string | null
                    description_en?: string | null
                    description_es?: string | null
                    content_fr?: string | null
                    content_en?: string | null
                    content_es?: string | null
                    category_id?: string | null
                    year?: number | null
                    location?: string | null
                    client_name?: string | null
                    cover_image_url?: string | null
                    images?: Json
                    videos?: Json
                    seo_title_fr?: string | null
                    seo_title_en?: string | null
                    seo_title_es?: string | null
                    seo_description_fr?: string | null
                    seo_description_en?: string | null
                    seo_description_es?: string | null
                    is_featured?: boolean
                    is_published?: boolean
                    display_order?: number
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title_fr?: string
                    title_en?: string | null
                    title_es?: string | null
                    description_fr?: string | null
                    description_en?: string | null
                    description_es?: string | null
                    content_fr?: string | null
                    content_en?: string | null
                    content_es?: string | null
                    category_id?: string | null
                    year?: number | null
                    location?: string | null
                    client_name?: string | null
                    cover_image_url?: string | null
                    images?: Json
                    videos?: Json
                    seo_title_fr?: string | null
                    seo_title_en?: string | null
                    seo_title_es?: string | null
                    seo_description_fr?: string | null
                    seo_description_en?: string | null
                    seo_description_es?: string | null
                    is_featured?: boolean
                    is_published?: boolean
                    display_order?: number
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            site_settings: {
                Row: {
                    id: string
                    key: string
                    value: Json
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value: Json
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: Json
                    updated_at?: string
                }
            }
            contact_submissions: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    subject: string | null
                    message: string
                    locale: string | null
                    ip_address: string | null
                    user_agent: string | null
                    is_read: boolean
                    is_archived: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    subject?: string | null
                    message: string
                    locale?: string | null
                    ip_address?: string | null
                    user_agent?: string | null
                    is_read?: boolean
                    is_archived?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    subject?: string | null
                    message?: string
                    locale?: string | null
                    ip_address?: string | null
                    user_agent?: string | null
                    is_read?: boolean
                    is_archived?: boolean
                    created_at?: string
                }
            }
            project_images: {
                Row: {
                    id: string
                    project_id: string
                    image_url: string
                    alt_text: string | null
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    image_url: string
                    alt_text?: string | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    image_url?: string
                    alt_text?: string | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

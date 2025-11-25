import { createClient } from '@supabase/supabase-js';
import { Cafe, Article } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function getCafes(): Promise<Cafe[]> {
    const { data, error } = await supabase
        .from("Shop")
        .select(`
        *,
        Seat (*),
        Menu (
            id,
            name,
            is_active,
            MenuItem (*)
        ),
        Review (
            id,
            rating,
            comment,
            user_id,
            created_at
        )
        `)
        .order("id", { ascending: true });

    if (error) {
        console.error("❌ Error fetching cafes:", error);
        throw error;
    }

    return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        hours: row.opening_hours_json?.general || "營業時間未提供",
        imageUrl: row.image_url,
        description: row.description || "暫無描述",
        seats: transformSeats(row.Seat),
        menu: row.Menu?.flatMap((m: any) => m.MenuItem || []) || [],
        reviews: row.Review || [],
        averageRating: row.average_rating,
        reviewGrowth: row.review_growth,
        tags: row.atmosphere_tags || [],
    }));
}

export async function getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
        .from('Article')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }

    return data || [];
}

function transformSeats(seatsData: any[]): any {
    const defaultSeat = { total: 0, available: 0 };
    const result: any = {
        total: { ...defaultSeat },
        outlet: { ...defaultSeat },
        window: { ...defaultSeat },
        noAc: { ...defaultSeat }
    };

    if (!seatsData || !Array.isArray(seatsData)) return result;

    seatsData.forEach(seat => {
        // Map DB type to frontend key if necessary, or assume they match
        // Assuming DB types: 'total', 'outlet', 'window', 'noAc'
        // If DB uses different names, we might need a mapping here
        const type = seat.type;
        if (type && result[type]) {
            result[type] = {
                total: seat.total,
                available: seat.available
            };
        }
    });

    return result;
}
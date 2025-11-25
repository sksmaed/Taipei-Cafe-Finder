import { createClient } from '@supabase/supabase-js';
import { Cafe } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function getCafes(): Promise<Cafe[]> {
    const { data, error } = await supabase
        .from('Shop')
        .select('*, Seat(*)');

    if (error) {
        console.error('Error fetching cafes:', error);
        throw error;
    }

    return data.map((cafe: any) => ({
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        hours: cafe.opening_hours_json?.general || '營業時間未提供',
        imageUrl: cafe.image_url,
        description: cafe.description || '暫無描述',
        seats: transformSeats(cafe.Seat),
        menu: cafe.menu || [],
        reviews: cafe.reviews || [],
        averageRating: cafe.average_rating,
        reviewGrowth: cafe.review_growth,
        tags: cafe.atmosphere_tags || [],
    }));
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

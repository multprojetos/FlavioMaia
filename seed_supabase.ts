
import { createClient } from '@supabase/supabase-js';
import { mockProperties } from './shared/mockData';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Checking for existing properties...');

    const { data: existing, error: fetchError } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

    if (fetchError) {
        console.error('Error fetching properties:', fetchError);
        return;
    }

    if (existing && existing.length > 0) {
        console.log('Database already has properties. Deleting old ones to refresh with new mock data...');
        const { error: deleteError } = await supabase
            .from('properties')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
            console.error('Error deleting properties:', deleteError);
            return;
        }
    }

    console.log(`Inserting ${mockProperties.length} properties...`);

    const propertiesToInsert = mockProperties.map(p => ({
        title: p.title,
        description: p.description,
        type: p.type,
        operation: p.operation,
        status: p.status,
        price: p.price,
        city: p.location.city,
        neighborhood: p.location.neighborhood,
        address: p.location.address,
        bedrooms: p.details.bedrooms,
        bathrooms: p.details.bathrooms,
        garages: p.details.garages,
        area: p.details.area,
        features: p.details.features,
        images: p.images,
        featured: p.featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('properties')
        .insert(propertiesToInsert);

    if (error) {
        console.error('Error inserting properties:', error);
    } else {
        console.log('Successfully seeded database with realistic properties!');
    }
}

seed();

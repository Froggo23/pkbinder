import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // 1. Basic security check using a Cron Secret
    // Users must set CRON_SECRET in Vercel environment variables
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log('[Cron] Running Supabase keep-alive ping...');

        // Perform a simple query to keep the project active
        const { data, error } = await supabase.from('binders').select('id').limit(1);

        if (error) {
            console.error('[Cron] Supabase ping failed:', error.message);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase pinged successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

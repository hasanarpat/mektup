import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, recipient, sender, body: letterBody, stickers, paper_theme, font } = body;

        if (!recipient?.trim() || !letterBody?.trim()) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (letterBody.length > 10000) {
            return NextResponse.json({ error: 'Letter too long' }, { status: 400 });
        }

        const { data, error } = await getSupabase()
            .from('letters')
            .insert({
                type: type ?? 'custom',
                recipient: recipient.trim(),
                sender: sender?.trim() ?? '',
                body: letterBody.trim(),
                stickers: stickers ?? [],
                paper_theme: paper_theme ?? 'cream',
                font: font ?? 'cormorant',
            })
            .select('slug')
            .single();

        if (error || !data) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
        }

        return NextResponse.json({ slug: data.slug });
    } catch (err) {
        console.error('Letters API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

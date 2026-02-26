import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
    try {
        const { text, type, recipient } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
        }

        const systemPrompt = `You are a thoughtful writing assistant helping someone polish a heartfelt ${type} letter.
Your job is to improve the letter's clarity, emotional depth, and flow — while keeping the writer's unique voice intact.
Do NOT change the meaning, add new facts, or make it sound generic.
Return ONLY the improved letter text. No commentary, no greetings, no explanation — just the polished letter body.
The letter is addressed to "${recipient}".`;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: systemPrompt + '\n\nOriginal letter:\n' + text },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Gemini API error' }, { status: 502 });
        }

        const data = await response.json();
        const polished = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        if (!polished) {
            return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
        }

        return NextResponse.json({ polished });
    } catch (err) {
        console.error('Polish API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

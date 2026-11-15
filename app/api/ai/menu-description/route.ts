import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getOwnerFromSessionToken, OWNER_SESSION_COOKIE } from '@/lib/server/ownerAuth';
import type { MenuLanguage } from '@/lib/types/menu';

const languages: Record<MenuLanguage, string> = {
  ar: 'Arabic',
  fr: 'French',
  en: 'English',
};

function isMenuLanguage(value: unknown): value is MenuLanguage {
  return value === 'ar' || value === 'fr' || value === 'en';
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const owner = await getOwnerFromSessionToken(cookieStore.get(OWNER_SESSION_COOKIE)?.value);
  if (!owner) {
    return NextResponse.json({ error: 'Sign in to request a description suggestion.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send valid dish details.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Send valid dish details.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const facts = typeof input.facts === 'string' ? input.facts.trim() : '';
  const language = input.language;

  if (!name || name.length > 120 || facts.length > 1200 || !isMenuLanguage(language)) {
    return NextResponse.json({ error: 'Add a dish name and choose a supported menu language.' }, { status: 400 });
  }

  const apiKey = process.env.MENU_AI_API_KEY;
  const model = process.env.MENU_AI_MODEL;
  const baseUrl = (process.env.MENU_AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const endpoint = process.env.MENU_AI_CHAT_COMPLETIONS_URL || `${baseUrl}/chat/completions`;

  if (!apiKey || !model) {
    return NextResponse.json({
      error: 'AI description suggestions are not configured. Set MENU_AI_API_KEY and MENU_AI_MODEL on the server, then restart MenuCraft.',
      code: 'AI_NOT_CONFIGURED',
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const systemPrompt = [
    `Write exactly one concise menu description in ${languages[language]}.`,
    'Use only the dish name and facts supplied by the restaurant owner.',
    'Do not add or infer ingredients, allergens, dietary claims, origin, cooking method, or other concrete details.',
    'If the supplied facts are sparse, keep the description neutral and brief.',
    'Return only the description text, without quotes, a heading, or commentary.',
  ].join(' ');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 100,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ name, facts }) },
        ],
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'The AI provider could not create a suggestion. Your menu description was not changed; try again.' }, { status: 502 });
    }

    const result: unknown = await response.json();
    const content = typeof result === 'object' && result !== null &&
      'choices' in result && Array.isArray(result.choices) &&
      typeof result.choices[0] === 'object' && result.choices[0] !== null &&
      'message' in result.choices[0] && typeof result.choices[0].message === 'object' &&
      result.choices[0].message !== null && 'content' in result.choices[0].message &&
      typeof result.choices[0].message.content === 'string'
      ? result.choices[0].message.content.trim()
      : '';

    if (!content || content.length > 600) {
      return NextResponse.json({ error: 'The AI provider returned an unusable suggestion. Your menu description was not changed; try again.' }, { status: 502 });
    }

    return NextResponse.json({ description: content }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'The AI provider is unavailable right now. Your menu description was not changed; try again.' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prompts } from '../../lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readingId } = body;

    if (!readingId) {
      return NextResponse.json(
        { error: 'Reading ID is required' },
        { status: 400 }
      );
    }

    const prompt = prompts[readingId];
    
    if (!prompt) {
      return NextResponse.json(
        { error: `No prompt found for reading ID: ${readingId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

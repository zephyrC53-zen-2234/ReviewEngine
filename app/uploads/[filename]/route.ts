import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
export async function GET(_request: Request, { params }: {
    params: Promise<{
        filename: string;
    }>;
}) {
    const { filename } = await params;
    if (!/^[a-f0-9-]+\.(png|jpg|webp)$/.test(filename))
        return new NextResponse(null, { status: 404 });
    try {
        const data = await readFile(join(process.cwd(), 'data/uploads', filename));
        const type = filename.endsWith('.png') ? 'image/png' : filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
        return new NextResponse(data, { headers: { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' } });
    }
    catch {
        return new NextResponse(null, { status: 404 });
    }
}

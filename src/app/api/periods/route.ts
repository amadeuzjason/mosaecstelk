import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const periods = await prisma.period.findMany({
      orderBy: {
        period: 'desc',
      },
    });
    return NextResponse.json(periods);
  } catch (error) {
    console.error('Error fetching periods:', error);
    return NextResponse.json({ error: 'Error fetching periods' }, { status: 500 });
  }
}

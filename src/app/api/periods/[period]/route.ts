import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { period: string } }
) {
  const periodNumber = parseInt(params.period);

  if (isNaN(periodNumber)) {
    return NextResponse.json({ error: 'Invalid period number' }, { status: 400 });
  }

  try {
    const periodData = await prisma.period.findUnique({
      where: {
        period: periodNumber,
      },
      include: {
        members: true,
      },
    });

    if (!periodData) {
      // Return empty object or specific error handling if preferred, 
      // but for now 404 is appropriate if period strictly doesn't exist.
      // However, to prevent frontend crash if it expects data, we might return empty object?
      // Frontend handles undefined check: `const currentData = data[period] || data[31];`
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    const formattedData: Record<string, any> = {
      periodImage: periodData.image
    };
    
    periodData.members.forEach(member => {
      formattedData[member.position] = {
        name: member.name,
        ig: member.ig,
        image: member.image,
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching period data:', error);
    return NextResponse.json({ error: 'Error fetching period data' }, { status: 500 });
  }
}

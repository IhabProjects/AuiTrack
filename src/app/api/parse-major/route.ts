import { NextRequest, NextResponse } from 'next/server';
import { parseMajorPDF, getSchools } from '@/lib/pdfParser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const school = searchParams.get('school');
    const major = searchParams.get('major');

    if (!school && !major) {
      // If no school or major is specified, return the list of schools and their majors
      const schools = await getSchools();
      return NextResponse.json({ schools });
    }

    if (!school || !major) {
      return NextResponse.json(
        { error: 'Both school and major parameters are required' },
        { status: 400 }
      );
    }

    // Parse the specified major's requirements
    const requirements = await parseMajorPDF(school, major);
    return NextResponse.json(requirements);
  } catch (error) {
    console.error('Error in parse-major API:', error);
    return NextResponse.json(
      { error: 'Failed to parse major requirements' },
      { status: 500 }
    );
  }
}

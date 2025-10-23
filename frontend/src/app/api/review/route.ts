import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, authorName, authorEmail, productId } = body;

    // Validate required fields
    if (!rating || !authorName || !authorEmail || !productId) {
      console.error('Missing required fields:', { rating, authorName, authorEmail, productId });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Received review data:', { rating, comment, authorName, authorEmail, productId });

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create review in Strapi
    const reviewData = {
      data: {
        rating,
        comment: comment || null,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        product: productId,
        isApproved: false, // Reviews need moderation
      }
    };

    console.log('Sending review data to Strapi:', reviewData);
    console.log('Strapi URL:', `${process.env.NEXT_PUBLIC_CMS_URL}/api/reviews`);

    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(reviewData),
    });

    console.log('Strapi response status:', strapiResponse.status);
    console.log('Strapi response headers:', Object.fromEntries(strapiResponse.headers.entries()));

    if (!strapiResponse.ok) {
      const error = await strapiResponse.text();
      console.error('Strapi error response:', error);
      return NextResponse.json(
        { message: `Failed to create review: ${error}` },
        { status: 500 }
      );
    }

    const responseData = await strapiResponse.json();
    console.log('Strapi success response:', responseData);

    return NextResponse.json(
      { message: 'Review submitted successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

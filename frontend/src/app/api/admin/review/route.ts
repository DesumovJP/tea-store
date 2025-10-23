import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'isApproved must be a boolean' },
        { status: 400 }
      );
    }

    console.log('Updating review:', reviewId, 'isApproved:', isApproved);
    console.log('Using API token:', process.env.STRAPI_API_TOKEN ? 'Present' : 'Missing');

    if (!process.env.STRAPI_API_TOKEN) {
      return NextResponse.json(
        { error: 'STRAPI_API_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: { isApproved }
      }),
    });

    console.log('Strapi response status:', strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error('Strapi error response:', errorText);
      return NextResponse.json(
        { error: `Strapi error: ${strapiResponse.status} ${errorText}` },
        { status: strapiResponse.status }
      );
    }

    const result = await strapiResponse.json();
    console.log('Review updated successfully:', result);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting review:', reviewId);

    if (!process.env.STRAPI_API_TOKEN) {
      return NextResponse.json(
        { error: 'STRAPI_API_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    console.log('Strapi delete response status:', strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error('Strapi delete error response:', errorText);
      return NextResponse.json(
        { error: `Strapi error: ${strapiResponse.status} ${errorText}` },
        { status: strapiResponse.status }
      );
    }

    console.log('Review deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

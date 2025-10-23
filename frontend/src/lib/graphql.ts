export type MaybeArray<T> = T | T[] | null | undefined;

export type GqlImage = {
  url: string;
  alternativeText?: string | null;
};

export type Category = {
  documentId: string;
  name: string;
  image?: MaybeArray<GqlImage>;
};

export type Review = {
  documentId: string;
  rating: number;
  comment?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: string;
  product?: { slug: string; title: string } | null;
  isApproved?: boolean;
};

export type Product = {
  documentId: string;
  slug: string;
  title: string;
  price: number;
  description?: string | null;
  shortDescription?: string | null;
  category?: { documentId: string; name: string } | null;
  images?: GqlImage[];
  reviews?: Review[];
};

export type BlockImg = {
  documentId: string;
  ImgId: number | string;
  image?: GqlImage | null;
};

export async function fetchProducts(): Promise<Product[]> {
  const query = `
    query {
      products(pagination: { page: 1, pageSize: 200 }, sort: "createdAt:desc") {
        documentId
        slug
        title
        price
        description
        shortDescription
        category {
          documentId
          name
        }
        images {
          url
          alternativeText
        }
        reviews(filters: { isApproved: { eq: true } }) {
          documentId
          rating
          comment
          authorName
          createdAt
        }
      }
    }
  `;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json: { data?: { products?: Product[] }; errors?: Array<{ message?: string }> } = await res.json();

    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      const hasPermissionError = json.errors.some((error) => {
        const msg = error?.message ?? '';
        return msg.includes('Forbidden') || msg.includes('permission') || msg.includes('access');
      });
      if (hasPermissionError) {
        console.error('Permission error detected. Please check Strapi permissions for Public role.');
        console.error('Go to: Settings → Users & Permissions Plugin → Roles → Public');
        console.error('Enable: find, findOne for Product, Category, and Review');
      }
      return [];
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 GraphQL products response:', json.data?.products?.length || 0, 'products');
    }
    return json.data?.products || [];
  } catch (error) {
    console.error('Network error fetching products:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const query = `
    query {
      categories {
        documentId
        name
        image {
          url
          alternativeText
        }
      }
    }
  `;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json: { data?: { categories?: Category[] }; errors?: Array<{ message?: string }> } = await res.json();

    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      const hasPermissionError = json.errors.some((error) => {
        const msg = error?.message ?? '';
        return msg.includes('Forbidden') || msg.includes('permission') || msg.includes('access');
      });
      if (hasPermissionError) {
        console.error('Permission error detected. Please check Strapi permissions for Public role.');
        console.error('Go to: Settings → Users & Permissions Plugin → Roles → Public');
        console.error('Enable: find, findOne for Product, Category, and Review');
      }
      return [];
    }

    return json.data?.categories || [];
  } catch (error) {
    console.error('Network error fetching categories:', error);
    return [];
  }
}

// Fetch upload files by folder path contains (e.g., "/heroimgs")
// Removed legacy upload-files helper (switched to dedicated BlockImg content type)

// Fetch BlockImg entries for hero slider
export async function fetchBlockImgs(documentIds?: string[]): Promise<BlockImg[]> {
  const withFilter = Array.isArray(documentIds) && documentIds.length > 0;

  const queryWithFilter = `
      query ($ids: [ID!]) {
        blockImgs(filters: { documentId: { in: $ids } }, pagination: { pageSize: 50 }, sort: "ImgId:asc") {
          documentId
          ImgId
          image { url alternativeText }
        }
      }
    `;

  const queryNoFilter = `
      query {
        blockImgs(pagination: { pageSize: 50 }, sort: "ImgId:asc") {
          documentId
          ImgId
          image { url alternativeText }
        }
      }
    `;

  const body = withFilter
    ? { query: queryWithFilter, variables: { ids: documentIds } }
    : { query: queryNoFilter };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json: { data?: { blockImgs?: BlockImg[] }; errors?: unknown } = await res.json();
    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      return [];
    }

    return json.data?.blockImgs || [];
  } catch (error) {
    console.error('Network error fetching BlockImgs:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const query = `
      query ($slug: String!) {
        products(filters: { slug: { eq: $slug } }) {
          documentId
          slug
          title
          description
          shortDescription
          price
          category {
            documentId
            name
          }
          images { url alternativeText }
          reviews(filters: { isApproved: { eq: true } }) {
            documentId
            rating
            comment
            authorName
            authorEmail
            createdAt
          }
        }
      }
    `;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json: { data?: { products?: Product[] }; errors?: unknown } = await res.json();

    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      return null;
    }

    const items = json.data?.products ?? [];
    return items[0] ?? null;
  } catch (error) {
    console.error('Network error fetching product by slug:', error);
    return null;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const query = `
      query ($id: ID!) {
        product(id: $id) {
          documentId
          slug
          title
          description
          shortDescription
          price
          category {
            documentId
            name
          }
          images { url alternativeText }
          reviews(filters: { isApproved: { eq: true } }) {
            documentId
            rating
            comment
            authorName
            authorEmail
            createdAt
          }
        }
      }
    `;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json: { data?: { product?: Product }; errors?: unknown } = await res.json();

    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      return null;
    }

    return json.data?.product ?? null;
  } catch (error) {
    console.error('Network error fetching product by id:', error);
    return null;
  }
}

// Helper function to calculate average rating
export function calculateAverageRating(reviews: Array<{ rating: number }>): number {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// Fetch top 5-star reviews across products
export async function fetchLatestReviews(limit: number = 6): Promise<Review[]> {
  const query = `
      query ($limit: Int) {
        reviews(filters: { isApproved: { eq: true } }, pagination: { page: 1, pageSize: $limit }, sort: "createdAt:desc") {
          documentId
          rating
          comment
          authorName
          createdAt
          product { slug title }
        }
      }
    `;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { limit } }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GraphQL error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json: { data?: { reviews?: Review[] }; errors?: unknown } = await res.json();
    if (json.errors) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL errors:', json.errors);
      }
      return [];
    }

    return json.data?.reviews || [];
  } catch (error) {
    console.error('Network error fetching latest reviews:', error);
    return [];
  }
}

// Тест Strapi API для відгуків
const testStrapiAPI = async () => {
    const testData = {
        data: {
            rating: 5,
            comment: "Test review",
            authorName: "Test User",
            authorEmail: "test@example.com",
            product: "1", // Замініть на реальний ID продукту
            isApproved: false
        }
    };

    try {
        console.log('Testing Strapi API...');
        console.log('URL: http://localhost:1337/api/reviews');
        console.log('Data:', JSON.stringify(testData, null, 2));

        const response = await fetch('http://localhost:1337/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.text();
        console.log('Response body:', result);

        if (response.ok) {
            console.log('✅ API test successful!');
        } else {
            console.log('❌ API test failed!');
        }

        return response;
    } catch (error) {
        console.error('❌ Network error:', error);
        return null;
    }
};

// Запустити тест
testStrapiAPI();

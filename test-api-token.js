// Тест API токену для Strapi
const testAPIToken = async () => {
    const token = process.env.STRAPI_API_TOKEN || 'your_token_here';
    const baseUrl = 'http://localhost:1337';
    
    console.log('Testing API Token...');
    console.log('Token present:', token ? 'Yes' : 'No');
    console.log('Base URL:', baseUrl);
    
    try {
        // Тест 1: Отримати список відгуків
        console.log('\n1. Testing GET /api/reviews...');
        const getResponse = await fetch(`${baseUrl}/api/reviews`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        console.log('GET Status:', getResponse.status);
        if (!getResponse.ok) {
            const error = await getResponse.text();
            console.error('GET Error:', error);
        } else {
            const data = await getResponse.json();
            console.log('GET Success:', data.data?.length || 0, 'reviews found');
        }
        
        // Тест 2: Спробувати оновити відгук (якщо є)
        if (getResponse.ok) {
            const reviews = await getResponse.json();
            if (reviews.data && reviews.data.length > 0) {
                const firstReview = reviews.data[0];
                console.log('\n2. Testing PUT /api/reviews/' + firstReview.id + '...');
                
                const putResponse = await fetch(`${baseUrl}/api/reviews/${firstReview.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        data: { isApproved: firstReview.attributes.isApproved }
                    }),
                });
                
                console.log('PUT Status:', putResponse.status);
                if (!putResponse.ok) {
                    const error = await putResponse.text();
                    console.error('PUT Error:', error);
                } else {
                    console.log('PUT Success: Review update works');
                }
            }
        }
        
    } catch (error) {
        console.error('Network Error:', error);
    }
};

// Запустити тест
testAPIToken();

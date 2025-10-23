// Тест GraphQL підключення
const testGraphQL = async () => {
    const query = `
        query {
            products {
                documentId
                title
                price
                category {
                    name
                }
            }
        }
    `;

    try {
        const response = await fetch('http://localhost:1337/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const result = await response.json();
        
        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
        } else {
            console.log('GraphQL Success:', result.data);
        }
        
        return result;
    } catch (error) {
        console.error('Network Error:', error);
        return null;
    }
};

// Запустити тест
testGraphQL();

/**
 * Script to create 20 real tea products
 * Run with: node scripts/create-tea-products.js
 */

const teaProducts = [
    // Black Teas
    {
        title: "Earl Grey",
        slug: "earl-grey",
        price: 45,
        description: "A classic black tea blend flavored with bergamot oil. This premium Earl Grey offers a bold, citrusy aroma and smooth, balanced flavor. Perfect for morning or afternoon, pairs beautifully with milk and honey.",
        shortDescription: "Classic bergamot-flavored black tea with bold, citrusy notes.",
        categoryName: "Black Tea"
    },
    {
        title: "English Breakfast",
        slug: "english-breakfast",
        price: 42,
        description: "A robust blend of black teas from Assam, Ceylon, and Kenya. Full-bodied with malty notes and a rich, energizing character. Ideal for starting your day with strength and flavor.",
        shortDescription: "Robust morning blend with malty, full-bodied character.",
        categoryName: "Black Tea"
    },
    {
        title: "Darjeeling First Flush",
        slug: "darjeeling-first-flush",
        price: 65,
        description: "Premium first flush Darjeeling from the foothills of the Himalayas. Delicate, floral, and slightly astringent with muscatel notes. A connoisseur's choice for afternoon tea.",
        shortDescription: "Premium Himalayan tea with delicate floral and muscatel notes.",
        categoryName: "Black Tea"
    },
    {
        title: "Assam Golden Tips",
        slug: "assam-golden-tips",
        price: 55,
        description: "High-grade Assam tea with golden tips. Rich, malty flavor with hints of honey and caramel. Smooth finish perfect for any time of day.",
        shortDescription: "Rich, malty Assam with golden tips and honey notes.",
        categoryName: "Black Tea"
    },
    {
        title: "Lapsang Souchong",
        slug: "lapsang-souchong",
        price: 58,
        description: "Smoky black tea from China's Wuyi Mountains. Pine-smoked over fires, offering a distinctive campfire aroma and bold, earthy flavor. Unique and memorable.",
        shortDescription: "Smoky Chinese black tea with distinctive pine-smoked character.",
        categoryName: "Black Tea"
    },
    
    // Green Teas
    {
        title: "Sencha Premium",
        slug: "sencha-premium",
        price: 48,
        description: "Japanese green tea with a fresh, grassy flavor and slight astringency. Rich in antioxidants, with a clean, vegetal taste. Best brewed at lower temperatures.",
        shortDescription: "Fresh Japanese green tea with grassy, vegetal notes.",
        categoryName: "Green Tea"
    },
    {
        title: "Dragon Well Longjing",
        slug: "dragon-well-longjing",
        price: 62,
        description: "Premium Chinese green tea from Hangzhou. Flat, jade-colored leaves produce a sweet, nutty flavor with a smooth, buttery finish. One of China's most famous teas.",
        shortDescription: "Premium Chinese green tea with sweet, nutty, buttery notes.",
        categoryName: "Green Tea"
    },
    {
        title: "Matcha Ceremonial Grade",
        slug: "matcha-ceremonial-grade",
        price: 75,
        description: "Highest quality Japanese matcha powder. Vibrant green color, smooth umami flavor, and rich in antioxidants. Perfect for traditional tea ceremony or modern lattes.",
        shortDescription: "Premium ceremonial grade matcha with smooth umami flavor.",
        categoryName: "Green Tea"
    },
    {
        title: "Gunpowder Green",
        slug: "gunpowder-green",
        price: 38,
        description: "Chinese green tea with tightly rolled leaves resembling gunpowder pellets. Bold, slightly smoky flavor that stands up well to multiple infusions.",
        shortDescription: "Bold Chinese green tea with tightly rolled leaves.",
        categoryName: "Green Tea"
    },
    {
        title: "Jasmine Pearl",
        slug: "jasmine-pearl",
        price: 52,
        description: "Hand-rolled green tea pearls scented with jasmine flowers. Delicate floral aroma with a sweet, refreshing taste. Beautiful to watch unfurl during brewing.",
        shortDescription: "Hand-rolled jasmine-scented green tea pearls.",
        categoryName: "Green Tea"
    },
    
    // White Teas
    {
        title: "Silver Needle",
        slug: "silver-needle",
        price: 68,
        description: "Premium white tea made from unopened buds covered in silvery-white down. Delicate, sweet, and honey-like with a light, refreshing character.",
        shortDescription: "Premium white tea with delicate, honey-like sweetness.",
        categoryName: "White Tea"
    },
    {
        title: "White Peony",
        slug: "white-peony",
        price: 45,
        description: "White tea with both buds and young leaves. Slightly fuller body than Silver Needle, with floral notes and a smooth, mellow taste.",
        shortDescription: "Mellow white tea with floral notes and smooth character.",
        categoryName: "White Tea"
    },
    
    // Oolong Teas
    {
        title: "Tie Guan Yin",
        slug: "tie-guan-yin",
        price: 58,
        description: "Classic Chinese oolong with a floral, orchid-like aroma. Smooth, slightly sweet with a lingering aftertaste. Can be steeped multiple times.",
        shortDescription: "Classic oolong with floral, orchid-like aroma and smooth taste.",
        categoryName: "Oolong Tea"
    },
    {
        title: "Da Hong Pao",
        slug: "da-hong-pao",
        price: 85,
        description: "Rare, premium oolong from Wuyi Mountains. Complex flavor with roasted, mineral notes and a long, sweet finish. Highly prized by tea connoisseurs.",
        shortDescription: "Rare premium oolong with complex roasted, mineral notes.",
        categoryName: "Oolong Tea"
    },
    {
        title: "Milk Oolong",
        slug: "milk-oolong",
        price: 55,
        description: "Naturally creamy oolong with a smooth, buttery texture and subtle milky sweetness. No actual milk added—the flavor comes from the tea itself.",
        shortDescription: "Naturally creamy oolong with buttery, milky sweetness.",
        categoryName: "Oolong Tea"
    },
    
    // Pu-erh Teas
    {
        title: "Aged Pu-erh",
        slug: "aged-pu-erh",
        price: 72,
        description: "Fermented and aged dark tea with earthy, complex flavors. Rich, smooth, and mellow with notes of wood and earth. Improves with age like fine wine.",
        shortDescription: "Aged fermented tea with earthy, complex, mellow flavors.",
        categoryName: "Pu-erh Tea"
    },
    {
        title: "Ripe Pu-erh",
        slug: "ripe-pu-erh",
        price: 48,
        description: "Post-fermented dark tea with deep, earthy flavor and smooth texture. Known for its digestive benefits and rich, satisfying taste.",
        shortDescription: "Post-fermented tea with deep, earthy, smooth character.",
        categoryName: "Pu-erh Tea"
    },
    
    // Herbal/Blends
    {
        title: "Chamomile Relaxation",
        slug: "chamomile-relaxation",
        price: 35,
        description: "Pure chamomile flowers for a calming, caffeine-free experience. Sweet, apple-like flavor perfect for evening relaxation and better sleep.",
        shortDescription: "Calming chamomile with sweet, apple-like flavor.",
        categoryName: "Herbal Tea"
    },
    {
        title: "Peppermint Fresh",
        slug: "peppermint-fresh",
        price: 32,
        description: "Refreshing peppermint leaves for a cool, invigorating experience. Natural digestive aid with a crisp, clean taste. Caffeine-free.",
        shortDescription: "Refreshing peppermint with cool, invigorating character.",
        categoryName: "Herbal Tea"
    },
    {
        title: "Rooibos Vanilla",
        slug: "rooibos-vanilla",
        price: 38,
        description: "South African rooibos blended with natural vanilla. Smooth, sweet, and naturally caffeine-free. Rich in antioxidants with a comforting flavor.",
        shortDescription: "Smooth rooibos with natural vanilla, sweet and comforting.",
        categoryName: "Herbal Tea"
    }
];

async function createProducts() {
    const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';
    const token = process.env.STRAPI_API_TOKEN;
    
    if (!token) {
        console.error('❌ STRAPI_API_TOKEN environment variable is required');
        process.exit(1);
    }
    
    console.log('🚀 Starting to create tea products...\n');
    
    // First, fetch categories to get their documentIds
    console.log('📋 Fetching categories...');
    const categoriesRes = await fetch(`${strapiUrl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `query {
                categories {
                    documentId
                    name
                }
            }`
        })
    });
    
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.data?.categories || [];
    
    if (categories.length === 0) {
        console.error('❌ No categories found. Please create categories first.');
        process.exit(1);
    }
    
    console.log(`✅ Found ${categories.length} categories\n`);
    
    // Create products
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of teaProducts) {
        try {
            // Find category documentId
            const category = categories.find(c => 
                c.name.toLowerCase() === product.categoryName.toLowerCase()
            );
            
            if (!category) {
                console.log(`⚠️  Category "${product.categoryName}" not found for "${product.title}". Skipping...`);
                errorCount++;
                continue;
            }
            
            // Create product via Next.js API route
            const formData = new FormData();
            formData.append('title', product.title);
            formData.append('slug', product.slug);
            formData.append('price', product.price.toString());
            formData.append('description', product.description);
            formData.append('shortDescription', product.shortDescription);
            formData.append('categoryId', category.documentId);
            
            // Use Next.js API route (assuming it's running on localhost:3000)
            const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/admin/product`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.text();
                console.error(`❌ Failed to create "${product.title}":`, response.status, error);
                errorCount++;
            } else {
                const result = await response.json();
                console.log(`✅ Created: ${product.title} (${product.categoryName})`);
                successCount++;
            }
            
            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ Error creating "${product.title}":`, error.message);
            errorCount++;
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total: ${teaProducts.length}`);
}

// Run the script
createProducts().catch(console.error);


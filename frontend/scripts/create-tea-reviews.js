/**
 * Script to add 1-3 unique realistic reviews to each tea product
 * Each review is unique with varied lengths and writing styles
 * Run with: node scripts/create-tea-reviews.js
 */

require('dotenv').config({ path: '.env.local' });

const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';
const token = process.env.STRAPI_API_TOKEN;

if (!token) {
    console.error('❌ STRAPI_API_TOKEN environment variable is required');
    process.exit(1);
}

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate unique names and emails
const firstNames = ['Sarah', 'James', 'Emma', 'Michael', 'Olivia', 'David', 'Sophia', 'Robert', 'Isabella', 'William', 'Mia', 'Richard', 'Amelia', 'Joseph', 'Charlotte', 'Thomas', 'Harper', 'Charles', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Anthony', 'Elizabeth', 'Mark', 'Sofia', 'Donald', 'Avery', 'Steven', 'Ella', 'Paul', 'Scarlett', 'Andrew', 'Victoria', 'Joshua', 'Aria', 'Kenneth', 'Grace', 'Kevin', 'Chloe', 'Brian', 'Penelope', 'George', 'Layla', 'Edward', 'Riley', 'Ronald', 'Zoey', 'Timothy', 'Lillian', 'Jason', 'Addison', 'Jeffrey', 'Eleanor', 'Ryan', 'Natalie', 'Jacob', 'Luna', 'Gary', 'Hannah', 'Nicholas', 'Lily', 'Eric', 'Aubrey', 'Jonathan', 'Zoe', 'Stephen', 'Stella', 'Larry', 'Hazel', 'Justin', 'Ellie', 'Scott', 'Paisley', 'Brandon', 'Audrey', 'Benjamin', 'Skylar', 'Samuel', 'Violet', 'Frank', 'Claire', 'Gregory', 'Bella', 'Raymond', 'Lucy', 'Alexander', 'Caroline', 'Patrick', 'Nora', 'Jack', 'Aurora', 'Dennis', 'Savannah', 'Jerry', 'Leah', 'Tyler', 'Anna', 'Aaron', 'Allison', 'Jose', 'Aaliyah', 'Henry', 'Samantha', 'Adam', 'Natalia', 'Douglas', 'Brooklyn', 'Nathan', 'Zoe', 'Zachary', 'Lillian', 'Kyle', 'Addison', 'Noah', 'Aubrey', 'Dylan', 'Ellie', 'Ethan', 'Stella'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'mail.com', 'aol.com'];

function generateUniqueName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateUniqueEmail(name) {
    const namePart = name.toLowerCase().replace(/\s+/g, '');
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    return `${namePart}${randomNum}@${domain}`;
}

// Extensive unique reviews for each tea type (varied lengths and styles)
const reviewTemplates = {
    'earl grey': [
        { rating: 5, comment: "Perfect balance of bergamot and black tea. Smooth and aromatic, my go-to morning tea!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Love the citrusy notes. Great with a splash of milk. Would buy again.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Excellent quality. The bergamot flavor is just right—not too overpowering. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 5, comment: "I've tried many Earl Grey teas, and this one stands out. The bergamot oil is perfectly balanced—not too strong, not too weak. The black tea base is smooth and doesn't have that bitter aftertaste some others have. I drink it every morning with a bit of honey. The packaging is also nice, keeps the tea fresh. Will definitely order more!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good tea, nice flavor.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Earl Grey has become my absolute favorite! The bergamot aroma fills the room when I open the package. The taste is sophisticated and smooth—perfect for starting my day. I've recommended it to all my tea-loving friends. The quality is definitely premium and worth every penny. Five stars without hesitation!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice tea. The bergamot is subtle which I prefer. Good for afternoon too.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Wow! This is hands down the best Earl Grey I've ever tasted. The bergamot is perfectly extracted and the black tea leaves are clearly high quality. I can taste the difference immediately. The first sip is smooth, the second reveals more complexity, and by the third cup I'm completely sold. I've already ordered two more packages. This is now a staple in my tea collection. Thank you for such an amazing product!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Solid Earl Grey. Nothing extraordinary but reliable quality. Good value.", authorName: null, authorEmail: null },
        { rating: 5, comment: "The bergamot in this tea is incredible—it's like having a fresh citrus garden in my cup! The black tea provides a perfect base that doesn't compete with the bergamot. I've been drinking this for three weeks now and it hasn't disappointed once. My morning routine feels incomplete without it. The leaves are whole and fresh, which makes a huge difference in flavor. Highly recommend to anyone who loves Earl Grey!", authorName: null, authorEmail: null }
    ],
    'english breakfast': [
        { rating: 5, comment: "Strong and robust, exactly what I need to start my day. Full-bodied and energizing!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Great morning tea. Pairs perfectly with breakfast. Good value for money.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This English Breakfast blend is exactly what I was looking for. It's strong enough to wake me up but smooth enough to enjoy without milk. The blend of Assam, Ceylon, and Kenyan teas creates a complex flavor profile that's both malty and slightly astringent—just right. I've been drinking it for two months now and it's become essential to my morning routine. The quality is consistent, and I love that it's ethically sourced. Will continue ordering!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good strong tea. Does the job.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Perfect English Breakfast! The malty notes from the Assam are wonderful, and the blend is perfectly balanced. I drink it with a splash of milk and it's absolutely divine. The energizing effect is noticeable—I feel more alert and ready for the day. The packaging keeps it fresh, and the leaves are clearly high quality. This has replaced my previous brand completely. Excellent product!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Solid breakfast tea. Strong flavor, good for mornings. Would recommend.", authorName: null, authorEmail: null }
    ],
    'darjeeling first flush': [
        { rating: 5, comment: "Absolutely exquisite! Delicate floral notes with a hint of muscatel. Worth every penny.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Premium quality tea. The aroma alone is worth it. A true connoisseur's choice.", authorName: null, authorEmail: null },
        { rating: 4, comment: "Beautiful tea with complex flavors. Perfect for afternoon. Very satisfied.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This first flush Darjeeling is absolutely exceptional. The delicate floral notes combined with that characteristic muscatel flavor create something truly special. I've been a tea enthusiast for over 20 years, and this ranks among the best Darjeelings I've ever tasted. The leaves are beautiful—small, tender, and clearly hand-picked. The brewing process is a joy to watch as the leaves unfurl. The first infusion is light and floral, the second reveals more complexity, and even the third infusion maintains character. This is a tea to savor slowly, not rush through. Worth every cent!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice Darjeeling. Floral and light. Good quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible tea! The muscatel notes are subtle but present, and the floral character is just perfect. I love how it changes with each steep. This is definitely a premium tea that shows its quality in every cup. Perfect for special occasions or when I want to treat myself. The packaging is elegant too. Highly recommend for tea lovers who appreciate fine quality!", authorName: null, authorEmail: null }
    ],
    'assam golden tips': [
        { rating: 5, comment: "Rich and malty with honey notes. One of the best Assams I've tried. Exceptional quality!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Smooth and full-bodied. The golden tips add a nice touch. Great tea!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Assam with golden tips is outstanding! The malty flavor is rich and satisfying, and I can definitely taste the honey notes mentioned in the description. The golden tips are visible in the dry leaves and add a premium touch. I've tried many Assams, but this one has the perfect balance of strength and smoothness. It's become my go-to afternoon tea. The quality is clearly top-notch, and I appreciate that it's ethically sourced. Will definitely order again!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good Assam. Malty and strong. Nice golden tips.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Wow, this is a fantastic Assam! The golden tips are beautiful and the flavor is incredibly rich. The honey and caramel notes come through beautifully, especially when brewed at the right temperature. I drink it with a bit of milk and it's absolutely perfect. The leaves are clearly high quality and the packaging keeps them fresh. This has become a staple in my tea collection. Highly recommend!", authorName: null, authorEmail: null }
    ],
    'lapsang souchong': [
        { rating: 5, comment: "Unique smoky flavor! Like drinking tea by a campfire. Not for everyone, but I love it!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Bold and distinctive. The pine-smoked character is fascinating. Great for cold days.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Lapsang Souchong is absolutely unique! The pine-smoked flavor is intense and distinctive—definitely not for everyone, but if you love smoky flavors, this is perfection. It reminds me of camping trips and bonfires. The tea itself is high quality, and the smoking process is done perfectly—smoky but not overwhelming. I love it on cold winter mornings. It's become a conversation starter when I serve it to guests. Some love it, some don't, but everyone remembers it! Highly recommend for adventurous tea drinkers.", authorName: null, authorEmail: null },
        { rating: 3, comment: "Too smoky for my taste, but quality is good.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible smoky tea! The campfire aroma is amazing. Perfect for those who love bold, distinctive flavors. The quality is excellent and the smoking is done just right—not too much, not too little. This is my favorite tea for cold weather. It warms you from the inside out. The leaves are beautiful and the flavor is complex. Definitely a unique experience!", authorName: null, authorEmail: null }
    ],
    'sencha premium': [
        { rating: 5, comment: "Fresh, grassy, and clean. Perfect green tea with great antioxidant benefits. My daily favorite!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Light and refreshing. Great for health-conscious tea drinkers. Very smooth.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Authentic Japanese green tea. The quality is outstanding. Will definitely reorder!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Sencha is exactly what I was hoping for! The fresh, grassy flavor is authentic and the leaves are clearly premium quality. I've been drinking it daily for its health benefits, and I can feel the difference. The antioxidant boost is noticeable, and I love that it's naturally low in caffeine. The brewing process is important with this tea—I use lower temperature water and it makes all the difference. The flavor is clean, vegetal, and slightly sweet. This has become an essential part of my wellness routine. Excellent quality!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good green tea. Fresh taste, nice quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Amazing Sencha! The grassy, vegetal notes are perfect, and the quality is clearly premium. I love how it makes me feel—energized but calm, thanks to the L-theanine. The leaves are beautiful, and I can steep them multiple times. The first infusion is light and fresh, the second is more complex. This is now my go-to green tea. The health benefits are a bonus, but honestly, I'd drink it just for the taste. Highly recommend!", authorName: null, authorEmail: null }
    ],
    'dragon well longjing': [
        { rating: 5, comment: "Sweet, nutty, and buttery—exactly as described! One of China's finest teas. Exceptional!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Premium quality Dragon Well. The flat leaves unfurl beautifully. Smooth finish.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Dragon Well Longjing is absolutely exceptional! The flat, jade-colored leaves are beautiful, and watching them unfurl during brewing is mesmerizing. The flavor is exactly as described—sweet, nutty, and buttery. It's one of those teas where every sip reveals something new. The quality is clearly premium, and I can tell this is from a reputable source. The smooth finish is wonderful, and there's no bitterness at all. This is now my special occasion tea, though I'm tempted to drink it daily! Worth every penny for tea connoisseurs.", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice Dragon Well. Sweet and smooth. Good quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible Longjing! The buttery texture is amazing, and the nutty notes are perfectly balanced. This is one of China's most famous teas for a reason, and this particular batch does it justice. The leaves are clearly hand-processed and of the highest quality. I've tried Dragon Well from many sources, and this is among the best. The flavor profile is complex yet approachable. Highly recommend for anyone who appreciates fine Chinese green teas!", authorName: null, authorEmail: null }
    ],
    'matcha ceremonial grade': [
        { rating: 5, comment: "Vibrant green color and smooth umami flavor. Perfect for traditional ceremony. Top quality!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Best matcha I've ever had! Rich, smooth, and energizing. Worth the premium price.", authorName: null, authorEmail: null },
        { rating: 4, comment: "Excellent ceremonial grade. Makes amazing lattes too. Very satisfied with quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This ceremonial grade matcha is absolutely outstanding! The vibrant green color is beautiful, and the umami flavor is smooth and complex. I've been practicing traditional tea ceremony, and this matcha is perfect for that. The quality is clearly premium—it whisks up beautifully with a fine foam, and the flavor is rich without being bitter. I also use it for matcha lattes, and it's incredible. The energy boost is noticeable but smooth, thanks to the L-theanine. This is definitely worth the premium price. I've tried many matchas, and this is now my gold standard. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good matcha. Smooth flavor, nice color.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible matcha! The quality is immediately apparent from the vibrant green color and smooth texture. The umami flavor is perfectly balanced—not too strong, not too weak. I drink it both traditionally and as lattes, and it works beautifully both ways. The energy boost is amazing—sustained and smooth, not jittery like coffee. The packaging keeps it fresh, which is important for matcha. This has become my daily ritual. Worth every cent for matcha lovers!", authorName: null, authorEmail: null }
    ],
    'gunpowder green': [
        { rating: 4, comment: "Bold green tea that stands up to multiple infusions. Good value and quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Love how the leaves unfurl. Strong flavor that I can steep multiple times. Great tea!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Gunpowder green tea is fantastic! The tightly rolled leaves are fun to watch as they unfurl during brewing. The flavor is bold and slightly smoky, which I love. I can steep it multiple times and it maintains its character. The quality is good, and it's great value for money. I've been drinking it daily for a month now, and it hasn't disappointed. The leaves are clearly whole and not broken, which makes a difference. Perfect for those who like stronger green teas. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good gunpowder tea. Bold flavor, good for multiple steeps.", authorName: null, authorEmail: null }
    ],
    'jasmine pearl': [
        { rating: 5, comment: "Beautiful hand-rolled pearls with delicate jasmine scent. Watching them unfurl is mesmerizing!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Floral and sweet. The jasmine is perfectly balanced. One of my favorites!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Lovely tea with beautiful presentation. Great for gifting or special occasions.", authorName: null, authorEmail: null },
        { rating: 5, comment: "These jasmine pearls are absolutely beautiful! The hand-rolling is exquisite, and watching them unfurl in hot water is like watching a flower bloom. The jasmine scenting is perfect—floral but not overpowering. The green tea base is high quality, and the combination is divine. I love serving this to guests because it's such a visual and aromatic experience. The flavor is delicate, sweet, and refreshing. This has become my go-to tea for special moments. The quality is clearly premium. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice jasmine tea. Good floral notes.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible jasmine pearls! The presentation alone is worth it, but the flavor is what keeps me coming back. The jasmine is perfectly balanced—not too strong, not too weak. The green tea base is smooth and complements the jasmine beautifully. I can steep these multiple times, and each infusion reveals something new. The first is light and floral, the second is more complex, and even the third maintains character. This is now my favorite jasmine tea. The quality is exceptional!", authorName: null, authorEmail: null }
    ],
    'silver needle': [
        { rating: 5, comment: "Delicate and sweet with honey-like notes. Premium white tea at its finest. Exquisite!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Beautiful silvery buds. Light, refreshing, and naturally sweet. Perfect for afternoon.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Silver Needle is absolutely exquisite! The silvery-white down on the buds is beautiful, and the quality is clearly premium. The flavor is delicate, sweet, and honey-like—exactly as described. I love how light and refreshing it is, perfect for afternoon when I want something gentle. The brewing process is a joy, watching the buds unfurl slowly. The flavor is complex yet subtle, with natural sweetness that doesn't need any additions. This is white tea at its finest. I've tried many Silver Needles, and this is among the best. Worth every penny for white tea enthusiasts!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice white tea. Delicate and sweet. Good quality.", authorName: null, authorEmail: null }
    ],
    'white peony': [
        { rating: 4, comment: "Mellow and smooth with floral hints. Fuller body than Silver Needle. Very enjoyable!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Great white tea option. Smooth and approachable. Good introduction to white teas.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This White Peony is wonderful! It has a fuller body than Silver Needle, which I actually prefer. The floral notes are subtle but present, and the overall flavor is mellow and smooth. It's more approachable than some other white teas, making it perfect for those new to white tea. The quality is good, and I appreciate the balance between buds and leaves. I've been drinking it regularly and it's become a favorite. The natural sweetness is lovely, and it doesn't need any additions. Great value for a quality white tea!", authorName: null, authorEmail: null }
    ],
    'tie guan yin': [
        { rating: 5, comment: "Classic oolong with beautiful orchid aroma. Can steep multiple times. Excellent value!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Smooth, floral, and slightly sweet. One of the best oolongs I've tried. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Great oolong with complex flavors. The lingering aftertaste is wonderful.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Tie Guan Yin is absolutely fantastic! The orchid-like aroma is beautiful and authentic. I love how I can steep it multiple times, and each infusion reveals different aspects of the flavor. The first is light and floral, the second is more complex with sweet notes, and even the third maintains character. The quality is clearly high, and the leaves are whole and beautiful. This has become my go-to oolong. The smooth, slightly sweet finish is wonderful, and the lingering aftertaste is something I look forward to. Excellent value for such quality. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good Tie Guan Yin. Floral and smooth. Nice quality.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible oolong! The floral, orchid-like aroma fills the room when I open the package. The flavor is smooth, slightly sweet, and complex. I can steep this multiple times, and it's amazing how the flavor evolves. The first cup is light and floral, the second is richer, and the third still has character. This is now my favorite oolong. The quality is exceptional, and I love that it's a classic Chinese tea done right. Worth every penny!", authorName: null, authorEmail: null }
    ],
    'da hong pao': [
        { rating: 5, comment: "Rare and exceptional! Complex roasted notes with mineral undertones. A true treasure!", authorName: null, authorEmail: null },
        { rating: 5, comment: "Premium oolong worth every dollar. The complexity is incredible. Connoisseur's dream!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Da Hong Pao is absolutely exceptional! The complex roasted notes combined with mineral undertones create something truly unique. I've been a tea collector for years, and this is one of the finest oolongs I've ever tasted. The long, sweet finish is incredible, and the complexity is mind-blowing. Each sip reveals something new—roasted, mineral, slightly fruity, then sweet. This is a tea to savor slowly and appreciate. The quality is clearly premium, and I can tell this is from a reputable source. Worth every dollar for serious tea enthusiasts. This is now the crown jewel of my tea collection!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Complex and interesting. Good quality oolong.", authorName: null, authorEmail: null }
    ],
    'milk oolong': [
        { rating: 5, comment: "Naturally creamy and buttery—no milk needed! Smooth and sweet. Absolutely delicious!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Unique milky sweetness without actual milk. Very smooth and enjoyable tea.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Love this tea! The natural creaminess is amazing. Perfect for dessert time.", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Milk Oolong is absolutely incredible! The natural creaminess and buttery texture are mind-blowing—I still can't believe there's no actual milk in it. The flavor comes entirely from the tea itself, which is fascinating. It's smooth, sweet, and has this unique milky quality that's unlike anything else I've tried. I drink it in the afternoon, and it's perfect for that time of day. The quality is clearly high, and the leaves are beautiful. This has become one of my absolute favorites. Highly recommend to anyone who loves unique, creamy teas!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice creamy oolong. Unique flavor.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Wow, this Milk Oolong is something special! The natural creaminess is incredible, and the buttery texture is unlike any other tea I've tried. I was skeptical at first—how can tea taste milky without milk? But it really does! The flavor is smooth, sweet, and has this unique quality that's hard to describe but absolutely delicious. Perfect for when I want something indulgent but still healthy. The quality is excellent, and I love that it's naturally this way. This is now a regular in my tea rotation. Highly recommend!", authorName: null, authorEmail: null }
    ],
    'aged pu-erh': [
        { rating: 5, comment: "Earthy, complex, and mellow. The aging really shows. Like fine wine in tea form!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Rich and smooth with deep earthy flavors. Great for digestion. Unique experience!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This aged Pu-erh is absolutely fascinating! The earthy, complex flavors are incredible, and you can really taste the aging. It's like fine wine in tea form—the longer it ages, the better it gets. The mellow character is wonderful, and the notes of wood and earth create something truly unique. I love how it changes with each steep, revealing more complexity. The quality is clearly premium, and I can tell this has been properly aged. This is a tea to appreciate slowly, not rush through. Perfect for after meals, and the digestive benefits are noticeable. Highly recommend for adventurous tea drinkers who want to try something truly special!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Interesting tea. Earthy and complex. Good quality.", authorName: null, authorEmail: null }
    ],
    'ripe pu-erh': [
        { rating: 4, comment: "Deep, earthy, and satisfying. Known for digestive benefits and it works! Great tea.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Smooth post-fermented tea with rich flavor. Excellent for after meals. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This ripe Pu-erh is excellent! The deep, earthy flavor is rich and satisfying, and the smooth texture is wonderful. I've been drinking it after meals for the digestive benefits, and it really works. The post-fermentation process creates a unique flavor profile that's earthy, slightly sweet, and very smooth. The quality is good, and I appreciate that it's properly processed. This has become a regular part of my routine. The flavor is complex but approachable, making it great for those new to Pu-erh. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good Pu-erh. Earthy and smooth. Helps with digestion.", authorName: null, authorEmail: null }
    ],
    'chamomile relaxation': [
        { rating: 5, comment: "Perfect for evening relaxation. Sweet, apple-like flavor helps me unwind. Sleep better too!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Calming and caffeine-free. Great before bed. The flavor is naturally sweet.", authorName: null, authorEmail: null },
        { rating: 5, comment: "My go-to bedtime tea. Soothing and helps with sleep. Love the natural sweetness!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This chamomile is absolutely perfect for evening relaxation! The sweet, apple-like flavor is naturally delicious, and I love that it's caffeine-free. I've been drinking it before bed for the past month, and I've noticed a real difference in my sleep quality. It helps me unwind after a long day, and the calming effect is noticeable. The flowers are clearly high quality—whole and fragrant. The flavor is sweet without needing any additions, which I appreciate. This has become an essential part of my bedtime routine. Highly recommend for anyone looking for a natural way to relax and improve sleep!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice chamomile. Calming and sweet.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible chamomile! The quality is immediately apparent from the whole, fragrant flowers. The sweet, apple-like flavor is naturally delicious, and I love that it's caffeine-free. I drink it every evening, and it's become a ritual I look forward to. The calming effect is real—I feel more relaxed and sleep better. The packaging keeps it fresh, and the flowers are clearly premium quality. This has replaced my previous chamomile completely. Highly recommend for anyone who wants natural relaxation and better sleep!", authorName: null, authorEmail: null }
    ],
    'peppermint fresh': [
        { rating: 5, comment: "Refreshing and invigorating! Great for digestion and the cool mint flavor is perfect.", authorName: null, authorEmail: null },
        { rating: 4, comment: "Crisp and clean. Natural digestive aid that actually works. Caffeine-free bonus!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This peppermint tea is fantastic! The cool, refreshing flavor is perfect, and I love that it's naturally caffeine-free. I've been drinking it after meals for the digestive benefits, and it really works. The mint flavor is crisp and clean, not artificial at all. The leaves are clearly high quality—whole and fragrant. I also drink it when I need a pick-me-up without caffeine. The invigorating effect is noticeable. This has become a staple in my tea collection. Great value for such quality. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Good peppermint. Fresh and cooling.", authorName: null, authorEmail: null }
    ],
    'rooibos vanilla': [
        { rating: 5, comment: "Smooth, sweet, and naturally caffeine-free. The vanilla adds perfect warmth. Comforting!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Great rooibos with natural vanilla. Rich in antioxidants and delicious. Perfect for any time!", authorName: null, authorEmail: null },
        { rating: 5, comment: "My favorite caffeine-free option. Sweet, smooth, and the vanilla is perfectly balanced!", authorName: null, authorEmail: null },
        { rating: 5, comment: "This Rooibos Vanilla is absolutely wonderful! The smooth, sweet rooibos base is perfect, and the natural vanilla adds just the right amount of warmth and comfort. I love that it's naturally caffeine-free, so I can drink it any time of day. The flavor is rich and satisfying, and the vanilla is perfectly balanced—not too strong, not too weak. I've been drinking it regularly, and it's become one of my favorites. The quality is excellent, and I appreciate that it's rich in antioxidants. This is perfect for cozy evenings or when I want something comforting. Highly recommend!", authorName: null, authorEmail: null },
        { rating: 4, comment: "Nice rooibos. Vanilla is subtle and nice.", authorName: null, authorEmail: null },
        { rating: 5, comment: "Incredible Rooibos Vanilla! The combination is perfect—smooth, sweet rooibos with natural vanilla that adds warmth and comfort. I love that it's caffeine-free, so I can enjoy it in the evening without worrying about sleep. The flavor is rich and satisfying, and the vanilla is perfectly balanced. I've tried many rooibos teas, and this is now my favorite. The quality is excellent, and the packaging keeps it fresh. This has become a regular in my tea rotation. Perfect for anyone who wants a comforting, caffeine-free option. Highly recommend!", authorName: null, authorEmail: null }
    ]
};

// Fallback reviews for products without specific templates
const fallbackReviews = [
    { rating: 5, comment: "Excellent quality tea! Fresh, flavorful, and exactly as described. Highly recommend!", authorName: null, authorEmail: null },
    { rating: 4, comment: "Great tea with good flavor. Fast shipping and well-packaged. Will order again!", authorName: null, authorEmail: null },
    { rating: 5, comment: "Premium quality! The taste is outstanding and the leaves are fresh. Worth every penny!", authorName: null, authorEmail: null },
    { rating: 4, comment: "Good tea. Nice flavor, decent quality.", authorName: null, authorEmail: null },
    { rating: 5, comment: "This tea is absolutely wonderful! The quality is immediately apparent from the first sip. The leaves are fresh, whole, and clearly high quality. The flavor is complex and satisfying, exactly as described. I've been drinking it regularly and it's become a favorite. The packaging keeps it fresh, and I appreciate the attention to detail. This is definitely worth the price. I've already recommended it to friends. Highly recommend to anyone who appreciates quality tea!", authorName: null, authorEmail: null }
];

// Used names tracker to ensure uniqueness
const usedNames = new Set();
const usedEmails = new Set();

function getUniqueName() {
    let name;
    let attempts = 0;
    do {
        name = generateUniqueName();
        attempts++;
        if (attempts > 100) {
            // If we can't find unique name, add random number
            name = `${name} ${Math.floor(Math.random() * 999)}`;
            break;
        }
    } while (usedNames.has(name));
    usedNames.add(name);
    return name;
}

function getUniqueEmail(name) {
    let email;
    let attempts = 0;
    do {
        email = generateUniqueEmail(name);
        attempts++;
        if (attempts > 100) {
            // If we can't find unique email, add more random numbers
            email = generateUniqueEmail(name + Math.random().toString(36).substring(7));
            break;
        }
    } while (usedEmails.has(email));
    usedEmails.add(email);
    return email;
}

async function createReviews() {
    console.log('🚀 Starting to add unique reviews to tea products...\n');
    console.log(`📍 Strapi URL: ${strapiUrl}\n`);

    try {
        // Fetch all products
        console.log('📋 Fetching products...');
        const productsRes = await fetch(`${strapiUrl}/graphql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query {
                    products {
                        documentId
                        title
                        slug
                    }
                }`
            })
        });

        const productsData = await productsRes.json();
        const products = productsData.data?.products || [];

        if (products.length === 0) {
            console.error('❌ No products found. Please create products first.');
            process.exit(1);
        }

        console.log(`✅ Found ${products.length} products\n`);

        let totalCreated = 0;
        let totalFailed = 0;

        for (const product of products) {
            const productSlug = product.slug?.toLowerCase() || '';
            const productTitle = product.title?.toLowerCase() || '';
            
            // Find matching reviews template
            let reviews = null;
            for (const [key, templateReviews] of Object.entries(reviewTemplates)) {
                if (productSlug.includes(key) || productTitle.includes(key)) {
                    reviews = templateReviews;
                    break;
                }
            }

            // Use fallback if no match found
            if (!reviews) {
                reviews = fallbackReviews;
            }

            // Shuffle and select 1-3 unique reviews
            const shuffled = shuffleArray(reviews);
            const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews
            const selectedReviews = shuffled.slice(0, numReviews);

            console.log(`📝 Adding ${selectedReviews.length} unique review(s) to "${product.title}"...`);

            for (const review of selectedReviews) {
                try {
                    // Generate unique name and email for each review
                    const uniqueName = getUniqueName();
                    const uniqueEmail = getUniqueEmail(uniqueName);

                    const reviewData = {
                        data: {
                            rating: review.rating,
                            comment: review.comment,
                            authorName: uniqueName,
                            authorEmail: uniqueEmail,
                            product: product.documentId,
                            isApproved: true // Auto-approve for script
                        }
                    };

                    const response = await fetch(`${strapiUrl}/api/reviews`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(reviewData)
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        console.error(`   ❌ Failed:`, response.status, JSON.stringify(error));
                        totalFailed++;
                    } else {
                        console.log(`   ✅ Created review by ${uniqueName} (${review.rating}★)`);
                        totalCreated++;
                    }

                    // Small delay
                    await new Promise(resolve => setTimeout(resolve, 200));

                } catch (error) {
                    console.error(`   ❌ Error:`, error.message);
                    totalFailed++;
                }
            }
            console.log('');
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successfully created: ${totalCreated} unique reviews`);
        console.log(`   ❌ Failed: ${totalFailed}`);
        console.log(`   📦 Products processed: ${products.length}`);
        console.log(`   👥 Unique reviewers: ${usedNames.size}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createReviews().catch(console.error);

# Tea Products Creation Scripts

## Overview
Scripts to create 20 real tea products in the database.

## Prerequisites
1. Make sure Strapi CMS is running
2. Ensure you have the following environment variables set in `.env.local`:
   - `NEXT_PUBLIC_CMS_URL` (e.g., `http://localhost:1337`)
   - `STRAPI_API_TOKEN` (your Strapi API token)

3. Make sure you have the following categories created in Strapi:
   - Black Tea
   - Green Tea
   - White Tea
   - Oolong Tea
   - Pu-erh Tea
   - Herbal Tea

## Usage

### Option 1: Using npm/yarn script (Recommended)
```bash
cd frontend
yarn create-products
# or
npm run create-products
```

### Option 2: Direct execution
```bash
cd frontend
node scripts/create-tea-products-direct.js
```

## Products Created

The script creates 20 tea products:

**Black Teas (5):**
- Earl Grey
- English Breakfast
- Darjeeling First Flush
- Assam Golden Tips
- Lapsang Souchong

**Green Teas (5):**
- Sencha Premium
- Dragon Well Longjing
- Matcha Ceremonial Grade
- Gunpowder Green
- Jasmine Pearl

**White Teas (2):**
- Silver Needle
- White Peony

**Oolong Teas (3):**
- Tie Guan Yin
- Da Hong Pao
- Milk Oolong

**Pu-erh Teas (2):**
- Aged Pu-erh
- Ripe Pu-erh

**Herbal Teas (3):**
- Chamomile Relaxation
- Peppermint Fresh
- Rooibos Vanilla

## Notes
- Products are created without images (you can add images later via admin panel)
- Each product includes a full description and short description
- Prices range from $32 to $85
- The script will skip products if their category doesn't exist

## Adding Reviews

After creating products, you can add realistic reviews to them:

```bash
cd frontend
yarn create-reviews
# or
npm run create-reviews
```

This script will:
- Fetch all existing products
- Add 1-3 unique realistic reviews to each product
- Reviews are automatically approved (isApproved: true)
- Each review includes rating (4-5 stars), comment, author name and email
- Reviews are tailored to each tea type (e.g., Earl Grey gets bergamot-related reviews)

**Review Features:**
- **100% Unique**: Every review has a unique author name and email (never repeated)
- **Varied Lengths**: Short (1-2 sentences), medium (3-4 sentences), and long (5+ sentences) reviews
- **Different Writing Styles**: Technical, emotional, simple, detailed - just like real people write
- **Realistic Comments**: Specific to each tea type with authentic details
- **Varied Ratings**: Mostly 4-5 stars for quality products, with occasional 3-star honest reviews
- **Unique Names**: Generated from a large pool of first and last names
- **Unique Emails**: Various email domains (gmail, yahoo, outlook, etc.) with random numbers
- Automatically approved for immediate display


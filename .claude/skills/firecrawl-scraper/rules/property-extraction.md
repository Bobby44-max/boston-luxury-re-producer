# Property Data Extraction Schema

## Complete Property Schema

```typescript
import { z } from 'zod';

export const PropertySchema = z.object({
  // Location
  address: z.string().describe('Full street address'),
  unit: z.string().optional().describe('Unit/Apt number if applicable'),
  city: z.string(),
  state: z.string().describe('2-letter state code'),
  zipCode: z.string(),
  neighborhood: z.string().optional(),
  county: z.string().optional(),

  // Pricing
  price: z.number().describe('List price as number, no formatting'),
  pricePerSqft: z.number().optional(),
  estimatedMonthlyPayment: z.number().optional(),
  hoaFee: z.number().optional(),
  taxAmount: z.number().optional(),

  // Property Details
  bedrooms: z.number(),
  bathrooms: z.number().describe('Can be decimal, e.g., 2.5'),
  sqft: z.number().describe('Interior square footage'),
  lotSize: z.string().optional().describe('Lot size with units'),
  lotSizeAcres: z.number().optional(),
  yearBuilt: z.number().optional(),
  propertyType: z.enum([
    'single-family',
    'condo',
    'townhouse',
    'multi-family',
    'land',
    'other'
  ]),
  style: z.string().optional().describe('Architectural style'),
  stories: z.number().optional(),
  parking: z.string().optional(),
  garageSpaces: z.number().optional(),

  // Description & Features
  description: z.string().describe('Full listing description'),
  features: z.array(z.string()).describe('List of property features'),
  amenities: z.array(z.string()).optional(),
  appliances: z.array(z.string()).optional(),
  heating: z.string().optional(),
  cooling: z.string().optional(),
  flooring: z.array(z.string()).optional(),

  // Images
  images: z.array(z.string()).describe('Array of image URLs'),
  primaryImage: z.string().optional(),
  floorPlanUrl: z.string().optional(),
  virtualTourUrl: z.string().optional(),

  // Listing Info
  mlsNumber: z.string().optional(),
  daysOnMarket: z.number().optional(),
  listDate: z.string().optional(),
  status: z.enum(['active', 'pending', 'sold', 'off-market']).optional(),

  // Agent Info
  agent: z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    photo: z.string().optional(),
    brokerage: z.string().optional(),
    brokerageLogo: z.string().optional(),
  }).optional(),

  // Location Features
  walkScore: z.number().optional(),
  transitScore: z.number().optional(),
  bikeScore: z.number().optional(),
  nearbySchools: z.array(z.object({
    name: z.string(),
    rating: z.number().optional(),
    distance: z.string().optional(),
  })).optional(),
});

export type Property = z.infer<typeof PropertySchema>;
```

## Extraction Prompt

Use this prompt for optimal extraction:

```typescript
const extractionPrompt = `
Extract all property listing information from this page.
Focus on:
1. Complete address with unit number if applicable
2. Price as a raw number (no $ or commas)
3. All bedroom/bathroom counts (use decimals for half baths)
4. Square footage (interior only)
5. All high-resolution image URLs (prioritize exterior, kitchen, living room)
6. Property features and amenities as separate lists
7. Agent/broker contact information
8. Any market data (days on market, price history)

For images:
- Extract the highest resolution version available
- Include at least 10 images if available
- Prioritize in order: exterior, kitchen, living room, primary bedroom, bathroom, other rooms

Return structured JSON matching the schema.
`;
```

## Site-Specific Patterns

### Zillow
```typescript
// Zillow images are in a carousel, extract from data attributes
// Price is in the "data-test" element
// Features are in expandable sections
```

### Redfin
```typescript
// High-res images available by modifying URL params
// Price history in "PriceInsights" section
// Features in "amenities-container"
```

### Realtor.com
```typescript
// Images in "ldp-hero-carousel"
// Features in "property-features-section"
// Agent info in "agent-info" component
```

## Data Validation

Always validate extracted data:

```typescript
function validatePropertyData(data: unknown): Property {
  const result = PropertySchema.safeParse(data);

  if (!result.success) {
    console.error('Validation errors:', result.error.issues);

    // Return partial data with defaults
    return {
      ...data,
      address: data.address || 'Address not found',
      price: data.price || 0,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      sqft: data.sqft || 0,
      images: data.images || [],
      features: data.features || [],
      description: data.description || '',
      propertyType: data.propertyType || 'other',
    } as Property;
  }

  return result.data;
}
```

## Image Processing

### Get High-Res Versions
```typescript
function getHighResImage(url: string): string {
  // Zillow: replace size params
  if (url.includes('zillow')) {
    return url.replace(/w=\d+/, 'w=1920').replace(/h=\d+/, 'h=1080');
  }

  // Redfin: use original size
  if (url.includes('redfin')) {
    return url.replace('/small/', '/big/');
  }

  return url;
}
```

### Filter Best Images
```typescript
function selectBestImages(images: string[], count: number = 10): string[] {
  // Prioritize by filename patterns
  const exterior = images.filter(i =>
    /exterior|front|street/i.test(i)
  );
  const kitchen = images.filter(i =>
    /kitchen/i.test(i)
  );
  const living = images.filter(i =>
    /living|family|great/i.test(i)
  );
  const bedroom = images.filter(i =>
    /bedroom|master|primary/i.test(i)
  );
  const other = images.filter(i =>
    !exterior.includes(i) &&
    !kitchen.includes(i) &&
    !living.includes(i) &&
    !bedroom.includes(i)
  );

  // Combine in priority order
  return [
    ...exterior.slice(0, 2),
    ...kitchen.slice(0, 2),
    ...living.slice(0, 2),
    ...bedroom.slice(0, 2),
    ...other,
  ].slice(0, count);
}
```

## Error Recovery

```typescript
async function scrapeWithFallback(url: string): Promise<Property> {
  try {
    // Try AI extraction first
    return await firecrawl.extract({ urls: [url], schema: PropertySchema });
  } catch (error) {
    // Fallback to basic scrape + manual parsing
    const html = await firecrawl.scrape({ url, formats: ['html'] });
    return parsePropertyHtml(html);
  }
}
```

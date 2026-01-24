import { Composition } from 'remotion';
import { PropertyShowcase, PropertyShowcaseSchema } from './compositions/PropertyShowcase';
import { SocialShort, SocialShortSchema } from './compositions/SocialShort';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Property Showcase - 30 second landscape video */}
      <Composition
        id="PropertyShowcase"
        component={PropertyShowcase}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        schema={PropertyShowcaseSchema}
        defaultProps={{
          address: '123 Luxury Lane',
          city: 'Boston',
          state: 'MA',
          price: 2500000,
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: 3500,
          images: [],
          features: ['Chef\'s Kitchen', 'Private Garden', 'Smart Home', 'Heated Floors'],
          agentName: 'Jane Smith',
          brokerageName: 'Apex Realty',
          phone: '(617) 555-0123',
          primaryColor: '#0dccf2',
        }}
      />

      {/* Social Short - 9 second vertical video */}
      <Composition
        id="SocialShort"
        component={SocialShort}
        durationInFrames={270} // 9 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={SocialShortSchema}
        defaultProps={{
          address: '123 Luxury Lane',
          city: 'Boston',
          neighborhood: 'Back Bay',
          price: 2500000,
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: 3500,
          heroImage: '',
          hookText: 'Just Listed in Back Bay',
          ctaText: 'Link in bio',
          primaryColor: '#0dccf2',
        }}
      />
    </>
  );
};

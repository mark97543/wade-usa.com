import { useEffect, useState } from 'react';

// --- Directus
import { readItems } from '@directus/sdk';
import { client } from '@/lib/directus';

// --- Components
import { Carousel } from '@/components/molecules/Carousel/Carousel';

// 1. Define the Shape of the Data
interface CarouselItem {
    id: string;
    c_pic: string; // Must match your Directus field name
}

// 2. Data Fetching Helper
const fetchAllItems = async (collectionName: string) => {
    try {
        const items = await client.request(
            readItems(collectionName as 'main_landing_site', {  
                // Optional: filter: { status: { _eq: 'published' } },
            })
        );
        return items;
    } catch (error) {
        console.error(`Failed to fetch items from ${collectionName}:`, error);
        return [];
    }
};

export default function Landing() {
    // FIX: Explicitly type the state as an array of CarouselItem
    const [slides, setSlides] = useState<CarouselItem[]>([]);
    
    // 3. Helper to build the full image URL
    const getImageUrl = (imageUuid: string) => {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api.wade-usa.com';
        return `${apiUrl}/assets/${imageUuid}`;
    };

    // 4. Fetch Data on Mount
    useEffect(() => {
        const loadData = async () => {
            const fetchedItems = await fetchAllItems('main_landing_site');
            setSlides(fetchedItems);
        };
        loadData();
    }, []);

    return (
        <div>
            <Carousel maxWidth="1200px" height="auto" >
                {/* Check if we have slides, otherwise show nothing or a placeholder */}
                {slides.length > 0 ? (
                    slides.map((slide) => (
                        <img 
                            key={slide.id} 
                            src={getImageUrl(slide.c_pic)} 
                            alt="Carousel Slide"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ))
                ) : (
                    // Optional: Render a placeholder while loading
                    <div style={{ width: '100%', height: '500px', background: '#eee' }}></div>
                )}
            </Carousel>
        </div>
    );
}
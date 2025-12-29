import { createDirectus, rest, authentication } from '@directus/sdk';

// Use <any> here to allow your generic 'saveItem' function to work with ANY collection string.
// If you use a strict Schema interface, you cannot pass a generic 'string' variable as a collection name.
export const client = createDirectus<any>('https://api.wade-usa.com')
    .with(rest({
        credentials: 'include'
    }))
    .with(authentication('cookie', {
        autoRefresh: true,
    }));
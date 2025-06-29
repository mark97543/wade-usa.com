import { createDirectus, rest, authentication } from '@directus/sdk';

const client = createDirectus('https://api.wade-usa.com')
  .with(rest())
  .with(authentication('json')); // Use 'json' mode to get tokens

export default client;
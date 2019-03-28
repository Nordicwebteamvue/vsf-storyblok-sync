## Vue Storefront

`yarn add marked`

Copy `frontend/storyblok-sync` to `vue-storefront/src/modules`.

Add to `vue-storefront/src/modules/index.ts`

```
...
import { Storyblok } from './storyblok-sync';

export const registerModules: VueStorefrontModule[] = [
  ...
  Storyblok
]
```

### Config

```
"storyblok": {
  "endpoint": "http://localhost:8080/api/ext/storyblok-sync/story{{id}}"
}
```

## Vue Storefront API

Copy `api/storyblok-sync` to `vue-storefront-api/src/api/extensions`.

### Config

```
"registeredExtensions": ["storyblok-sync"],
...
"storyblok": {
  "accessToken": "__API_KEY_HERE__",
  "indexPrefix": "storyblok_",
  "extraLanguages": ["de"]
}
```

### Webhook

To sync all posts there's a hook available at `http://localhost:8080/api/ext/storyblok-sync/`

Follow the Storyblok documentation to enable it: https://www.storyblok.com/docs/Guides/using-storyblok-webhooks

## Development

```
git submodule update --init --recursive
docker-compose up
```

Go to http://localhost:8080/api/ext/storyblok-sync/hook to trigger the webhook and pull data from Storyblok. Now visit http://localhost:3000/test to see it in action

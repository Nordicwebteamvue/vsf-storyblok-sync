# vsf-storyblok-sync [![Build Status](https://travis-ci.org/kodbruket/vsf-storyblok-sync.svg?branch=master)](https://travis-ci.org/kodbruket/vsf-storyblok-sync)

![Demo gif](demo.gif)

> Example usage in Storyblok with demo components

## Vue Storefront UI

### Installation

Copy `packages/vsf-storyblok-module` to `vue-storefront/src/modules`.

Add the following to `vue-storefront/src/modules/index.ts`

```
import { extendModule } from '@vue-storefront/core/lib/module'
...
import { Storyblok, urlExtend } from './vsf-storyblok-module';

extendModule(urlExtend)

export const registerModules: VueStorefrontModule[] = [
  ...
  Storyblok
]
```

Add a key to your `router-view` to trigger re-renders, something like this:

```
<router-view :key="$route.path" />
```

### Config

```
"storyblok": {
  "endpoint": "http://localhost:8080/api/ext/vsf-storyblok-extension"
}
```

### Usage

See the `/theme` folder for a demo implementation.

Notable paths:

* `router/index.js` - How to load the Storyblok page
* `components/storyblok` - Directory with a few demo components
* `index.js` - How to register components

#### `theme/router/index.js`

```js
import { StoryblokRoutes } from 'src/modules/vsf-storyblok-module'
...
let routes = ...
...
routes = routes.concat(StoryblokRoutes)

export default routes
```

## Vue Storefront API

Copy `packages/vsf-storyblok-extension` to `vue-storefront-api/src/api/extensions`.

### Config

```
"registeredExtensions": ["vsf-storyblok-extension"],
...
"storyblok": {
  "previewToken": "__API_KEY_HERE__",
  "indexPrefix": "storyblok_",
  "hookSecret": "__SECRET_CHANGE_ME__"
}
```

## Reference

### `previewToken`

Go to `https://app.storyblok.com/#!/me/spaces/YOUR_SPACE_ID/edit?tab=api` and generate a preview token.

On the backend we use it to fetch posts when the webhook is polled. In the UI it's used for the preview functionality in Storyblok.

### `endpoint`

The URL the UI tries to fetch stories from

### `indexPrefix`

Prefix used for the ElasticSearch index

### `hookSecret`

If this field is defined you have to provide this secret as a query param for your webhook. For example:

`http://localhost:8080/api/ext/vsf-storyblok-extension/hook`

would be

`http://localhost:8080/api/ext/vsf-storyblok-extension/hook?secret=__SECRET_CHANGE_ME__`

from our example config above. The secret is never needed in development mode.

## Webhook

To sync all posts there's a hook available at `http://localhost:8080/api/ext/vsf-storyblok-extension/hook`

Follow the Storyblok documentation to enable it: https://www.storyblok.com/docs/Guides/using-storyblok-webhooks

## Development

```
git clone --recurse-submodules http://github.com/kodbruket/vsf-storyblok-sync.git
docker-compose up
```

Go to http://localhost:8080/api/ext/storyblok-extension/hook to trigger the webhook and pull data from Storyblok. Now visit http://localhost:3000/test to see it in action

### Seed products

```
docker-compose exec storefront-api yarn mage2vs import
docker-compose exec storefront-api yarn restore
docker-compose exec storefront-api yarn migrate
```

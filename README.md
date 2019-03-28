# vsf-storyblok-sync [![Build Status](https://travis-ci.org/kodbruket/vsf-storyblok-sync.svg?branch=master)](https://travis-ci.org/kodbruket/vsf-storyblok-sync)

![Demo gif](demo.gif)

> Example usage in Storyblok with demo components

## Vue Storefront

### Installation

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
  "endpoint": "http://localhost:8080/api/ext/storyblok-sync/story{{id}}",
  "accessToken": "mrpbBbrwJU75kaRRQBIyugtt"
}
```

### Usage

See the `/frontend/theme` folder for a demo implementation.

Notable files:

* `pages/Storyblok.vue` - this should be a target in our router file.
* `pages/storyblok/Render.vue` - the root component used to render the Storyblok content. This is where you register components.
* `pages/storyblok/Debug.vue` - fallback component that renders a text about missing components. Only renders in development mode.
* `router/index.js` - example usage of the Storyblok page in the router

## Vue Storefront API

Copy `api/storyblok-sync` to `vue-storefront-api/src/api/extensions`.

### Config

```
"registeredExtensions": ["storyblok-sync"],
...
"storyblok": {
  "accessToken": "__API_KEY_HERE__",
  "indexPrefix": "storyblok_",
  "extraLanguages": ["de"],
  "hookSecret": "__SECRET_CHANGE_ME__"
}
```

## Reference

### `accessToken`

Go to `https://app.storyblok.com/#!/me/spaces/YOUR_SPACE_ID/edit?tab=api` and generate a preview token.

On the backend we use it to fetch posts when the webhook is polled. In the UI it's used for the preview functionallity in Storyblok.

### `endpoint`

The URL the UI tries to fetch stories from

### `indexPrefix`

Prefix used for the ElasticSearch index

### `extraLanguages`

An array of extra languages to fetch stories for. The codes corresponds with the codes found at `https://app.storyblok.com/#!/me/spaces/YOUR_SPACE_ID/edit?tab=languages`

### `hookSecret`

If this field is defined you have to provide this secret as a query param for your webhook. For example:

`http://localhost:8080/api/ext/storyblok-sync/hook`

would be

`http://localhost:8080/api/ext/storyblok-sync/hook?secret=__SECRET_CHANGE_ME__`

from our example config above. The secret is never needed in development mode.

## Webhook

To sync all posts there's a hook available at `http://localhost:8080/api/ext/storyblok-sync/hook`

Follow the Storyblok documentation to enable it: https://www.storyblok.com/docs/Guides/using-storyblok-webhooks

## Development

```
git submodule update --init --recursive
docker-compose up
```

Go to http://localhost:8080/api/ext/storyblok-sync/hook to trigger the webhook and pull data from Storyblok. Now visit http://localhost:3000/test to see it in action

# vsf-storyblok-sync ![VSF 1.11.1][vsf badge] ![Build Status][build badge]

![Demo gif](.github/demo.gif)

> Example usage in Storyblok with demo components

## Vue Storefront UI

### Installation

Copy `packages/vsf-storyblok-module` to `vue-storefront/src/modules`.

Add the following to `vue-storefront/src/modules/index.ts`

```js
import { StoryblokModule } from './vsf-storyblok-module';

export function registerClientModules () {
  ...
  registerModule(StoryblokModule)
}
```

> **Note:** To get routing working you can use this module: https://github.com/kodbruket/vsf-mapping-fallback/

### Config

```
"storyblok": {
  "endpoint": "http://localhost:8080/api/ext/vsf-storyblok-extension"
}
```

### Usage

See the `/theme` folder for a demo implementation.

Notable paths:

* `components/storyblok` - Directory with a few demo components
* `index.js` - How to register components

### Built in components

#### `<sb-link />`

To be used with the `Weblink/Storylink` field type (https://www.storyblok.com/docs/terminology/field-type)

`<sb-link :link="item.link">{{ item.title }}</sb-link>`

#### `<sb-img />`

Wrapper around the Storyblok Image Server API - https://www.storyblok.com/docs/image-service

##### Props
`height`  
Height in pixels

`width`  
Width in pixels

`src`  
Original path to image from `Image` Field Type

`div`  
If set to true you can instead use this component as a div with background. Example: `<sb-img :src="item.background">My content here</sb-img>`

`smart`  
A smart filter that crops around the focal point, which is determined by a smart algorithm

`fit-in`  
The fit-in argument specifies that the image should not be auto-cropped but auto-resized (shrunk) to fit inside an imaginary box of width and height, instead.

`filters`  
Array of filters to apply. For example `<sb-img :src="item.imageSrc" :width="800" :height="200" :fit-in="true" :filters="['fill(CCCCCC)', 'format(png)']" />`

`lazy`  
If true the image will be lazy loaded. Does not work if `div` is `true`

#### `<sb-rich-text />`

Parse and convert the Storyblok RichText field into html - https://www.storyblok.com/docs/richtext-field
`<sb-rich-text :text="item.myRichTextField" />`

##### Props
`text`  
JSON object from Storyblok RichText field

## Vue Storefront API

Copy `packages/vsf-storyblok-extension` to `vue-storefront-api/src/api/extensions`.

### Config

```
"registeredExtensions": ["vsf-storyblok-extension"],
...
"storyblok": {
  "previewToken": "__API_KEY_HERE__",
  "hookSecret": "__SECRET_CHANGE_ME__",
  "invalidate": "http://localhost:3000/invalidate?tag=storyblok&key=aeSu7aip"
}
```

## Reference

### `previewToken`

Go to `https://app.storyblok.com/#!/me/spaces/YOUR_SPACE_ID/edit?tab=api` and generate a preview token.

On the backend we use it to fetch posts when the webhook is polled. In the UI it's used for the preview functionality in Storyblok.

### `endpoint`

The URL the UI tries to fetch stories from

### `settings.appendStoreCodeFromHeader`

If set to true it will append the `x-vs-store-code` to the storyblok url. E.g. www.mysite.dk/foo with `x-vs-store-code=dk` would request the story `/dk/foo`.

### `hookSecret`

If this field is defined you have to provide this secret as a query param for your webhook. For example:

`http://localhost:8080/api/ext/vsf-storyblok-extension/hook`

would be

`http://localhost:8080/api/ext/vsf-storyblok-extension/hook?secret=__SECRET_CHANGE_ME__`

from our example config above. The secret is never needed in development mode.

### `invalidate`

URL to call after hook has been called

## Webhook

To sync all posts there's a hook available at `http://localhost:8080/api/ext/vsf-storyblok-extension/hook`

Follow the Storyblok documentation to enable it: https://www.storyblok.com/docs/Guides/using-storyblok-webhooks

## Development

```sh
git clone http://github.com/kodbruket/vsf-storyblok-sync.git
cd vsf-storyblok-sync
make submodules
docker-compose up
```

Visit http://localhost:3000/ci to see it in action

### Run full e2e suite

`make start-db submodules bundle start e2e`

[build badge]: https://github.com/kodbruket/vsf-storyblok-sync/workflows/Tests/badge.svg
[vsf badge]: https://img.shields.io/badge/VSF-1.11.1-brightgreen

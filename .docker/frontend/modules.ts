// import { extendModule } from '@vue-storefront/core/lib/module'
import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { Catalog } from '@vue-storefront/core/modules/catalog'
import { Cart } from '@vue-storefront/core/modules/cart'
import { Checkout } from '@vue-storefront/core/modules/checkout'
import { Compare } from '@vue-storefront/core/modules/compare'
import { Review } from '@vue-storefront/core/modules/review'
import { Mailer } from '@vue-storefront/core/modules/mailer'
import { Wishlist } from '@vue-storefront/core/modules/wishlist'
import { Mailchimp } from '../modules/mailchimp'
import { Notification } from '@vue-storefront/core/modules/notification'
import { RecentlyViewed } from '@vue-storefront/core/modules/recently-viewed'
import { Homepage } from './homepage'
import { Claims } from './claims'
import { PromotedOffers } from './promoted-offers'
import { Ui } from './ui-store'
import { AmpRenderer } from './amp-renderer'
import { PaymentBackendMethods } from './payment-backend-methods'
import { PaymentCashOnDelivery } from './payment-cash-on-delivery'
import { RawOutputExample } from './raw-output-example'
import { Magento2CMS } from './magento-2-cms'
import { Storyblok } from '@kodbruket/vsf-storyblok-module'

export const registerModules: VueStorefrontModule[] = [
  Checkout,
  Catalog,
  Cart,
  Compare,
  Review,
  Mailer,
  Wishlist,
  Mailchimp,
  Notification,
  Ui,
  RecentlyViewed,
  Homepage,
  Claims,
  PromotedOffers,
  Magento2CMS,
  PaymentBackendMethods,
  PaymentCashOnDelivery,
  RawOutputExample,
  AmpRenderer,
  Storyblok
]

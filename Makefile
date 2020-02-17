submodules:
	git submodule update --init

bundle:
	yarn docker-compose-bundler

start:
	cd .output/vue-storefront-api && yarn && yarn build && yarn start
	cd .output/vue-storefront && yarn && yarn build && yarn start

import-ci:
	cd .output/vue-storefront-api && \
	rm -rf var/magento2-sample-data && \
	yarn restore && \
	yarn migrate && \
	git clone https://github.com/magento/magento2-sample-data.git var/magento2-sample-data

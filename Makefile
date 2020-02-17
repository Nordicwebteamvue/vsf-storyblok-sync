submodules:
	git submodule update --init

bundle:
	yarn docker-compose-bundler

build:
	cd .output/vue-storefront-api && yarn & yarn build && yarn start
	cd .output/vue-storefront && yarn & yarn build && yarn start

submodules:
	git submodule update --init

bundle:
	mkdir -p .docker/vue-storefront/var
	yarn docker-compose-bundler
	sed -i.bak 's/storefront-api/localhost/' .output/vue-storefront/config/local.json

build-api:
	cd .output/vue-storefront-api && yarn && yarn build

start-api:
	cd .output/vue-storefront-api && yarn start

build-ui:
	cd .output/vue-storefront && yarn && yarn build

start-ui:
	cd .output/vue-storefront && yarn start

start: build-api start-api build-ui start-ui

start-db:
	docker-compose up -d elasticsearch redis

e2e:
	yarn e2e

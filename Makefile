phony:
	echo "Hi"

submodules:
	git submodule update --init

prebundle: submodules
	mkdir -p .docker/vue-storefront/var
	cd tools/bundle && yarn

bundle: prebundle
	node tools/bundle/index.js
	ex +g/mage2vuestorefront/d -cwq ./.output/vue-storefront-api/package.json

ci-start:
	cd .output/vue-storefront-api && yarn && yarn build && yarn start
	cd .output/vue-storefront && yarn && yarn build && yarn start
.PHONY: build deploy serve

build:
	npm run build

deploy:
	aws s3 sync dist/ s3://yeezyfan.club/ --delete --acl 'public-read'

serve:
	npm run serve
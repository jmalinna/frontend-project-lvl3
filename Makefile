install:
	npm install
	
develop:
	npm run build

lint:
	npx eslint .

publish:
	npm publish --dry-run

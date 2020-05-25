test-all:
	@docker-compose exec app ./node_modules/.bin/mocha --timeout 8000 'test/**/*.js'

migrate:
	@docker-compose exec app ./node_modules/.bin/sequelize db:migrate

migrate-undo:
	@docker-compose exec app ./node_modules/.bin/sequelize db:migrate:undo

init:
	@npm install
	@docker-compose up -d
	@make migrate

down:
	@docker-compose down

server:
	node .\server.js

redis:
	docker run --name rdb -p 6379:6379 -d redis:7-alpine


.PHONY: server, redis

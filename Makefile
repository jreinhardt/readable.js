.PHONY: clean lint test

SRC= src/language.js src/text.js src/prototypes.js src/simple-metrics.js

readable.js: $(SRC)
	cat $(SRC) > readable.js

readable.min.js: readable.js
	uglifyjs -nc -o readable.min.js readable.js

lint:
	node utils/check.js

test:
	node utils/server.js &
	x-www-browser localhost:8888/test/qunit/language.html &
	x-www-browser localhost:8888/test/qunit/metrics.html &
	x-www-browser localhost:8888/test/qunit/text.html &

clean:
	rm -rf readable.js
